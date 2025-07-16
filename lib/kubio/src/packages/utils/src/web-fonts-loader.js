import WebFont from 'webfontloader';
import { castArray, each, isEmpty, isObject, map, uniq } from 'lodash';
const loadedFonts = new Map();
const renderedFonts = new Map();

const isFontRendered = ( ownerDocument, font, weight ) => {
	const renderedGoogleFonts = renderedFonts.get( ownerDocument ) || [];
	return !! renderedGoogleFonts.includes( `${ font }:${ weight }` );
};

const setFontRenderd = ( ownerDocument, font, weight ) => {
	const renderedGoogleFonts = renderedFonts.get( ownerDocument ) || [];
	renderedFonts.set( ownerDocument, [
		...renderedGoogleFonts,
		`${ font }:${ weight }`,
	] );
};

const addGoogleFontToLoadedList = ( ownerDocument, font ) => {
	let loadedGoogleFonts = loadedFonts.get( ownerDocument ) || {};

	castArray( font ).forEach( ( item ) => {
		loadedGoogleFonts = {
			...loadedGoogleFonts,
			[ item.family ]: uniq( [
				...item.variants.map( ( variant ) => variant.toString() ),
				...( loadedGoogleFonts[ item.family ] || [] ),
			] ),
		};
	} );

	loadedFonts.set( ownerDocument, loadedGoogleFonts );
};

const loadGoogleFonts = ( fonts, ownerDocument ) => {
	// eslint-disable-next-line no-undef
	ownerDocument = ownerDocument || top.document;

	if ( ! fonts.length ) {
		return;
	}
	addGoogleFontToLoadedList( ownerDocument, fonts );
	const totalFonts = loadedFonts.get( ownerDocument ) || {};

	const families = {};
	each( totalFonts, ( weights, family ) => {
		weights.forEach( ( weight ) => {
			if ( ! isFontRendered( ownerDocument, family, weight ) ) {
				families[ family ] = families[ family ] || [];
				families[ family ].push( weight );
				setFontRenderd( ownerDocument, family, weight );
			}
		} );
	} );

	if ( isEmpty( families ) ) {
		return;
	}

	WebFont.load( {
		google: {
			families: map(
				families,
				( weights, family ) => `${ family }:${ weights.join( ',' ) }`
			),
		},
		context: ownerDocument?.defaultView,
		classes: false,
	} );
};

const loadTypeKitFonts = ( kit, document ) => {
	// this function is deprecated, it is left for backward compatibility
	return;
};

export { loadGoogleFonts, loadTypeKitFonts };
