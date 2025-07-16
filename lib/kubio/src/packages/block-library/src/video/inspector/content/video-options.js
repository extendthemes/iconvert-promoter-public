import {
	GutentagSelectControl,
	InputControlWithPath,
	MediaPicker,
	MediaPickerWithPath,
	PopoverOptionsButton,
	SeparatorHorizontalLine,
	ToggleGroupWithPath,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { Button, Flex, PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { filter, get, map, pick } from 'lodash';
import { DEFAULT_SIZE_SLUG } from '../../../image/edit/constants';
import { properties } from '../../config';
import PlayerControlsOptions from './player-options';
import PosterImageOptions from './poster-image';

const Panel = ( { computed } ) => {
	const {
		VideoPicker,
		displayAs,
		selectInner,
		videoCategory,
		imageOptions,
		imageSizeOptions,
		posterSlugOptions,
		playAction,
	} = computed;

	return (
		<>
			<PanelBody
				title={ __( 'Video options', 'kubio' ) }
				className={ 'video-options-panel' }
			>
				<GutentagSelectControl
					label={ __( 'Display as', 'kubio' ) }
					options={ properties.videoDisplayAs.options }
					{ ...displayAs }
				/>

				<ToggleGroupWithPath
					label={ __( 'Video type', 'kubio' ) }
					options={ properties.videoCategory.options }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="videoCategory"
				/>

				<VideoPicker />

				{ displayAs.value === properties.videoDisplayValues.VIDEO &&
					videoCategory ===
						properties.videoCategorysValues.INTERNAL && (
						<>
							<SeparatorHorizontalLine />
							<MediaPicker
								showButton
								buttonLabel={ __(
									'Change poster image',
									'kubio'
								) }
								mediaType={ 'image' }
								withReset
								label={ __( 'Poster image', 'kubio' ) }
								{ ...imageOptions }
							/>
							{ imageSizeOptions.length > 0 && (
								<GutentagSelectControl
									label={ __( 'Dimension', 'kubio' ) }
									options={ imageSizeOptions }
									{ ...posterSlugOptions }
								/>
							) }
						</>
					) }

				{ displayAs.value ===
					properties.videoDisplayValues.POSTER_IMAGE && (
					<>
						<SeparatorHorizontalLine />
						<PosterImageOptions
							imageOptions={ imageOptions }
							imageSizeOptions={ imageSizeOptions }
							posterSlugOptions={ posterSlugOptions }
						/>
					</>
				) }

				{ ( displayAs.value ===
					properties.videoDisplayValues.POSTER_IMAGE ||
					displayAs.value ===
						properties.videoDisplayValues.ICON_WITH_LIGHTBOX ) && (
					<div className="video-options-customize-play__container">
						<Button
							isPrimary
							onClick={ selectInner }
							className={ 'kubio-button-100 inner-block-button ' }
						>
							{ playAction ===
								properties.posterPlayActionValues.BUTTON &&
							displayAs.value ===
								properties.videoDisplayValues.POSTER_IMAGE
								? __( 'Customize play button', 'kubio' )
								: __( 'Customize play icon', 'kubio' ) }
						</Button>
					</div>
				) }
			</PanelBody>
		</>
	);
};

const InternalVideoPicker = () => {
	return (
		<Flex align={ 'bottom' } style={ { marginBottom: 10 } }>
			<div className={ 'kubio-video-input-container internal-video' }>
				<Flex justify={ 'space-between' } style={ { marginBottom: 5 } }>
					<span>{ __( 'Video', 'kubio' ) }</span>
					<PopoverOptionsButton
						popupContent={ <PlayerControlsOptions /> }
					/>
				</Flex>
				<MediaPickerWithPath
					showButton
					buttonLabel={ __( 'Change video', 'kubio' ) }
					mediaType={ 'video' }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="internalUrl"
				/>
			</div>
		</Flex>
	);
};

const YoutubeVideoPicker = () => {
	return (
		<Flex align={ 'end' } style={ { marginBottom: 10 } }>
			<div className={ 'kubio-video-input-container' }>
				<InputControlWithPath
					label={ __( 'Youtube link', 'kubio' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="youtubeUrl"
				/>
			</div>
			<PopoverOptionsButton popupContent={ <PlayerControlsOptions /> } />
		</Flex>
	);
};

const VimeoVideoPicker = () => {
	return (
		<Flex align={ 'bottom' } style={ { marginBottom: 10 } }>
			<div className={ 'kubio-video-input-container' }>
				<InputControlWithPath
					label={ __( 'Vimeo link', 'kubio' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="vimeoUrl"
				/>
			</div>
			<PopoverOptionsButton popupContent={ <PlayerControlsOptions /> } />
		</Flex>
	);
};

const videoCategoryValues = properties.videoCategory.values;
const videoPickerMapper = {
	[ videoCategoryValues.INTERNAL ]: InternalVideoPicker,
	[ videoCategoryValues.YOUTUBE ]: YoutubeVideoPicker,
	[ videoCategoryValues.VIMEO ]: VimeoVideoPicker,
};

const useComputed = ( dataHelper ) => {
	const { replaceInnerBlocks, selectBlock } =
		useDispatch( 'core/block-editor' );

	const updateVideoPlayButton = ( buttonType ) => {
		const createElement = properties.posterDefaultByType[ buttonType ];
		const element = createElement( {
			attributes: { name: 'font-awesome/play' },
		} );
		replaceInnerBlocks( dataHelper?.clientId, [ element ], false );
	};

	const onChangeDisplayAs = ( displayAs ) => {
		const videoDisplayValues = properties.videoDisplayValues;
		switch ( displayAs ) {
			case videoDisplayValues.POSTER_IMAGE:
				const buttonType = dataHelper.getAttribute(
					'posterImage.playAction',
					'button'
				);
				updateVideoPlayButton( buttonType );
				break;
			case videoDisplayValues.ICON_WITH_LIGHTBOX:
				updateVideoPlayButton(
					properties.posterPlayAction.values.ICON
				);
				break;
		}

		dataHelper.setAttribute( 'displayAs', displayAs );
	};
	const displayAs = {
		value: dataHelper.getAttribute( 'displayAs' ),
		onChange: onChangeDisplayAs,
	};

	const videoCategory = dataHelper.getAttribute( 'videoCategory' );
	const VideoPicker = videoPickerMapper[ videoCategory ];

	const block = useSelect( ( select ) => {
		const { getBlock } = select( 'core/block-editor' );

		return getBlock( dataHelper?.clientId );
	} );

	const selectInner = () => {
		selectBlock( block.innerBlocks[ 0 ].clientId );
	};

	const onPosterImageChange = ( image ) => {
		const data = {
			url: image.url,
			id: image.id,
			sizeSlug: DEFAULT_SIZE_SLUG,
		};
		dataHelper.setAttribute( 'posterImage', data );
	};

	const onPosterImageReset = () => {
		dataHelper.setAttribute( 'posterImage', {}, { unset: true } );
	};

	const imageOptions = {
		value: dataHelper.getAttribute( 'posterImage.url' ),
		onChange: onPosterImageChange,
		onReset: onPosterImageReset,
	};

	const posterImageId = dataHelper.getAttribute( 'posterImage.id' );
	const imageFile = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return posterImageId ? getMedia( posterImageId ) : null;
		},
		[ posterImageId ]
	);
	const { imageSizes } = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return pick( getSettings(), [ 'imageSizes' ] );
	} );

	const imageSizeOptions = map(
		filter( imageSizes, ( { slug } ) =>
			get( imageFile, [ 'media_details', 'sizes', slug, 'source_url' ] )
		),
		( { name, slug } ) => ( { value: slug, label: name } )
	);

	const onChangePosterImageSlug = ( newSize ) => {
		const getUrlForSlug = ( sizeSlug ) => {
			return get( imageFile, [
				'media_details',
				'sizes',
				sizeSlug,
				'source_url',
			] );
		};
		const url = getUrlForSlug( newSize );
		if ( ! url ) {
			return null;
		}

		dataHelper.setAttribute( 'posterImage', {
			url,
			sizeSlug: newSize,
		} );
	};
	const posterSlugOptions = {
		value: dataHelper.getAttribute( 'posterImage.sizeSlug' ),
		onChange: onChangePosterImageSlug,
	};

	const playAction = dataHelper.getAttribute( 'posterImage.playAction' );

	return {
		VideoPicker,
		displayAs,
		selectInner,
		videoCategory: dataHelper.getAttribute( 'videoCategory' ),
		imageOptions,
		imageSizeOptions,
		posterSlugOptions,
		playAction,
	};
};

const PanelWithData = withComputedData( useComputed )( Panel );

export default PanelWithData;
