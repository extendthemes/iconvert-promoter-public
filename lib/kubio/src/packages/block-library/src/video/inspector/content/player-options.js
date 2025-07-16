import { Tip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	ColorWithPath,
	InputControlWithPath,
	SeparatorHorizontalLine,
	ToggleControlWithPath,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { properties } from '../../config';

const Panel = ( { computed } ) => {
	const {
		VideoControlsCustom,
		videoTypeIs,
		displayAsVideo,
		autoplayWithoutMute,
	} = computed;

	return (
		<>
			<InputControlWithPath
				className={ 'kubio-video-time-container' }
				label={ __( 'Start time', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.startTime"
				inline
				numeric
				min={ 0 }
			/>
			{ ! videoTypeIs.vimeo && (
				<InputControlWithPath
					className={ 'kubio-video-time-container' }
					label={ __( 'End time', 'kubio' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="playerOptions.endTime"
					inline
					numeric
					min={ 0 }
				/>
			) }

			<SeparatorHorizontalLine fit={ true } />
			{ displayAsVideo && (
				<>
					<ToggleControlWithPath
						label={ __( 'Autoplay', 'kubio' ) }
						type={ WithDataPathTypes.ATTRIBUTE }
						path="playerOptions.autoPlay"
					/>
					{ autoplayWithoutMute && (
						<Tip
							className={ 'kubio-advanced-background-video-tip' }
						>
							{ __(
								'Some browsers disable autoplay for non-muted videos.',
								'kubio'
							) }
						</Tip>
					) }
				</>
			) }
			<ToggleControlWithPath
				label={ __( 'Mute', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.mute"
			/>
			<ToggleControlWithPath
				label={ __( 'Loop', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.loop"
			/>

			{ ! videoTypeIs.vimeo && (
				<ToggleControlWithPath
					label={ __( 'Player controls', 'kubio' ) }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="playerOptions.playerControls"
					alpha={ false }
				/>
			) }

			<VideoControlsCustom />
		</>
	);
};

const InternalVideoControls = () => {
	return <></>;
};

const YoutubeVideoControls = () => {
	return (
		<>
			<ToggleControlWithPath
				label={ __( 'Modest branding', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.modestBranding"
			/>
			<ToggleControlWithPath
				label={ __( 'Suggested videos', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.suggestedVideo"
			/>
			<ToggleControlWithPath
				label={ __( 'Privacy mode', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.privacyMode"
			/>
		</>
	);
};

const VimeoVideoControls = () => {
	return (
		<>
			<ToggleControlWithPath
				label={ __( 'Intro title', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.introTitle"
			/>
			<ToggleControlWithPath
				label={ __( 'Intro portrait', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.introPortrait"
			/>
			<ToggleControlWithPath
				label={ __( 'Intro byline', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.introByLine"
			/>
			<ColorWithPath
				label={ __( 'Controls color', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path="playerOptions.controlsColor"
				returnRawValue
			/>
		</>
	);
};

const videoCategoryValues = properties.videoCategory.values;
const videoControlsMapper = {
	[ videoCategoryValues.INTERNAL ]: InternalVideoControls,
	[ videoCategoryValues.YOUTUBE ]: YoutubeVideoControls,
	[ videoCategoryValues.VIMEO ]: VimeoVideoControls,
};

const useComputed = ( dataHelper ) => {
	const videoCategory = dataHelper.getAttribute( 'videoCategory' );
	const VideoControlsCustom = videoControlsMapper[ videoCategory ];
	const videoTypeIs = {
		internal: videoCategory === videoCategoryValues.INTERNAL,
		youtube: videoCategory === videoCategoryValues.YOUTUBE,
		vimeo: videoCategory === videoCategoryValues.VIMEO,
	};
	const displayAs = dataHelper.getAttribute( 'displayAs' );
	const displayAsVideo = displayAs === properties.videoDisplayAs.values.VIDEO;
	const autoplayWithoutMute =
		dataHelper.getAttribute( 'playerOptions.autoPlay' ) &&
		! dataHelper.getAttribute( 'playerOptions.mute' );
	return {
		videoTypeIs,
		VideoControlsCustom,
		displayAsVideo,
		autoplayWithoutMute,
	};
};

const PanelWithData = withComputedData( useComputed )( Panel );

export default PanelWithData;
