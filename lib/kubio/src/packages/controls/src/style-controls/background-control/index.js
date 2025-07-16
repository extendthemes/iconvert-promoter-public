import { STORE_KEY } from '@kubio/constants';
import { useDeepCallback } from '@kubio/core';
import { AddItemIcon } from '@kubio/icons';
import { addProTagToItems, useProModal } from '@kubio/pro';
import { deviceToMedia, mergeNoArrays } from '@kubio/utils';
import {
	BaseControl,
	Button,
	FormToggle,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalInputControl as InputControl,
	Tip,
	withFilters,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	each,
	find,
	get,
	intersection,
	isArray,
	isEmpty,
	isFunction,
	isObject,
	merge,
	mergeWith,
	noop,
	set,
} from 'lodash';
import isEqual from 'react-fast-compare';
import {
	ColorIndicatorPopover,
	FocalPointMediaPicker,
	GradientControlWithPresets,
	GutentagSelectControl,
	InlineLabeledControl,
	MediaPicker,
	PopoverOptionsButton,
	RangeWithUnitControl,
	SeparatorHorizontalLine,
	SortableAccordion,
	ToggleGroup,
} from '../../components';
import GutentagRangeControl from '../../components/range-control/range-control';
import { ControlNotice } from '../../notices';
import * as BackgroundUiUtils from './constants';

import { useUIVersion } from '@kubio/core-hooks';

const {
	DefaultValue,
	overlayShapes,
	BackgroundTypesOptions,
	ImagePositionMap,
	ImageProperties,
	imagePositionToShorthand,
	BackgroundTypesEnum,
	videoTypes,
} = BackgroundUiUtils;

const SlideShowDefault = DefaultValue.slideshow;

const sizeUnitsOptions = [ { label: __( '%', 'kubio' ), value: '%' } ];

const OverlayControl = ( {
	localValue,
	updateValue = noop,
	onReset = noop,
	showOverlayOptionsOnFree = false,
	overlayLabel = __( 'Background overlay', 'kubio' ),
} ) => {
	// const [gradientAlpha, updateGradientAlpha] = useState(0.5);
	const overlayType = get( localValue, 'overlay.type' );
	const overlayShape = get( localValue, 'overlay.shape.value' );
	const handleReset = ( path ) => () => {
		onReset( path );
	};

	const { uiVersion: KUBIO_UI_VERSION } = useUIVersion();

	return (
		<PopoverOptionsButton
			isProOnly={ ! showOverlayOptionsOnFree }
			label={ overlayLabel }
			toggable={ true }
			upgradeUrlArgs={ { source: 'background', content: 'overlay' } }
			onToggleChange={ ( newValue ) =>
				updateValue( 'overlay.enabled', newValue )
			}
			enabled={ get( localValue, 'overlay.enabled', false ) }
			position={
				KUBIO_UI_VERSION === 2 ? 'bottom center' : 'middle left'
			}
			popupContent={
				<div className={ 'kubio-background-overlay-container' }>
					<BaseControl>
						<BaseControl>
							<ToggleGroup
								utmSource={ 'background' }
								className={
									'kubio-background-overlay-toggle-group'
								}
								value={ get( localValue, 'overlay.type' ) }
								onChange={ ( newValue ) =>
									updateValue( 'overlay.type', newValue )
								}
								options={ [
									{
										value: 'color',
										label: __( 'Color', 'kubio' ),
									},
									{
										value: 'gradient',
										label: __( 'Gradient', 'kubio' ),
									},
									{
										value: 'shapeOnly',
										label: __( 'Shape Only', 'kubio' ),
									},
								] }
							/>
						</BaseControl>

						{ overlayType === 'color' && (
							<>
								<ColorIndicatorPopover
									showReset={ true }
									alpha={ false }
									color={ get(
										localValue,
										'overlay.color.value'
									) }
									label={ __( 'Color', 'kubio' ) }
									onChange={ ( value ) =>
										updateValue(
											'overlay.color.value',
											value
										)
									}
									onReset={ handleReset(
										'overlay.color.value'
									) }
								/>
								<div className="kubio-background-overlay-range-control">
									<GutentagRangeControl
										label={ __( 'Opacity', 'kubio' ) }
										className={
											'kubio-background-overlay-opacity'
										}
										resetValue={ 0.5 }
										value={ get(
											localValue,
											'overlay.color.opacity'
										) }
										onChange={ ( value ) => {
											updateValue(
												'overlay.color.opacity',
												value.toFixed( 2 )
											);
										} }
										min={ 0 }
										max={ 1 }
										capMin={ true }
										capMax={ true }
										step={ 0.1 }
									/>
								</div>
							</>
						) }

						{ overlayType === 'gradient' && (
							<>
								<GradientControlWithPresets
									value={ get(
										localValue,
										'overlay.gradient'
									) }
									label={ __( 'Gradient', 'kubio' ) }
									onChange={ ( value ) =>
										updateValue( 'overlay.gradient', value )
									}
									forceAlpha={ false }
									presetsNumber={ 5 }
									withPreviewer={ false }
									forceAlphaForPreset={ 0.7 }
									showExternalOpacityControl={ true }
								/>
								{ /*<div className="kubio-background-overlay-range-control">*/ }
								{ /*	<GutentagRangeControl*/ }
								{ /*		label={__('Opacity', 'kubio')}*/ }
								{ /*		className={*/ }
								{ /*			'kubio-background-overlay-opacity'*/ }
								{ /*		}*/ }
								{ /*		value={gradientAlpha}*/ }
								{ /*		onChange={(value) =>*/ }
								{ /*			updateGradientAlphaValue(*/ }
								{ /*				value.toFixed(2)*/ }
								{ /*			)*/ }
								{ /*		}*/ }
								{ /*		onReset={() => {*/ }
								{ /*			updateGradientAlphaValue(0.5);*/ }
								{ /*		}}*/ }
								{ /*		min={0}*/ }
								{ /*		max={1}*/ }
								{ /*		capMin={true}*/ }
								{ /*		step={0.1}*/ }
								{ /*	/>*/ }
								{ /*</div>*/ }
							</>
						) }
					</BaseControl>

					{ overlayType !== 'shapeOnly' && (
						<SeparatorHorizontalLine />
					) }

					<GutentagSelectControl
						label={ __( 'Overlay shape', 'kubio' ) }
						value={ get( localValue, 'overlay.shape.value' ) }
						options={ overlayShapes }
						inlineLabel={ false }
						onChange={ ( newValue ) => {
							const { value, isTile } = find( overlayShapes, {
								value: newValue,
							} );
							updateValue( 'overlay.shape', {
								value,
								isTile,
							} );
						} }
					/>

					{ overlayShape !== 'none' && (
						<div className="kubio-background-overlay-range-control kubio-range-control-tooltip-above">
							<GutentagRangeControl
								label={ __( 'Shape light', 'kubio' ) }
								className={
									'kubio-background-overlay-shape-light'
								}
								resetValue={ 0 }
								value={ get(
									localValue,
									'overlay.shape.light'
								) }
								onChange={ ( value ) =>
									updateValue( 'overlay.shape.light', value )
								}
							/>
						</div>
					) }
				</div>
			}
		/>
	);
};

const BackgroundControl = ( {
	value: initialValue = {},
	//set state as normal by default to avoid problems with not setting state on every location the control is used
	state = '',
	labelColor = __( 'Background color', 'kubio' ),
	onChange: onValueChange,
	onReset: onValueReset = noop,
	filters = {},
	...otherProps
} ) => {
	const currentMedia = useSelect( ( select ) => {
		const store =
			select( STORE_KEY ) ||
			select( 'core/edit-post' ) ||
			select( 'core/edit-site' );
		const activeDevice =
			store?.__experimentalGetPreviewDeviceType() || 'desktop';

		return deviceToMedia( activeDevice );
	}, [] );

	const [ value, setValue ] = useState( initialValue );

	//merge no array but ignore the image array(just merge the image array normally)
	const mergedValue = mergeWith(
		{},
		DefaultValue,
		value,
		( objValue, srcValue ) => {
			if (
				isArray( objValue ) &&
				isArray( srcValue ) &&
				//the background image is an array, skip it
				! get( objValue, '[0].attachment' ) &&
				srcValue.length
			) {
				return srcValue;
			}
		}
	);

	const getValue = ( path, defaultValue ) => {
		return get( mergedValue, path, defaultValue );
	};

	const isNormalState = state === '' || state === 'normal';

	const bgType = getValue( 'type' );

	const bgIsNoneImageOrGradient =
		bgType === BackgroundTypesEnum.NONE ||
		bgType === BackgroundTypesEnum.IMAGE ||
		bgType === BackgroundTypesEnum.GRADIENT;

	const bgIsVideoOrSlideshow =
		bgType === BackgroundTypesEnum.VIDEO ||
		bgType === BackgroundTypesEnum.SLIDESHOW;

	const onChange = useDeepCallback(
		( nextValue, path, options ) => {
			const localChanges = merge( {}, value, nextValue );
			setValue( localChanges );
			onValueChange( nextValue, path, options );
		},
		[ value, setValue, onValueChange ]
	);

	useEffect( () => {
		if ( ! isEqual( initialValue, value ) ) {
			setValue( initialValue );
		}
	}, [ initialValue ] );

	const filtersDefault = {
		types: [ 'none', 'image', 'gradient' ],
		freeTypes: [ 'none', 'image', 'gradient' ],
		image: {
			showParallax: false,
			forceBackgroundLayer: false,
			featuredImage: {
				show: false,
			},
		},
		showOverlayOptions: false,
	};

	const mergedFilters = mergeNoArrays( {}, filtersDefault, filters );
	const allowedTypes = get( mergedFilters, 'types', [] );
	const allowedFreeTypes = get( mergedFilters, 'freeTypes', [] );
	const showOverlayOptions =
		get( mergedFilters, 'showOverlayOptions' ) && isNormalState;
	const showOverlayOptionsOnFree = get(
		mergedFilters,
		'showOverlayOptionsOnFree'
	);
	const showImageParallax =
		get( mergedFilters, 'image.showParallax' ) && isNormalState;
	const showFeaturedImage =
		get( mergedFilters, 'image.featuredImage.show' ) && isNormalState;

	let availableTypes = BackgroundTypesOptions.filter( ( type ) =>
		allowedTypes.includes( type.value )
	);
	const freeTypes = intersection( allowedTypes, allowedFreeTypes );

	availableTypes = addProTagToItems( availableTypes, freeTypes );

	let disabledTypes = [];
	if ( ! isNormalState ) {
		if ( bgIsNoneImageOrGradient ) {
			disabledTypes = [
				BackgroundTypesEnum.VIDEO,
				BackgroundTypesEnum.SLIDESHOW,
			];
		}
		if ( bgIsVideoOrSlideshow ) {
			disabledTypes = Object.values( BackgroundTypesEnum );
			//remove the current type
			//disabledTypes = allTypes.filter((type) => type !== bgType);
		}
	}

	const isImageParallax = !! getValue( 'image.0.useParallax' );
	const isFeaturedImage = !! getValue( 'image.0.useFeaturedImage' );

	const { featuredImageUrl } = useSelect( ( select ) => {
		const featuredImageId =
			select( 'core/editor' ).getEditedPostAttribute( 'featured_media' );
		let featuredImageData = null;
		if ( 0 !== featuredImageId ) {
			featuredImageData = select( 'core' ).getMedia( featuredImageId );
			featuredImageData = get( featuredImageData, 'source_url' );
		}

		return {
			featuredImageUrl: featuredImageData,
		};
	} );

	let imageURL = getValue( 'image.0.source.url' );

	// Avoid setting this from featured image when we don't have one.
	if ( isFeaturedImage && !! featuredImageUrl ) {
		imageURL = featuredImageUrl;
	}
	const imagePosition = getValue( 'image.0.position', { x: 50, y: 50 } );
	const videoPosition = getValue( 'video.position', { x: 50, y: 50 } );

	let imageSize = getValue( 'image.0.size' );
	if ( imageSize ) {
		if ( isObject( imageSize ) ) {
			imageSize = 'custom';
		}
	}

	const imageFocalPoint = ! isObject( imagePosition )
		? ImagePositionMap[ imagePosition ]
		: imagePosition;

	const customPositionLeft = {
		value: imageFocalPoint.x,
		unit: '%',
	};
	const customPositionTop = {
		value: imageFocalPoint.y,
		unit: '%',
	};

	const imageHasCustomPosition = useMemo( () => {
		if ( isObject( imagePosition ) ) {
			return ! find( ImagePositionMap, imagePosition );
		}
		return false;
	}, [ imagePosition ] );

	const imageDropDownPosition = imageHasCustomPosition
		? 'custom'
		: imagePositionToShorthand( imagePosition );

	const [ currentPosition, setCurrentPosition ] = useState(
		imageDropDownPosition
	);

	const videoFocalPoint = ! isObject( videoPosition )
		? ImagePositionMap[ videoPosition ]
		: videoPosition;

	const customVideoPositionLeft = {
		value: videoFocalPoint.x,
		unit: '%',
	};
	const customVideoPositionTop = {
		value: videoFocalPoint.y,
		unit: '%',
	};

	const videoHasCustomPosition = useMemo( () => {
		if ( isObject( videoPosition ) ) {
			return ! find( ImagePositionMap, videoPosition );
		}
		return false;
	}, [ videoPosition ] );

	const videoDropDownPosition = videoHasCustomPosition
		? 'custom'
		: imagePositionToShorthand( videoPosition );

	const [ currentVideoPosition, setCurrentVideoPosition ] = useState(
		videoDropDownPosition
	);

	const possibleImagePositions = ImageProperties.position;
	const videoType = getValue( 'video.type' );

	const slideshowItems = getValue( `slideshow.slides`, [] ).map( ( item ) => {
		return { ...item, icon: false };
	} );

	// setters
	const updateValue = ( path, updatedValue ) => {
		const newValue = set( {}, path, updatedValue );
		onChange( newValue );
	};
	const updateValueNoMergeArrays = ( path, updatedValue ) => {
		const newValue = set( {}, path, updatedValue );

		onValueChange( newValue, null, { mergeArrays: false } );
		const localChanges = mergeNoArrays( {}, value, newValue );
		setValue( localChanges );
	};
	const updatePosition = ( updatedValue ) => {
		if ( updatedValue !== 'custom' ) {
			updateValue( 'image.0.position', updatedValue );
		}

		setCurrentPosition( updatedValue );
	};

	const updateVideoPosition = ( updatedValue ) => {
		if ( updatedValue !== 'custom' ) {
			updateValue( 'video.position', ImagePositionMap[ updatedValue ] );
		}

		setCurrentVideoPosition( updatedValue );
	};

	const onOverlayReset = ( path ) => {
		onReset( path )();
	};
	const onReset = ( path ) => () => {
		if ( 'image.0.position' === path ) {
			setCurrentPosition( 'center center' );
		}
		onValueReset( path );
	};

	const updateValues = ( valuesMap = {} ) => {
		let newValue = {};

		each( valuesMap, ( updatedValue, path ) => {
			newValue = set( newValue, path, updatedValue );
		} );

		onChange( newValue );
	};

	const onColorChange = ( newColor ) => {
		updateValue( 'color', newColor );
	};

	const onBackgroundTypeChange = ( newType ) => {
		const newValue = {
			type: newType,
		};

		if (
			newType === BackgroundTypesEnum.GRADIENT ||
			newType === BackgroundTypesEnum.IMAGE
		) {
			set( newValue, 'image[0].source.type', newType );
		}

		if (
			isNormalState &&
			( newType === BackgroundTypesEnum.VIDEO ||
				newType === BackgroundTypesEnum.SLIDESHOW )
		) {
			//container like components(column, row, section, etc...) only have normal and hover states. These types
			//of components are the only ones that supports video/slideshow bg
			const states = [ 'hover' ];

			//This issue is not fixed: http://mantis.extendstudio.net/view.php?id=37950. But the problem is low priority
			// eslint-disable-next-line no-shadow
			states.forEach( ( state ) => {
				onChange( {}, null, {
					unset: true,
					state,
					media: currentMedia,
				} );
			} );
		}

		onChange( newValue );
		//remove image url when changing type so no unwanted images are saved in predefined sections by mistake
		if ( newType !== BackgroundTypesEnum.IMAGE ) {
			onValueReset( 'image[0].source.url' );
			onValueReset( 'image[0].position' );
			onValueReset( 'image[0].sizeCustom' );
		}
	};

	const onBackgroundTypeReset = () => {
		// if (!isNormalState) {
		onValueReset();
		// }
	};

	const onImageChange = ( newImageValue ) => {
		updateValues( {
			'image.0.source.url': newImageValue.url,
			'image.0.position': newImageValue.focalPoint,
		} );
	};

	const onInternalVideoChange = ( newVideoValue ) => {
		updateValues( {
			'video.internal.url': newVideoValue.url,
			'video.position': newVideoValue.focalPoint,
		} );
	};
	const onPositionChange = ( newPositionX, newPositionY ) => {
		const focalPoint = {
			x: newPositionX,
			y: newPositionY,
		};
		const newValue = set( {}, 'image.0.position', focalPoint );
		onChange( newValue );
	};

	const onVideoPositionChange = ( newPositionX, newPositionY ) => {
		const focalPoint = {
			x: newPositionX,
			y: newPositionY,
		};
		const newValue = set( {}, 'video.position', focalPoint );
		onChange( newValue );
	};

	const getSizeValue = ( side ) => {
		return get( mergedValue, `image.0.sizeCustom.${ side }`, 0 );
	};

	const onCustomSizeChange = ( side, nextValue ) => {
		const customSize = {
			size: 'custom',
			sizeCustom: {
				[ side ]: nextValue,
			},
		};

		const changes = set( {}, 'image.0', customSize );
		onChange( changes );
	};

	const onSlideshowSortEnd = ( { oldIndex, newIndex } ) => {
		const newItems = [ ...slideshowItems ];
		const item = newItems.splice( oldIndex, 1 )[ 0 ];

		newItems.splice( newIndex, 0, item );
		// eslint-disable-next-line no-shadow
		newItems.forEach( ( item, index ) => ( item.id = index + 1 ) );

		updateValueNoMergeArrays( `slideshow.slides`, newItems );
	};

	const removeSlideshowItem = ( item, index ) => {
		const newItems = [ ...slideshowItems ];
		newItems.splice( index, 1 );
		// eslint-disable-next-line no-shadow
		newItems.forEach( ( item, index ) => ( item.id = index + 1 ) );
		updateValueNoMergeArrays( `slideshow.slides`, newItems );
	};
	const addSlideshowItem = ( startFrom ) => {
		const newItems = [ ...slideshowItems ];
		startFrom = startFrom ?? SlideShowDefault.slides[ 0 ];
		const item = {
			...startFrom,
			id: newItems.length + 1,
		};
		newItems.push( item );
		updateValueNoMergeArrays( `slideshow.slides`, newItems );
	};

	const onDuplicate = ( slideId ) => {
		const newItems = [ ...slideshowItems ];
		const itemToDuplicateIndex = newItems.findIndex(
			( slide ) => slide.id === slideId
		);
		const newItem = { ...newItems[ itemToDuplicateIndex ] };
		newItems.splice( itemToDuplicateIndex + 1, 0, newItem );
		newItems.forEach( ( item, index ) => ( item.id = index + 1 ) );
		updateValueNoMergeArrays( `slideshow.slides`, newItems );
	};

	const onChangeSlideDuration = ( newValue ) => {
		let slideshow = {
			duration: {
				value: newValue,
			},
		};

		const durationValue = newValue;
		const speedValue = getValue( 'slideshow.speed.value' );
		if (
			! isNaN( durationValue ) &&
			! isNaN( speedValue ) &&
			parseFloat( durationValue ) < parseFloat( speedValue )
		) {
			slideshow = {
				...slideshow,
				speed: {
					value: newValue,
				},
			};
		}
		updateValue( 'slideshow', slideshow );
	};
	const showImageUpload = ! isFeaturedImage;

	const [ ProModal, showProModal ] = useProModal();
	return (
		<>
			<ColorIndicatorPopover
				showReset={ true }
				color={ getValue( 'color' ) }
				label={ labelColor }
				alpha={ true }
				onChange={ onColorChange }
				onReset={ onReset( 'color' ) }
			/>

			<SeparatorHorizontalLine />

			<ToggleGroup
				label={ __( 'Background type', 'kubio' ) }
				className={ 'kubio-background-type-container' }
				allowReset={ true }
				value={ getValue( 'type' ) }
				options={ availableTypes }
				disabledOptions={ disabledTypes }
				resetOnLabel={ true }
				onReset={ onBackgroundTypeReset }
				onChange={ onBackgroundTypeChange }
				utmSource={ 'background' }
			/>

			{ /*{showBackgroundTypeSeparator && <SeparatorHorizontalLine />}*/ }

			{ /*IMAGE TYPE*/ }
			{ bgType === BackgroundTypesEnum.IMAGE && (
				<>
					<PopoverOptionsButton
						label={ __( 'Background image', 'kubio' ) }
						popoverClass={ 'kubio-background-control-popover' }
						onPopoverOpen={ () => {
							setCurrentPosition( imageDropDownPosition );
						} }
						popoverWidth={ 280 }
						enabled={ ! isImageParallax }
						beforeOptionsButton={
							isFunction( otherProps.beforeImageOptionsButton )
								? otherProps.beforeImageOptionsButton( {
										updateValues,
										imageURL,
								  } )
								: otherProps.beforeImageOptionsButton
						}
						popupContent={
							<div
								className={
									'kubio-background-image-settings-container'
								}
							>
								<GutentagSelectControl
									label={ __( 'Position', 'kubio' ) }
									value={ currentPosition }
									options={ possibleImagePositions }
									onChange={ ( newValue ) => {
										updatePosition( newValue );
									} }
									allowReset
									onReset={ onReset( 'image.0.position' ) }
								/>
								{ currentPosition === 'custom' && (
									<InlineLabeledControl
										className={
											'kubio-custom-image-position-range-with-unit-container'
										}
									>
										<RangeWithUnitControl
											value={ customPositionLeft }
											label={ __( 'Left', 'kubio' ) }
											onChange={ ( event ) =>
												onPositionChange(
													event.value,
													customPositionTop.value
												)
											}
											onReset={ onReset(
												'image.0.position.x'
											) }
											units={ sizeUnitsOptions }
										/>
										<RangeWithUnitControl
											value={ customPositionTop }
											label={ __( 'Top', 'kubio' ) }
											onChange={ ( event ) =>
												onPositionChange(
													customPositionLeft.value,
													event.value
												)
											}
											onReset={ onReset(
												'image.0.position.y'
											) }
											units={ sizeUnitsOptions }
										/>
									</InlineLabeledControl>
								) }

								<GutentagSelectControl
									label={ __( 'Attachment', 'kubio' ) }
									value={ getValue( 'image.0.attachment' ) }
									options={ ImageProperties.attachment }
									onChange={ ( newValue ) =>
										updateValue(
											'image.0.attachment',
											newValue
										)
									}
									allowReset
									onReset={ onReset( 'image.0.attachment' ) }
								/>

								<GutentagSelectControl
									label={ __( 'Repeat', 'kubio' ) }
									value={ getValue( 'image.0.repeat' ) }
									options={ ImageProperties.repeat }
									onChange={ ( newValue ) =>
										updateValue(
											'image.0.repeat',
											newValue
										)
									}
									allowReset
									onReset={ onReset( 'image.0.repeat' ) }
								/>

								<GutentagSelectControl
									label={ __( 'Size', 'kubio' ) }
									value={ imageSize }
									options={ ImageProperties.size }
									onChange={ ( newValue ) => {
										if (
											! isEmpty(
												get(
													value,
													'image.0.sizeCustom'
												)
											)
										) {
											onReset( 'image.0.sizeCustom' )();
										}
										updateValue( 'image.0.size', newValue );
									} }
									onReset={ onReset( 'image.0.size' ) }
									allowReset
								/>

								{ imageSize === 'custom' && (
									<InlineLabeledControl
										className={
											'kubio-custom-image-position-range-with-unit-container'
										}
									>
										<RangeWithUnitControl
											label={ __(
												'Custom size x',
												'kubio'
											) }
											value={ getSizeValue( 'x' ) }
											onChange={ ( event ) => {
												onCustomSizeChange(
													'x',
													event
												);
											} }
											onReset={ onReset(
												'image.0.sizeCustom.x'
											) }
											units={ sizeUnitsOptions }
										/>
										<RangeWithUnitControl
											label={ __(
												'Custom size y',
												'kubio'
											) }
											value={ getSizeValue( 'y' ) }
											onChange={ ( event ) => {
												onCustomSizeChange(
													'y',
													event
												);
											} }
											onReset={ onReset(
												'image.0.sizeCustom.y'
											) }
											units={ sizeUnitsOptions }
										/>
									</InlineLabeledControl>
								) }
							</div>
						}
					/>

					{ ! isImageParallax && (
						<FocalPointMediaPicker
							types={ [ 'image' ] }
							url={ imageURL }
							focalPoint={ imageFocalPoint }
							onChange={ onImageChange }
							showButton={ showImageUpload }
						/>
					) }
					{ isImageParallax && (
						<MediaPicker
							types={ [ 'image' ] }
							value={ { url: imageURL } }
							showButton={ showImageUpload }
							onChange={ ( image ) => {
								updateValue(
									'image.0.useFeaturedImage',
									false
								);
								updateValue( 'image.0.source.url', image.url );
							} }
						/>
					) }
					{ showFeaturedImage && (
						<InlineLabeledControl
							label={ __(
								'Use feature image if available',
								'kubio'
							) }
						>
							<FormToggle
								checked={ isFeaturedImage }
								onChange={ () => {
									showProModal( true );
									return;
									// eslint-disable-next-line no-unreachable
									updateValue(
										'image.0.useFeaturedImage',
										! isFeaturedImage
									);
								} }
							/>
							<ProModal
								urlArgs={ {
									source: 'background',
									content: 'featured-image',
								} }
							/>
						</InlineLabeledControl>
					) }
					{ showImageParallax && (
						<InlineLabeledControl
							label={ __( 'Use parallax', 'kubio' ) }
						>
							<FormToggle
								checked={ isImageParallax }
								onChange={ () => {
									showProModal( true, 'parallax' );
									return;
									// eslint-disable-next-line no-unreachable
									updateValue(
										'image.0.useParallax',
										! isImageParallax
									);
								} }
							/>
							<ProModal
								id={ 'parallax' }
								urlArgs={ {
									source: 'background',
									content: 'parallax',
								} }
							/>
						</InlineLabeledControl>
					) }
				</>
			) }

			{ /*VIDEO TYPE*/ }
			{ bgType === BackgroundTypesEnum.VIDEO && isNormalState && (
				<>
					<BaseControl>
						<ToggleGroup
							value={ getValue( 'video.type' ) }
							onChange={ ( newVideoType ) =>
								updateValue( 'video.type', newVideoType )
							}
							options={ videoTypes }
						/>
					</BaseControl>
					<PopoverOptionsButton
						label={ __( 'Video', 'kubio' ) }
						popoverClass={ 'kubio-background-control-popover' }
						onPopoverOpen={ () => {
							setCurrentVideoPosition( videoDropDownPosition );
						} }
						enabled={ videoType === 'internal' }
						popupContent={
							<>
								<div
									className={
										'kubio-background-image-settings-container'
									}
								>
									<GutentagSelectControl
										label={ __( 'Position', 'kubio' ) }
										value={ currentVideoPosition }
										options={ possibleImagePositions }
										onChange={ ( newValue ) => {
											updateVideoPosition( newValue );
										} }
										allowReset
										onReset={ onReset( 'video.position' ) }
									/>

									{ currentVideoPosition === 'custom' && (
										<InlineLabeledControl
											className={
												'kubio-custom-image-position-range-with-unit-container'
											}
										>
											<RangeWithUnitControl
												value={
													customVideoPositionLeft
												}
												label={ __( 'Left', 'kubio' ) }
												onChange={ ( event ) => {
													return onVideoPositionChange(
														event.value,
														customVideoPositionTop.value
													);
												} }
												onReset={ onReset(
													'video.position.x'
												) }
												units={ sizeUnitsOptions }
											/>
											<RangeWithUnitControl
												value={ customVideoPositionTop }
												label={ __( 'Top', 'kubio' ) }
												onChange={ ( event ) => {
													return onVideoPositionChange(
														customVideoPositionLeft.value,
														event.value
													);
												} }
												onReset={ onReset(
													'video.position.y'
												) }
												units={ sizeUnitsOptions }
											/>
										</InlineLabeledControl>
									) }
								</div>
							</>
						}
					/>
					<>
						{ videoType === 'internal' && (
							<FocalPointMediaPicker
								types={ [ 'video' ] }
								url={ getValue( 'video.internal.url' ) }
								focalPoint={ videoFocalPoint }
								onChange={ ( newValue ) =>
									onInternalVideoChange( newValue )
								}
								openMediaLabel={ __( 'Change Video', 'kubio' ) }
							/>
						) }
						{ videoType === 'external' && (
							<InputControl
								label={ __( 'Youtube Video', 'kubio' ) }
								value={ getValue( 'video.external.url' ) }
								onChange={ ( newValue ) =>
									updateValue(
										'video.external.url',
										newValue
									)
								}
							/>
						) }
						<BaseControl
							className={
								'kubio-advanced-background-video-help-container'
							}
						>
							<Tip
								className={
									'kubio-advanced-background-video-tip'
								}
							>
								{ __(
									'Mobile browsers usually disable video backgrounds to save bandwidth. ' +
										'Please set a cover image to be displayed in this case.',
									'kubio'
								) }
							</Tip>
						</BaseControl>
						<BaseControl
							label={ __( 'Video Poster', 'kubio' ) }
							id={ 'kubio-video-background-property' }
						>
							<MediaPicker
								value={ getValue( 'video.poster' ) }
								onChange={ ( newPoster ) =>
									updateValue( 'video.poster', {
										id: newPoster?.id,
										url: newPoster?.url,
									} )
								}
								showButton={ true }
								buttonLabel={ __(
									'Change Video Poster',
									'kubio'
								) }
							/>
						</BaseControl>
					</>
				</>
			) }

			{ /*GRADIENT */ }
			{ mergedValue.type === BackgroundTypesEnum.GRADIENT && (
				<>
					<GradientControlWithPresets
						value={ getValue( 'image.0.source.gradient' ) }
						onChange={ ( newValue ) => {
							updateValue( 'image.0.source', {
								type: 'gradient',
								gradient: newValue,
							} );
						} }
					/>
					<GutentagSelectControl
						label={ __( 'Attachment', 'kubio' ) }
						value={ getValue( 'image.0.attachment' ) }
						options={ ImageProperties.attachment }
						onChange={ ( newValue ) =>
							updateValue( 'image.0.attachment', newValue )
						}
						onReset={ onReset( 'image.0.attachment' ) }
					/>
				</>
			) }

			{ /*SLIDESHOW*/ }
			{ mergedValue.type === BackgroundTypesEnum.SLIDESHOW &&
				isNormalState && (
					<>
						<SortableAccordion
							allowDuplicate
							items={ slideshowItems }
							headingRenderer={ ( item ) => (
								<p>
									{ sprintf(
										// translators: %s: slide number
										__( 'Slideshow image %s', 'kubio' ),
										item.id
									) }
								</p>
							) }
							onSortEnd={ onSlideshowSortEnd }
							onDuplicate={ onDuplicate }
							onDelete={ removeSlideshowItem }
							contentRendered={ ( item, index ) => (
								<>
									<MediaPicker
										buttonLabel={ __(
											'Change image',
											'kubio'
										) }
										onChange={ ( newValue ) => {
											let items = getValue(
												`slideshow.slides`,
												[]
											);
											items = set(
												items,
												`${ index }.url`,
												newValue.url
											);
											updateValueNoMergeArrays(
												`slideshow.slides`,
												items
											);
										} }
										value={ item.url }
										showButton={ true }
									/>
								</>
							) }
						/>
						<Button
							isPrimary
							className={
								'kubio-button-group-button sortable-collapse__add-button'
							}
							onClick={ () => addSlideshowItem() }
							icon={ AddItemIcon }
						>
							{ __( 'Add new slideshow image', 'kubio' ) }
						</Button>

						<SeparatorHorizontalLine />

						<GutentagRangeControl
							label={ __( 'Slide duration', 'kubio' ) }
							value={ getValue( 'slideshow.duration.value' ) }
							onChange={ ( newValue ) => {
								onChangeSlideDuration( newValue );
							} }
							onReset={ onReset( 'slideshow.duration.value' ) }
							min={ 100 }
							max={ 10000 }
							capMin={ true }
						/>

						<GutentagRangeControl
							label={ __( 'Effect speed', 'kubio' ) }
							value={ getValue( 'slideshow.speed.value' ) }
							onChange={ ( newValue ) =>
								updateValue( 'slideshow.speed.value', newValue )
							}
							onReset={ onReset( 'slideshow.speed.value' ) }
							min={ 0 }
							capMin={ true }
							capMax={ true }
							max={ parseInt(
								getValue( 'slideshow.duration.value' )
							) }
						/>
					</>
				) }
			{ bgIsVideoOrSlideshow && ! isNormalState && (
				<BackgroundDisabledNotice />
			) }
			{ showOverlayOptions && (
				<>
					<SeparatorHorizontalLine />

					<OverlayControl
						localValue={ mergedValue }
						updateState={ onChange }
						showOverlayOptionsOnFree={ showOverlayOptionsOnFree }
						updateValue={ updateValue }
						onReset={ onOverlayReset }
					/>
				</>
			) }
		</>
	);
};

const BackgroundDisabledNotice = () => {
	return (
		<ControlNotice
			content={ __(
				'The button can be configured only for the normal state.',
				'kubio'
			) }
		/>
	);
};

const BackgroundControlWithFilters = withFilters(
	'kubio.control.background-control'
)( BackgroundControl );

export {
	BackgroundControlWithFilters as BackgroundControl,
	BackgroundUiUtils,
	OverlayControl,
};
