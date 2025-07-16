import { LodashBasic, BackgroundParserUtils } from '@kubio/style-manager';
const YOUTUBE_MIME = 'video/x-youtube';

const BackgroundVideo = ( props ) => {
	const { value } = props;
	const mergedValue = LodashBasic.merge(
		{},
		BackgroundParserUtils.videoDefault,
		value
	);
	const { poster, type, position } = mergedValue;

	const positionX = parseFloat( position.x ).toFixed( 4 );
	const positionY = parseFloat( position.y ).toFixed( 4 );

	let mimeType = YOUTUBE_MIME;

	if ( type === 'internal' ) {
		mimeType = LodashBasic.get( mergedValue, 'internal.mimeType' );

		// fallback on the 'mime' path
		// eslint-disable-next-line no-unused-expressions
		typeof mimeType === 'undefined'
			? ( mimeType = LodashBasic.get( mergedValue, 'internal.mime' ) )
			: null;
	}

	const id = `background-video`;
	const className = 'cp-video-bg background-layer kubio-video-background';
	const wrapperComputedStyle = {
		backgroundImage: `url(${ poster.url })`,
	};
	const url = LodashBasic.get( mergedValue, [ type, 'url' ] );
	//	const url = type === 'internal' ? internalUrl : externalUrl;

	return (
		<div
			id={ id }
			style={ wrapperComputedStyle }
			data-video={ url }
			data-poster={ poster?.url }
			data-mime-type={ mimeType }
			data-position-x={ positionX }
			data-position-y={ positionY }
			data-kubio-component="video-background"
			className={ className }
		/>
	);
};

export { BackgroundVideo };
