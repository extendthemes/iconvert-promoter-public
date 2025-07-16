import { addPrimitiveValues, createGroup } from '../utils';
import { statesById } from '../states';
import { types } from '../types';
import { LodashBasic } from '../core/lodash-basic';
import { doAction } from '@wordpress/hooks';
import _, { uniq } from 'lodash';

const defaultValue = types.props.typography.default;
const propertiesMap = types.props.typography.config.map;

const getTypographyCss = function ( val, parser, runFontsHook = true ) {
	const style = {
		...parser?.transform(
			_.pick( val, [ 'border', 'background', 'boxShadow' ] ),
			undefined,
			true
		),
	};

	const { family, weight } = val;

	// load google fonts
	if ( family && runFontsHook ) {
		doAction( 'kubio.google-fonts.load', [
			{
				family,
				variants: [ weight ],
			},
		] );
	}

	addPrimitiveValues( style, val, propertiesMap, [ 'lineHeight' ] );
	return style;
};

const getSelector = ( name ) => {
	switch ( name ) {
		case 'p':
			return 'p';

		case 'lead':
			return '.h-lead';

		case 'blockquote':
			return 'blockquote p';

		default:
			return name;
	}
};

const parseHolders = ( typography, parser, options ) => {
	const defaultOptions = {
		isGlobalStyle: false,
	};

	const { isGlobalStyle } = _.merge( {}, defaultOptions, options );

	typography = _.cloneDeep( typography );
	const holders = LodashBasic.omit( typography, [ 'states' ] );
	const collected = {};
	for ( const name in holders ) {
		if ( name === 'input' ) {
			continue;
		}
		const holderTypography = holders[ name ];
		const normal = LodashBasic.omit( holderTypography, [ 'states' ] );
		const byState = { normal, ...holderTypography.states };

		for ( const stateName in byState ) {
			if ( stateName === 'visited' ) {
				continue;
			}

			const stateTypography = byState[ stateName ];
			const val = LodashBasic.merge( {}, defaultValue, stateTypography );
			const stateSelector = statesById[ stateName ].selector;
			let selector = getSelector( name );

			const initialSelector = selector;
			if ( selector === 'a' ) {
				selector = 'a:not([class*=wp-block-button])';
			}

			let selectorParts = [];

			if ( isGlobalStyle ) {
				selectorParts = [
					selector === 'p' ? '[data-kubio]' : false,
					selector === 'p' ? '.with-kubio-global-style' : false,
					`& [data-kubio] ${ selector }`,
					`& .with-kubio-global-style ${ selector }`,
					`& ${ selector }[data-kubio]`,

					// only for WP blocks in editor as there is no link element
					initialSelector === 'a'
						? `& [data-kubio] .wp-element-button`
						: false,
				];
			} else {
				selectorParts = [
					selector === 'p' ? '@body &' : false,
					selector === 'p'
						? '@body & [data-kubio]:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6)'
						: false,
					`@body & ${ selector }`,
					`@body & ${ selector }[data-kubio]`,

					// only for WP blocks in editor as there is no link element
					initialSelector === 'a'
						? `@body & .wp-element-button`
						: false,
				];
			}

			selectorParts = uniq( selectorParts )
				.filter( Boolean )
				.map( ( item ) => item.trim() );

			LodashBasic.set(
				collected,
				[ selectorParts.join( ',' ), `&${ stateSelector }` ],
				getTypographyCss( val, parser )
			);
			LodashBasic.unset( typography, name );
		}
	}
	return collected;
};

const typographyConfig = {
	defaultValue,
	getTypographyCss,
	parseHolders,
};

export default createGroup( {
	groupName: 'typography',
	toStyle: ( style, value, { parser, options } = {} ) => {
		const holders = LodashBasic.get( value, 'holders', {} );
		const holdersTypo = parseHolders( holders, parser, {
			isGlobalStyle: options?.model?.globalStyle || false,
		} );

		let textDefault = {};
		if ( LodashBasic.has( holders, 'p' ) ) {
			textDefault = _.cloneDeep( holders.p );
			if ( LodashBasic.has( textDefault, 'margin' ) ) {
				delete textDefault.margin;
			}
		}

		const nodeTypography = LodashBasic.merge(
			{},
			defaultValue,
			// textDefault,
			LodashBasic.omit( value, 'holders' )
		);

		const nodeTypo = getTypographyCss( nodeTypography );
		return LodashBasic.merge( nodeTypo, holdersTypo );
	},
	default: {},
} );

export { typographyConfig };
