import { __ } from '@wordpress/i18n';
import {
	MediaPicker,
	ToggleControlWithPath,
	ToggleGroup,
	GutentagSelectControl,
} from '@kubio/controls';

import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { useDispatch } from '@wordpress/data';
import { properties } from '../../config';

const Panel = ( {
	computed,
	imageOptions,
	imageSizeOptions,
	posterSlugOptions,
} ) => {
	const { showPosterImage, playAction } = computed;

	if ( ! showPosterImage ) {
		return <></>;
	}

	return (
		<>
			<MediaPicker
				showButton
				buttonLabel={ __( 'Change poster image', 'kubio' ) }
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

			<ToggleControlWithPath
				label={ __( 'Open in lightbox', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="posterImage.lightbox"
			/>

			<ToggleGroup
				label={ __( 'Play action', 'kubio' ) }
				options={ properties.posterPlayActionOptions }
				value={ playAction.value }
				onChange={ playAction.onChange }
			/>
		</>
	);
};

const useComputed = ( dataHelper ) => {
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	const displayAs = dataHelper.getAttribute( 'displayAs' );
	const showPosterImage =
		displayAs === properties.videoDisplayAs.values.POSTER_IMAGE;

	const onChangePosterBlock = ( buttonType ) => {
		const getElement = properties.posterDefaultByType[ buttonType ];
		const element = getElement();
		replaceInnerBlocks( dataHelper?.clientId, [ element ], false );
	};

	const playAction = {
		value: dataHelper.getAttribute( 'posterImage.playAction' ),
		onChange: ( event ) => {
			onChangePosterBlock( event );
			dataHelper.setAttribute( 'posterImage.playAction', event );
		},
	};

	return {
		showPosterImage,
		playAction,
	};
};

const PanelWithData = withComputedData( useComputed )( Panel );

export default PanelWithData;
