import { LinkWrapper } from '@kubio/controls';
import {
	allowedRichTextFormats,
	BackgroundOverlay,
	useActiveMedia,
	useBlockElementProps,
	useDebounce,
	withColibriDataAutoSave,
	withStyledElements,
} from '@kubio/core';
import { useInheritedTextAlign } from '@kubio/global-data';
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import {
	BlockControls,
	BlockIcon,
	BlockList,
	MediaPlaceholder,
	MediaReplaceFlow,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	ToolbarButton,
	ToolbarGroup,
	withNotices,
} from '@wordpress/components';
import { compose, pure, useViewportMatch } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import {
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { crop, image as icon } from '@wordpress/icons';
import { getPath } from '@wordpress/url';
import classnames from 'classnames';
import { cloneDeep, get, includes, last, omit, pick } from 'lodash';
import { createUpgradedEmbedBlock } from '../../embed/util';
import { stylesMapper, useComputed } from '../component';
import { ElementsEnum } from '../elements';
import { getOuterAlignClasses, LinkApi } from './config';
import {
	ALLOWED_MEDIA_TYPES,
	DEFAULT_SIZE_SLUG,
	LINK_DESTINATION_ATTACHMENT,
	LINK_DESTINATION_MEDIA,
} from './constants';
import ImageEditor from './image-editor';
import { ImageToolbar } from './toolbar';
import useClientWidth from './use-client-width';

export const pickRelevantMediaFiles = (image) => {
	const imageProps = pick(image, ['alt', 'id', 'caption']);
	imageProps.url =
		get(image, ['sizes', DEFAULT_SIZE_SLUG, 'url']) ||
		get(image, [
			'media_details',
			'sizes',
			DEFAULT_SIZE_SLUG,
			'source_url',
		]) ||
		image.url;
	return imageProps;
};

/**
 * Is the URL a temporary blob URL? A blob URL is one that is used temporarily
 * while the image is being uploaded and will not have an id yet allocated.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 * @return {boolean} Is the URL a Blob URL
 */
const isTemporaryImage = (id, url) => !id && isBlobURL(url);

/**
 * Is the url for the image hosted externally. An externally hosted image has no
 * id and is not a blob url.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 * @return {boolean} Is the url an externally hosted url?
 */
const isExternalImage = (id, url) => url && !id && !isBlobURL(url);
const editingImageSizesDefault = {
	width: null,
	height: null,
};
const Component = (props) => {
	const {
		computed,
		StyledElements,
		dataHelper,
		setAttributes,
		isSelected,
		insertBlocksAfter,
		onReplace,
		noticeUI,
		noticeOperations,
	} = props;

	const {
		url,
		align,
		width,
		height,
		maxWidth,
		maxHeight,
		caption,
		captionEnabled,
		alt,
		id,
		sizeSlug,
		link,
		overlayBackground,
		withDataBinds,
		frameImageEnabledByMedia,
	} = computed;

	const linkApi = new LinkApi({ colibriLink: link });

	const { linkDestination } = linkApi.linkForGutenberg;

	const isLargeViewport = useViewportMatch('medium');
	const [captionFocused, setCaptionFocused] = useState(false);
	const isWideAligned = includes(['wide', 'full'], align);
	const [{ naturalWidth, naturalHeight }, setNaturalSize] = useState({});
	const [isEditingImage, setIsEditingImage] = useState(false);
	const imagePickerRef = useRef();
	//only used when image has max-width/max-height
	const [editingImageSizes, setEditingImageSizes] = useState(
		editingImageSizesDefault
	);
	const containerRef = useRef();
	let { clientWidth, calculateClientWidth } = useClientWidth(containerRef, [
		align,
	]);
	const isResizable = !isWideAligned && isLargeViewport;
	const mediaUpload = useSelect((select) => {
		const { getSettings } = select('core/block-editor');
		return getSettings().mediaUpload;
	});

	useEffect(() => {
		if (isEditingImage) {
			setIsEditingImage(false);
		}
	}, [maxWidth, maxHeight, sizeSlug]);

	function onUploadError(message) {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	}

	function computeImageSizes() {
		if (!maxWidth && !maxHeight) {
			setEditingImageSizes(cloneDeep(editingImageSizesDefault));
			return;
		}
		const containerNode = containerRef?.current;
		if (!containerNode) {
			return;
		}
		// eslint-disable-next-line no-shadow
		const image = containerNode.querySelector('img');
		if (!image) {
			return;
		}
		// eslint-disable-next-line no-shadow
		const width = image.width;
		// eslint-disable-next-line no-shadow
		const height = image.height;
		const sizes = {
			width,
			height,
		};
		setEditingImageSizes(sizes);
	}
	function onSelectImage(media) {
		if (!media || !media.url) {
			dataHelper.setAttributes({
				url: '',
				alt: '',
				id: '',
				title: '',
				caption: '',
			});
			return;
		}

		let mediaAttributes = pickRelevantMediaFiles(media);

		// If the current image is temporary but an alt text was meanwhile
		// written by the user, make sure the text is not overwritten.
		if (isTemporaryImage(id, url)) {
			if (alt) {
				mediaAttributes = omit(mediaAttributes, ['alt']);
			}
		}

		// If a caption text was meanwhile written by the user,
		// make sure the text is not overwritten by empty captions.
		if (caption && !get(mediaAttributes, ['caption'])) {
			mediaAttributes = omit(mediaAttributes, ['caption']);
		}

		let additionalAttributes;
		// Reset the dimension attributes if changing to a different image.
		if (!media.id || media.id !== id) {
			// if (withDataBinds.width.value) {
			// 	withDataBinds.width.onReset();
			// }
			// if (withDataBinds.height.value) {
			// 	withDataBinds.height.onReset();
			// }

			additionalAttributes = {
				sizeSlug: DEFAULT_SIZE_SLUG,
			};
		} else {
			// Keep the same url when selecting the same file, so "Image Size"
			// option is not changed.
			additionalAttributes = { url };
		}

		// Check if the image is linked to it's media.
		if (linkDestination === LINK_DESTINATION_MEDIA) {
			// Update the media link.
			mediaAttributes.href = media.url;
		}

		// Check if the image is linked to the attachment page.
		if (linkDestination === LINK_DESTINATION_ATTACHMENT) {
			// Update the media link.
			mediaAttributes.href = media.link;
		}

		dataHelper.setAttributes({
			...mediaAttributes,
			...additionalAttributes,
		});
	}

	function onSelectURL(newURL) {
		if (newURL !== url) {
			dataHelper.setAttributes({
				url: newURL,
				id: '',
				sizeSlug: DEFAULT_SIZE_SLUG,
			});
		}
	}

	const isTemp = isTemporaryImage(id, url);

	// Upload a temporary image on mount.
	useEffect(() => {
		if (!isTemp) {
			return;
		}

		const file = getBlobByURL(url);

		if (file) {
			mediaUpload({
				filesList: [file],
				onFileChange: ([img]) => {
					onSelectImage(img);
				},
				allowedTypes: ALLOWED_MEDIA_TYPES,
				onError: (message) => {
					noticeOperations.createErrorNotice(message);
				},
			});
		}
	}, []);
	// If an image is temporary, revoke the Blob url when it is uploaded (and is
	// no longer temporary).
	useEffect(() => {
		if (!isTemp) {
			return;
		}

		return () => {
			revokeBlobURL(url);
		};
	}, [isTemp]);

	const isExternal = isExternalImage(id, url);

	useEffect(() => {
		if (isExternal && id) {
			dataHelper.setAttribute('id', '');
		}
	}, [isExternal]);

	const src = isExternal ? url : undefined;
	const mediaPreview = !!url && (
		<img
			alt={__('Edit image', 'kubio')}
			title={__('Edit image', 'kubio')}
			className={'edit-image-preview'}
			src={url}
		/>
	);

	const mediaPlaceholder = (
		<MediaPlaceholder
			icon={<BlockIcon icon={icon} />}
			onSelect={onSelectImage}
			onSelectURL={onSelectURL}
			notices={noticeUI}
			onError={onUploadError}
			accept="image/*"
			allowedTypes={ALLOWED_MEDIA_TYPES}
			value={{ id, src }}
			mediaPreview={mediaPreview}
			disableMediaButtons={url}
		/>
	);

	useEffect(() => {
		if (!isSelected) {
			setCaptionFocused(false);
		} else {
			calculateClientWidth();
		}
	}, [isSelected]);

	function onImageError() {
		// Check if there's an embed block that handles this URL.
		const embedBlock = createUpgradedEmbedBlock({
			attributes: { url },
		});
		if (undefined !== embedBlock) {
			onReplace(embedBlock);
		}
	}

	function onFocusCaption() {
		if (!captionFocused) {
			setCaptionFocused(true);
		}
	}

	function onImageClick() {
		if (captionFocused) {
			setCaptionFocused(false);
		}
	}

	useEffect(() => {
		if (!isSelected) {
			setIsEditingImage(false);
		}
	}, [isSelected]);

	const canEditImage = id && naturalWidth && naturalHeight;

	function onStartCropping() {
		computeImageSizes();
		setIsEditingImage(true);
	}
	const controls = (
		<>
			<BlockControls>
				{/* !isEditingImage && ( - the sidebr does not support dynamic links - commented for now
					<ToolbarGroup>
						<ImageURLInputUI
							url={href || ''}
							onChangeUrl={onSetHref}
							linkDestination={linkDestination}
							mediaUrl={image && image.source_url}
							mediaLink={image && image.link}
							linkTarget={linkTarget}
							linkClass={linkClass}
							rel={rel}
						/>
					</ToolbarGroup>
				) */}
				{canEditImage && !isEditingImage && (
					<ToolbarGroup>
						<ToolbarButton
							onClick={onStartCropping}
							icon={crop}
							label={__('Crop', 'kubio')}
						/>
					</ToolbarGroup>
				)}
				{!isEditingImage && (
					<ToolbarGroup>
						<MediaReplaceFlow
							mediaId={id}
							mediaURL={url}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							accept="image/*"
							onSelect={onSelectImage}
							onSelectURL={onSelectURL}
							onError={onUploadError}
						/>
					</ToolbarGroup>
				)}
			</BlockControls>
		</>
	);

	const imagePicker = (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={onSelectImage}
				allowedTypes={ALLOWED_MEDIA_TYPES}
				value={id}
				render={({ open }) => (
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events
					<span
						ref={imagePickerRef}
						onClick={open}
						className="kubio-image-media-picker"
						role={'button'}
						tabIndex={-1}
					/>
				)}
			/>
		</MediaUploadCheck>
	);

	function openMediaPicker() {
		const imagePickerNode = imagePickerRef?.current;
		if (!imagePickerNode) {
			return;
		}
		imagePickerNode.click();
	}

	const frameImage = <StyledElements.FrameImage />;

	const overlay = (
		<StyledElements.Overlay>
			<BackgroundOverlay value={overlayBackground} />
		</StyledElements.Overlay>
	);

	const element = useContext(BlockList.__unstableElementContext);
	const ownerDocument = element?.ownerDocument;

	const activeMedia = useActiveMedia();
	const frameImageEnabled = frameImageEnabledByMedia[activeMedia];

	let img = useMemo(
		() => (
			// Disable reason: Image itself is not meant to be interactive, but
			// should direct focus to block.
			/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
			<>
				<LinkWrapper link={link}>
					<StyledElements.FrameContainer
						onDoubleClick={openMediaPicker}
					>
						{withDataBinds.overlayEnabled && overlay}
						<StyledElements.Image
							onClick={onImageClick}
							onError={onImageError}
							onLoad={(event) => {
								calculateClientWidth();
								setNaturalSize(
									pick(event.target, [
										'naturalWidth',
										'naturalHeight',
									])
								);
							}}
						/>
						{frameImageEnabled && frameImage}
					</StyledElements.FrameContainer>
				</LinkWrapper>
				{imagePicker}
			</>
		),
		/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
		[
			url,
			withDataBinds.overlayEnabled,
			frameImageEnabled,
			overlayBackground,
			withDataBinds.frameImage,
		]
	);

	let imageWidthWithinContainer;
	let imageHeightWithinContainer;

	if (clientWidth && naturalWidth && naturalHeight) {
		const exceedMaxWidth = naturalWidth > clientWidth;
		const ratio = naturalHeight / naturalWidth;
		imageWidthWithinContainer = exceedMaxWidth ? clientWidth : naturalWidth;
		imageHeightWithinContainer = exceedMaxWidth
			? clientWidth * ratio
			: naturalHeight;
	}

	const onImageEditorChange = ({ nextWidth, nextHeight, ...attributes }) => {
		setAttributes(attributes);
	};
	if (canEditImage && isEditingImage) {
		let currentWidth;
		let currentHeight;
		if (editingImageSizes?.width) {
			currentWidth = editingImageSizes?.width;
			clientWidth = currentWidth;
		} else {
			currentWidth =
				width && width !== 'auto' ? width : imageWidthWithinContainer;
		}

		if (editingImageSizes?.height) {
			currentHeight = editingImageSizes?.height;
		} else {
			currentHeight =
				height && height !== 'auto'
					? height
					: imageHeightWithinContainer;
		}
		img = (
			<ImageEditor
				id={id}
				url={url}
				setAttributes={onImageEditorChange}
				naturalWidth={naturalWidth}
				naturalHeight={naturalHeight}
				width={currentWidth}
				height={currentHeight}
				clientWidth={currentWidth}
				setIsEditingImage={setIsEditingImage}
				ownerDocument={ownerDocument}
				currentSlug={sizeSlug}
			/>
		);
	} else if (!isResizable || !imageWidthWithinContainer) {
	}

	const split = () => insertBlocksAfter(createBlock('core/paragraph'));
	const captionProps = useBlockElementProps(ElementsEnum.CAPTION);
	const onChange = useDebounce(withDataBinds.caption.onChange, 100);
	const imgWithControls = (
		<>
			{controls}
			<StyledElements.CaptionContainer>
				{img}
				{(!RichText.isEmpty(caption) || isSelected) &&
					captionEnabled && (
						<RichText
							{...captionProps}
							tagName="figcaption"
							placeholder={__('Write caption…', 'kubio')}
							value={caption}
							unstableOnFocus={onFocusCaption}
							onChange={onChange}
							isSelected={captionFocused}
							inlineToolbar
							__unstableOnSplitAtEnd={split}
							allowedFormats={allowedRichTextFormats}
						/>
					)}
			</StyledElements.CaptionContainer>
		</>
	);
	return (
		<>
			<ImageToolbar computed={computed} />
			<StyledElements.Outer ref={containerRef}>
				{url && imgWithControls}
				{mediaPlaceholder}
			</StyledElements.Outer>
		</>
	);
};

const elementsMapperUI = ({ computed, isSelected, className }) => {
	const { url, width, height, align, alt, sizeSlug } = computed;
	return {
		[ElementsEnum.OUTER]: {
			className: () => {
				const alignClasses = getOuterAlignClasses(align);
				return classnames(
					className,
					{
						'is-transient': isBlobURL(url),
						'is-resized': !!width || !!height,
						'is-focused': isSelected,
						[`size-${sizeSlug}`]: sizeSlug,
					},
					alignClasses
				);
			},
		},
		[ElementsEnum.IMAGE]: {
			alt,
		},
	};
};

const attributes = [
	'url',
	'alt',
	'id',
	'caption',
	'captionEnabled',
	'sizeSlug',
	'link',
];

const useComputedEdit = (dataHelper, ownProps) => {
	const defaultTextAlign = useInheritedTextAlign(dataHelper);
	return useMemo(() => {
		const alignOnChange = (newAlign) => {
			const align = newAlign ? newAlign : 'none';

			dataHelper.setAttribute('align', align);
			dataHelper.setStyle('textAlign', align, {
				styledComponent: ElementsEnum.OUTER,
			});
		};

		const withDataBinds = {
			...dataHelper.useAttributes(attributes),
			overlayEnabled: dataHelper.getStyle(
				'background.overlay.enabled',
				false,
				{ styledComponent: ElementsEnum.OVERLAY }
			),

			frameImage: dataHelper.getPropInMedia('frame'),
			useCustomDimensions: dataHelper.usePropPath('useCustomDimensions'),
			align: {
				value: dataHelper.getAttribute('align', defaultTextAlign),
				onChange: alignOnChange,
			},
		};

		return {
			...dataHelper.getAttributes(attributes),
			maxWidth: dataHelper.getStyle('maxWidth', null, {
				styledComponent: ElementsEnum.IMAGE,
			}),
			maxHeight: dataHelper.getStyle('maxHeight', null, {
				styledComponent: ElementsEnum.IMAGE,
			}),
			withDataBinds,
			frameImageEnabledByMedia: dataHelper.getPropByMedia(
				'frame.enabled',
				false
			),
		};
	}, [dataHelper, defaultTextAlign]);
};

const ImageCompose = compose(
	pure,
	withColibriDataAutoSave([useComputed, useComputedEdit]),
	pure,
	withStyledElements(stylesMapper, elementsMapperUI),
	withNotices
);

const Image = ImageCompose(Component);

export { Image };
