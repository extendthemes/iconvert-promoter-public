import { Component } from '@wordpress/element';
import normalizeWheel from 'normalize-wheel';
import {
	getCropSize,
	restrictPosition,
	getDistanceBetweenPoints,
	getRotationBetweenPoints,
	computeCroppedArea,
	getCenter,
	getInitialCropFromCroppedAreaPixels,
	classNames,
} from './helpers';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

class Cropper extends Component {
	static defaultProps = {
		zoom: 1,
		rotation: 0,
		aspect: 4 / 3,
		maxZoom: MAX_ZOOM,
		minZoom: MIN_ZOOM,
		cropShape: 'rect',
		objectFit: 'contain',
		showGrid: true,
		style: {},
		classes: {},
		mediaProps: {},
		zoomSpeed: 1,
		restrictPosition: true,
		zoomWithScroll: true,
		ownerDocument: document,
	};

	imageRef = null;
	videoRef = null;
	containerRef = null;
	styleRef = null;
	containerRect = null;
	mediaSize = { width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 };
	dragStartPosition = { x: 0, y: 0 };
	dragStartCrop = { x: 0, y: 0 };
	lastPinchDistance = 0;
	lastPinchRotation = 0;
	rafDragTimeout = null;
	rafPinchTimeout = null;
	wheelTimer = null;

	state = {
		cropSize: null,
		hasWheelJustStarted: false,
	};

	componentDidMount() {
		window.addEventListener('resize', this.computeSizes);
		if (this.containerRef) {
			this.props.zoomWithScroll &&
				this.containerRef.addEventListener('wheel', this.onWheel, {
					passive: false,
				});
			this.containerRef.addEventListener(
				'gesturestart',
				this.preventZoomSafari
			);
			this.containerRef.addEventListener(
				'gesturechange',
				this.preventZoomSafari
			);
		}

		// when rendered via SSR, the image can already be loaded and its onLoad callback will never be called
		if (this.imageRef && this.imageRef.complete) {
			this.onMediaLoad();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.computeSizes);
		if (this.containerRef) {
			this.containerRef.removeEventListener(
				'gesturestart',
				this.preventZoomSafari
			);
			this.containerRef.removeEventListener(
				'gesturechange',
				this.preventZoomSafari
			);
		}

		if (this.styleRef) {
			this.styleRef.parentNode?.removeChild(this.styleRef);
		}

		this.cleanEvents();
		this.props.zoomWithScroll && this.clearScrollEvent();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.rotation !== this.props.rotation) {
			this.computeSizes();
			this.recomputeCropPosition();
		} else if (prevProps.aspect !== this.props.aspect) {
			this.computeSizes();
		} else if (prevProps.zoom !== this.props.zoom) {
			this.recomputeCropPosition();
		} else if (
			prevProps.cropSize?.height !== this.props.cropSize?.height ||
			prevProps.cropSize?.width !== this.props.cropSize?.width
		) {
			this.computeSizes();
		} else if (
			prevProps.crop?.x !== this.props.crop?.x ||
			prevProps.crop?.y !== this.props.crop?.y
		) {
			this.emitCropAreaChange();
		}
		if (
			prevProps.zoomWithScroll !== this.props.zoomWithScroll &&
			this.containerRef
		) {
			this.props.zoomWithScroll
				? this.containerRef.addEventListener('wheel', this.onWheel, {
						passive: false,
				  })
				: this.clearScrollEvent();
		}
		if (prevProps.video !== this.props.video) {
			this.videoRef?.load();
		}
	}

	// this is to prevent Safari on iOS >= 10 to zoom the page
	preventZoomSafari = (e) => e.preventDefault();

	cleanEvents = () => {
		this.props.ownerDocument.removeEventListener(
			'mousemove',
			this.onMouseMove
		);
		this.props.ownerDocument.removeEventListener(
			'mouseup',
			this.onDragStopped
		);
		this.props.ownerDocument.removeEventListener(
			'touchmove',
			this.onTouchMove
		);
		this.props.ownerDocument.removeEventListener(
			'touchend',
			this.onDragStopped
		);
	};

	clearScrollEvent = () => {
		if (this.containerRef)
			this.containerRef.removeEventListener('wheel', this.onWheel);
		if (this.wheelTimer) {
			clearTimeout(this.wheelTimer);
		}
	};

	onMediaLoad = () => {
		this.computeSizes();
		this.emitCropData();
		this.setInitialCrop();

		if (this.props.onMediaLoaded) {
			this.props.onMediaLoaded(this.mediaSize);
		}
	};

	setInitialCrop = () => {
		const { initialCroppedAreaPixels, cropSize } = this.props;

		if (!initialCroppedAreaPixels) {
			return;
		}

		const { crop, zoom } = getInitialCropFromCroppedAreaPixels(
			initialCroppedAreaPixels,
			this.mediaSize,
			cropSize
		);
		this.props.onCropChange(crop);
		this.props.onZoomChange && this.props.onZoomChange(zoom);
	};

	getAspect() {
		const { cropSize, aspect } = this.props;
		if (cropSize) {
			return cropSize.width / cropSize.height;
		}
		return aspect;
	}

	computeSizes = () => {
		const mediaRef = this.imageRef || this.videoRef;
		if (mediaRef && this.containerRef) {
			this.containerRect = this.containerRef.getBoundingClientRect();

			this.mediaSize = {
				width: mediaRef.offsetWidth,
				height: mediaRef.offsetHeight,
				naturalWidth:
					this.imageRef?.naturalWidth ||
					this.videoRef?.videoWidth ||
					0,
				naturalHeight:
					this.imageRef?.naturalHeight ||
					this.videoRef?.videoHeight ||
					0,
			};
			const cropSize = this.props.cropSize
				? this.props.cropSize
				: getCropSize(
						mediaRef.offsetWidth,
						mediaRef.offsetHeight,
						this.containerRect.width,
						this.containerRect.height,
						this.props.aspect,
						this.props.rotation
				  );

			if (
				this.state.cropSize?.height !== cropSize.height ||
				this.state.cropSize?.width !== cropSize.width
			) {
				this.props.onCropSizeChange &&
					this.props.onCropSizeChange(cropSize);
			}
			this.setState({ cropSize }, this.recomputeCropPosition);
		}
	};

	static getMousePoint = (e) => ({
		x: Number(e.clientX),
		y: Number(e.clientY),
	});

	static getTouchPoint = (touch) => ({
		x: Number(touch.clientX),
		y: Number(touch.clientY),
	});

	onMouseDown = (e) => {
		e.preventDefault();
		this.props.ownerDocument.addEventListener(
			'mousemove',
			this.onMouseMove
		);
		this.props.ownerDocument.addEventListener(
			'mouseup',
			this.onDragStopped
		);
		this.onDragStart(Cropper.getMousePoint(e));
	};

	onMouseMove = (e) => this.onDrag(Cropper.getMousePoint(e));

	onTouchStart = (e) => {
		e.preventDefault();
		this.props.ownerDocument.addEventListener(
			'touchmove',
			this.onTouchMove,
			{
				passive: false,
			}
		); // iOS 11 now defaults to passive: true
		this.props.ownerDocument.addEventListener(
			'touchend',
			this.onDragStopped
		);
		if (e.touches.length === 2) {
			this.onPinchStart(e);
		} else if (e.touches.length === 1) {
			this.onDragStart(Cropper.getTouchPoint(e.touches[0]));
		}
	};

	onTouchMove = (e) => {
		// Prevent whole page from scrolling on iOS.
		e.preventDefault();
		if (e.touches.length === 2) {
			this.onPinchMove(e);
		} else if (e.touches.length === 1) {
			this.onDrag(Cropper.getTouchPoint(e.touches[0]));
		}
	};

	onDragStart = ({ x, y }) => {
		this.dragStartPosition = { x, y };
		this.dragStartCrop = { ...this.props.crop };
		this.props.onInteractionStart?.();
	};

	onDrag = ({ x, y }) => {
		if (this.rafDragTimeout)
			window.cancelAnimationFrame(this.rafDragTimeout);

		this.rafDragTimeout = window.requestAnimationFrame(() => {
			if (!this.state.cropSize) return;
			if (x === undefined || y === undefined) return;
			const offsetX = x - this.dragStartPosition.x;
			const offsetY = y - this.dragStartPosition.y;
			const requestedPosition = {
				x: this.dragStartCrop.x + offsetX,
				y: this.dragStartCrop.y + offsetY,
			};

			const newPosition = this.props.restrictPosition
				? restrictPosition(
						requestedPosition,
						this.mediaSize,
						this.state.cropSize,
						this.props.zoom,
						this.props.rotation
				  )
				: requestedPosition;
			this.props.onCropChange(newPosition);
		});
	};

	onDragStopped = () => {
		this.cleanEvents();
		this.emitCropData();
		this.props.onInteractionEnd?.();
	};

	onPinchStart(e) {
		const pointA = Cropper.getTouchPoint(e.touches[0]);
		const pointB = Cropper.getTouchPoint(e.touches[1]);
		this.lastPinchDistance = getDistanceBetweenPoints(pointA, pointB);
		this.lastPinchRotation = getRotationBetweenPoints(pointA, pointB);
		this.onDragStart(getCenter(pointA, pointB));
	}

	onPinchMove(e) {
		const pointA = Cropper.getTouchPoint(e.touches[0]);
		const pointB = Cropper.getTouchPoint(e.touches[1]);
		const center = getCenter(pointA, pointB);
		this.onDrag(center);

		if (this.rafPinchTimeout)
			window.cancelAnimationFrame(this.rafPinchTimeout);
		this.rafPinchTimeout = window.requestAnimationFrame(() => {
			const distance = getDistanceBetweenPoints(pointA, pointB);
			const newZoom =
				this.props.zoom * (distance / this.lastPinchDistance);
			this.setNewZoom(newZoom, center);
			this.lastPinchDistance = distance;

			const rotation = getRotationBetweenPoints(pointA, pointB);
			const newRotation =
				this.props.rotation + (rotation - this.lastPinchRotation);
			this.props.onRotationChange &&
				this.props.onRotationChange(newRotation);
			this.lastPinchRotation = rotation;
		});
	}

	onWheel = (e) => {
		e.preventDefault();
		const point = Cropper.getMousePoint(e);
		const { pixelY } = normalizeWheel(e);
		const newZoom = this.props.zoom - (pixelY * this.props.zoomSpeed) / 200;
		this.setNewZoom(newZoom, point);

		if (!this.state.hasWheelJustStarted) {
			this.setState({ hasWheelJustStarted: true }, () =>
				this.props.onInteractionStart?.()
			);
		}

		if (this.wheelTimer) {
			clearTimeout(this.wheelTimer);
		}
		this.wheelTimer = window.setTimeout(
			() =>
				this.setState({ hasWheelJustStarted: false }, () =>
					this.props.onInteractionEnd?.()
				),
			250
		);
	};

	getPointOnContainer = ({ x, y }) => {
		if (!this.containerRect) {
			throw new Error('The Cropper is not mounted');
		}
		return {
			x: this.containerRect.width / 2 - (x - this.containerRect.left),
			y: this.containerRect.height / 2 - (y - this.containerRect.top),
		};
	};

	getPointOnMedia = ({ x, y }) => {
		const { crop, zoom } = this.props;
		return {
			x: (x + crop.x) / zoom,
			y: (y + crop.y) / zoom,
		};
	};

	setNewZoom = (zoom, point) => {
		if (!this.state.cropSize || !this.props.onZoomChange) return;

		const zoomPoint = this.getPointOnContainer(point);
		const zoomTarget = this.getPointOnMedia(zoomPoint);
		const newZoom = Math.min(
			this.props.maxZoom,
			Math.max(zoom, this.props.minZoom)
		);
		const requestedPosition = {
			x: zoomTarget.x * newZoom - zoomPoint.x,
			y: zoomTarget.y * newZoom - zoomPoint.y,
		};
		const newPosition = this.props.restrictPosition
			? restrictPosition(
					requestedPosition,
					this.mediaSize,
					this.state.cropSize,
					newZoom,
					this.props.rotation
			  )
			: requestedPosition;

		this.props.onCropChange(newPosition);
		this.props.onZoomChange(newZoom);
	};

	getCropData = () => {
		if (!this.state.cropSize) {
			return null;
		}

		// this is to ensure the crop is correctly restricted after a zoom back (https://github.com/ricardo-ch/react-easy-crop/issues/6)
		const restrictedPosition = this.props.restrictPosition
			? restrictPosition(
					this.props.crop,
					this.mediaSize,
					this.state.cropSize,
					this.props.zoom,
					this.props.rotation
			  )
			: this.props.crop;
		return computeCroppedArea(
			restrictedPosition,
			this.mediaSize,
			this.state.cropSize,
			this.getAspect(),
			this.props.zoom,
			this.props.rotation,
			this.props.restrictPosition
		);
	};

	emitCropData = () => {
		const cropData = this.getCropData();
		if (!cropData) return;

		const { croppedAreaPercentages, croppedAreaPixels } = cropData;
		if (this.props.onCropComplete) {
			this.props.onCropComplete(
				croppedAreaPercentages,
				croppedAreaPixels
			);
		}

		if (this.props.onCropAreaChange) {
			this.props.onCropAreaChange(
				croppedAreaPercentages,
				croppedAreaPixels
			);
		}
	};

	emitCropAreaChange = () => {
		const cropData = this.getCropData();
		if (!cropData) return;

		const { croppedAreaPercentages, croppedAreaPixels } = cropData;
		if (this.props.onCropAreaChange) {
			this.props.onCropAreaChange(
				croppedAreaPercentages,
				croppedAreaPixels
			);
		}
	};

	recomputeCropPosition = () => {
		if (!this.state.cropSize) return;

		const newPosition = this.props.restrictPosition
			? restrictPosition(
					this.props.crop,
					this.mediaSize,
					this.state.cropSize,
					this.props.zoom,
					this.props.rotation
			  )
			: this.props.crop;
		this.props.onCropChange(newPosition);
		this.emitCropData();
	};

	render() {
		const {
			image,
			video,
			mediaProps,
			transform,
			crop: { x, y },
			rotation,
			zoom,
			cropShape,
			showGrid,
			style: { containerStyle, cropAreaStyle, mediaStyle },
			classes: { containerClassName, cropAreaClassName, mediaClassName },
			objectFit,
		} = this.props;

		return (
			<div
				onMouseDown={this.onMouseDown}
				onTouchStart={this.onTouchStart}
				ref={(el) => (this.containerRef = el)}
				data-testid="container"
				style={containerStyle}
				className={classNames(
					'reactEasyCrop_Container',
					containerClassName
				)}
			>
				{image ? (
					<img
						alt=""
						className={classNames(
							'reactEasyCrop_Image',
							objectFit === 'contain' && 'reactEasyCrop_Contain',
							objectFit === 'horizontal-cover' &&
								'reactEasyCrop_Cover_Horizontal',
							objectFit === 'vertical-cover' &&
								'reactEasyCrop_Cover_Vertical',
							mediaClassName
						)}
						{...mediaProps}
						src={image}
						ref={(el) => (this.imageRef = el)}
						style={{
							...mediaStyle,
							transform:
								transform ||
								`translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${zoom})`,
						}}
						onLoad={this.onMediaLoad}
					/>
				) : (
					video && (
						<video
							autoPlay
							loop
							muted={true}
							className={classNames(
								'reactEasyCrop_Video',
								objectFit === 'contain' &&
									'reactEasyCrop_Contain',
								objectFit === 'horizontal-cover' &&
									'reactEasyCrop_Cover_Horizontal',
								objectFit === 'vertical-cover' &&
									'reactEasyCrop_Cover_Vertical',
								mediaClassName
							)}
							{...mediaProps}
							ref={(el) => (this.videoRef = el)}
							onLoadedMetadata={this.onMediaLoad}
							style={{
								...mediaStyle,
								transform:
									transform ||
									`translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${zoom})`,
							}}
							controls={false}
						>
							{(Array.isArray(video)
								? video
								: [{ src: video }]
							).map((item) => (
								<source key={item.src} {...item} />
							))}
						</video>
					)
				)}
				{this.state.cropSize && (
					<div
						style={{
							...cropAreaStyle,
							width: this.state.cropSize.width,
							height: this.state.cropSize.height,
						}}
						data-testid="cropper"
						className={classNames(
							'reactEasyCrop_CropArea',
							cropShape === 'round' &&
								'reactEasyCrop_CropAreaRound',
							showGrid && 'reactEasyCrop_CropAreaGrid',
							cropAreaClassName
						)}
					/>
				)}
			</div>
		);
	}
}

export default Cropper;
