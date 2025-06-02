import { isEmpty, isObject, set, unset } from 'lodash';
import memize from 'memize';
import { Utils } from './core/utils';
import { dynamicStylesTransforms } from './dynamic-styles';
import { styleManagerInstance } from './manager';
import { StyleRender } from './style-render';
import { getFilteredTypes } from './types';

const BODY_SELECTOR = '';

const removeDisabledRules = memize( ( style = {} ) => {
	const disabled = style?.disabled || {};

	if ( isEmpty( disabled ) ) {
		return style;
	}

	style = window.structuredClone( style );
	const disabledRules = Object.keys( disabled )
		.filter( ( item ) => disabled?.[ item ] )
		.reduce( ( result, item ) => {
			if ( item === 'headings' ) {
				result = result.concat( [
					'h1',
					'h2',
					'h3',
					'h4',
					'h4',
					'h5',
					'h6',
				] );
			} else {
				result.push( item );
			}
			return result;
		}, [] );

	if ( disabledRules.length ) {
		const bodyStyle = style?.descendants?.body || {};

		disabledRules.forEach( ( rule ) =>
			unset( bodyStyle, `typography.holders.${ rule }` )
		);

		for ( const mediaItem in bodyStyle.media ) {
			disabledRules.forEach( ( rule ) =>
				unset(
					bodyStyle,
					`${ mediaItem }.typography.holders.${ rule }`
				)
			);
		}

		style = set( style, 'descendants.body', bodyStyle );
	}

	return style;
} );

const prefixSelector = ( selector, prefix ) => {
	return selector
		.split( ',' )
		.map( ( sel ) => {
			sel = sel.trim();

			if ( sel.indexOf( '.woocommerce ' ) === 0 ) {
				sel = sel.replace( '.woocommerce', '' );
			}

			return `${ prefix } ${ sel }`;
		} )
		.join( ',' );
};

const prefixElementSelectors = ( selector, prefix ) => {
	let response;
	if ( isObject( selector ) ) {
		response = {};
		Object.keys( selector ).forEach( ( sel ) => {
			response[ sel ] = prefixSelector( selector[ sel ], prefix );
		} );
	} else {
		response = prefixSelector( selector, prefix );
	}

	return response;
};

const mapSelector = ( selector, styledElement ) => {
	const { elementsEnum: styledElementsEnum } =
		getFilteredTypes().definitions.globalStyle;

	switch ( styledElement ) {
		case styledElementsEnum.FORM_BUTTON:
			selector = {
				normal: [
					"input[type='button']:not(.components-button)",
					'button:not(.components-button)',
				].join( ' ' ),
				hover: [
					"input[type='button']:not(.components-button):hover",
					'button:not(.components-button):hover',
				].join( ' ' ),
				focus: [
					"input[type='button']:not(.components-button):focus",
					'button:not(.components-button):focus',
				].join( ',' ),
				disabled: [
					"input[type='button']:not(.components-button):disabled",
					'button:not(.components-button):disabled',
					"input[type='button'][disabled]:not(.components-button)",
					'button[disabled]:not(.components-button)',
				].join( ',' ),
			};
			break;
	}

	return selector;
};

const prefixStyledElements = ( styledElements ) => {
	const result = {};
	Object.keys( styledElements ).forEach( ( key ) => {
		const data = styledElements[ key ];

		if ( key === 'body' ) {
			result[ key ] = {
				...data,
				selector: `${ BODY_SELECTOR }`,
			};
		} else {
			let prefix = BODY_SELECTOR;

			// if (data.withGlobalPrefix) {
			// 	prefix = `#kubio ${BODY_SELECTOR}`;
			// }

			if ( data.withKubioBlockPrefix ) {
				prefix = `[data-kubio]`;
			}

			result[ key ] = {
				...data,
				selector: data.isGlobalSelector
					? data.selector
					: prefixElementSelectors(
							mapSelector( data.selector, key ),
							prefix
					  ),
			};
		}
	} );

	return result;
};

class GlobalStyleRender extends StyleRender {
	constructor( options ) {
		const { document, ...rest } = options;

		const mainAttribute = {
			...rest,
			style: removeDisabledRules( rest?.style ),
		};

		let {
			elementsByName: styledElementsByName,
			elementsEnum: styledElementsEnum,
		} = getFilteredTypes().definitions.globalStyle;

		styledElementsByName = prefixStyledElements( styledElementsByName );

		const normalized = Utils.normalizeData( {
			mainAttribute,
			styledElementsByName,
			styledElementsEnum,
		} );

		super( {
			styledElementsByName,
			styledElementsEnum,
			wrapperElement: false,
			model: {
				...( normalized?.model || {} ),
				globalStyle: true,
			},
			document,
		} );
	}

	getDynamicStyle( { vSpaceByMedia, hSpaceByMedia } ) {
		const { elementsEnum: styledElementsEnum } =
			getFilteredTypes().definitions.globalStyle;
		const globalStyles = {
			[ styledElementsEnum.V_SPACE_NEGATIVE ]:
				dynamicStylesTransforms.vSpace( vSpaceByMedia, true ),
			[ styledElementsEnum.V_SPACE_NEGATIVE_TOP ]:
				dynamicStylesTransforms.vSpace( vSpaceByMedia, true, true ),
			[ styledElementsEnum.V_SPACE ]:
				dynamicStylesTransforms.vSpace( vSpaceByMedia ),
			[ styledElementsEnum.H_SPACE_GROUP ]:
				dynamicStylesTransforms.hSpaceParent( hSpaceByMedia ),
			[ styledElementsEnum.H_SPACE ]:
				dynamicStylesTransforms.hSpace( hSpaceByMedia ),
		};

		return globalStyles;
	}

	export( dynamicStyle = null ) {
		const style = this.model.style?.shared;
		const css = {};

		css.global = this.convertStyleToCss( style, {
			styledElementsByName: this.styledElementsByName,
			styleType: `global`,
		} );

		if ( dynamicStyle ) {
			css.dynamic = this.convertStyleToCss(
				StyleRender.normalizeDynamicStyle(
					this.getDynamicStyle( dynamicStyle )
				),
				{
					styledElementsByName: this.styledElementsByName,
					styleType: `global`,
				}
			);
		}

		return css;
	}

	render( dynamicStyle ) {
		const styleManager = styleManagerInstance( this.document );
		if ( ! styleManager ) {
			return;
		}

		const cssByType = this.export( dynamicStyle, '' );

		styleManager.updateGlobalRules( `global`, cssByType?.global );
		styleManager.updateDynamicRules( `global`, cssByType?.dynamic );
		styleManager.updateRules();
	}
}

export { GlobalStyleRender };
