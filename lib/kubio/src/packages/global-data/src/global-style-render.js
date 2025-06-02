import { GlobalStyleRender } from '@kubio/style-manager';
import { loadGoogleFonts, loadTypeKitFonts } from '@kubio/utils';

const renderGlobalNode = ( dataHelper, document ) => {
	const vSpaceByMedia = dataHelper.getPropByMedia( 'vSpace' );
	const hSpaceByMedia = dataHelper.getPropByMedia( 'hSpace' );

	new GlobalStyleRender( {
		...dataHelper.sharedData,
		document,
	} ).render( {
		vSpaceByMedia,
		hSpaceByMedia,
	} );
};

const renderGlobalColorsPalette = ( data ) => {
	const colors = [ ...data.colorPalette, ...data.colorVariants ];
	const elementId = 'kubio-global-colors-holder';
	const document = data.ownerDocument || window.document;

	const rules = colors.map(
		( color ) => `--${ color.slug }:${ color.color.join() }`
	);

	const rulesString = rules.join( ';\n' );

	let gutentagColorsHolderStyle = document.querySelector( `#${ elementId }` );

	if ( ! gutentagColorsHolderStyle ) {
		gutentagColorsHolderStyle = document.createElement( 'style' );
		document.head.prepend( gutentagColorsHolderStyle );
	}

	const colorClasses = [];

	const colorPalettePrefixes = [ '.has-', '[data-kubio] .has-' ];
	const colorPaletteSuffixes = {
		'.has-': 'color',
		'[data-kubio] .has-': 'backgroound-color',
	};

	data.colorPalette.forEach( ( color ) => {
		colorPalettePrefixes.forEach( ( prefix ) => {
			Object.keys( colorPaletteSuffixes ).forEach( ( suffix ) => {
				const prop = colorPaletteSuffixes[ suffix ];
				colorClasses.push(
					`${ prefix }${ color.slug }${ suffix }{${ prop }:rgb(var(--${ color.slug }))}`
				);
			} );
		} );
	} );

	gutentagColorsHolderStyle.outerHTML = `<style id="${ elementId }">.cs-popup {\n${ rulesString }\n} ${ colorClasses.join(
		' '
	) }</style>`;
};

const renderAdditionalCSS = ( data, ownerDocument ) => {
	const elementId = 'kubio-global-additional-css';
	const document = ownerDocument || window.document;
	let styleHolder = document.querySelector( `#${ elementId }` );

	if ( ! styleHolder ) {
		styleHolder = document.createElement( 'style' );
		document.head.append( styleHolder );
	}

	styleHolder.outerHTML = `<style id="${ elementId }">${ data }</style>`;
};

const renderGoogleUsedFonts = ( data, document ) => {
	if ( ! data ) {
		return;
	}

	loadGoogleFonts( data, document );
};

const renderTypekitFonts = ( id, document ) => {
	if ( id ) {
		loadTypeKitFonts( id, document );
	}
};

const renderGlobalStyle = ( globalStyleHelper, ownerDocument ) => {
	renderGlobalNode( globalStyleHelper, ownerDocument );
};

export default renderGlobalStyle;

export {
	renderGlobalColorsPalette,
	renderAdditionalCSS,
	renderGoogleUsedFonts,
	renderTypekitFonts,
};
