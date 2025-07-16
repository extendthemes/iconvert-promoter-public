import _ from 'lodash';
import tinycolor from 'tinycolor2';

const generateInternalUrl = ( { internalUrl, playerOptions = {} } ) => {
	let { startTime, endTime } = playerOptions;
	startTime = startTime || 0;
	endTime = endTime || 0;
	let time = '';
	if ( ( startTime && endTime ) || ( startTime === 0 && endTime ) ) {
		time = `#t=${ startTime },${ endTime }`;
	} else if ( startTime && ! endTime ) {
		time = `#t=${ startTime }`;
	}

	return `${ internalUrl }${ time }`;
};

const getParamsToQueryString = ( params ) => {
	const queryString = [];
	_.each( params, ( paramValue, paramName ) => {
		if ( typeof paramValue === 'boolean' ) {
			paramValue = paramValue ? 1 : 0;
		}
		queryString.push( `${ paramName }=${ paramValue }` );
	} );

	return queryString;
};

const generateYoutubeUrl = ( {
	youtubeUrl = '',
	playerOptions,
	displayAsPosterImage,
} ) => {
	const {
		startTime,
		endTime,
		mute,
		loop,
		playerControls,
		modestBranding,
		suggestedVideo,
		privacyMode,
	} = playerOptions;
	let url = youtubeUrl;
	if ( ! url ) {
		return url;
	}
	const youtubeVideoRegex =
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
	const urlMatch = url.match( youtubeVideoRegex );
	if ( ! urlMatch ) {
		return url;
	}
	const video = urlMatch[ 1 ];
	url = `https://www.youtube.com/embed/${ video }?`;
	const params = {
		start: startTime,
		end: endTime,
		//disable in editor
		autoPlay: false,
		mute,
		loop: displayAsPosterImage && loop,
		controls: playerControls,
		modestBranding,
		rel: suggestedVideo,
		enablejsapi: true,
	};

	const queryString = getParamsToQueryString( params );

	if ( params.loop ) {
		queryString.push( `playlist=${ video }` );
	}

	if ( privacyMode ) {
		url = url.replace( 'youtube', 'youtube-nocookie' );
	}

	url += queryString.join( '&' );
	return url;
};
const getVimeoStartTime = ( startTime ) => {
	let time = new Date( startTime * 1000 ).toISOString().substr( 14, 5 );
	time += 's';
	return time.replace( ':', 'm' );
};
const generateVimeoUrl = ( {
	vimeoUrl = '',
	playerOptions,
	displayAsPosterImage,
} ) => {
	const {
		startTime,
		mute,
		loop,
		introTitle,
		introPortrait,
		introByLine,
		controlsColor,
	} = playerOptions;
	let url = vimeoUrl;
	const vimeoVideoRegex =
		/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
	const urlMatch = url.match( vimeoVideoRegex );
	if ( ! urlMatch ) {
		return url;
	}
	const video = urlMatch[ 1 ];
	url = `https://player.vimeo.com/video/${ video }?`;
	const params = {
		//disable in editor
		autoplay: false,
		autopause: false,
		muted: mute,
		loop: displayAsPosterImage && loop,
		title: introTitle,
		portrait: introPortrait,
		byline: introByLine,
		color: controlsColor ? tinycolor( controlsColor ).toHex() : '',
		api: true,
	};

	const queryString = getParamsToQueryString( params );

	url += queryString.join( '&' );

	if ( startTime ) {
		url += `#t=${ getVimeoStartTime( startTime ) }`;
	}

	return url;
};

const generateUrl = ( params ) => {
	const { videoCategory } = params;

	switch ( videoCategory ) {
		case 'internal':
			return generateInternalUrl( params );
		case 'youtube':
			return generateYoutubeUrl( params );
		case 'vimeo':
			return generateVimeoUrl( params );
	}
};
const getInternalUrlAttributes = ( {
	playerOptions,
	displayAsPosterImage,
} = {} ) => {
	const isPreview = true;
	return {
		autoPlay:
			! isPreview && ! displayAsPosterImage && playerOptions?.autoPlay,
		muted: playerOptions?.mute,
		loop: playerOptions?.loop,
		controls: playerOptions?.playerControls,
	};
};

export {
	generateInternalUrl,
	generateYoutubeUrl,
	generateVimeoUrl,
	generateUrl,
	getInternalUrlAttributes,
};
