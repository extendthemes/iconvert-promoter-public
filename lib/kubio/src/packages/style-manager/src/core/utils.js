import { mediasById } from '../medias';
import { states as allStates, statesById } from '../states';
import { LodashBasic } from './lodash-basic';
import { types } from '../types';

const Config = {
	...types.constants.support,
};

class Utils {
	static normalizeData( {
		mainAttribute = {},
		styledElements,
		statesByComponent,
		styledElementsByName,
		styledElementsEnum,
		clientId,
	} ) {
		const {
			style = {},
			_style = {},
			props = {},
			_props = {},
		} = mainAttribute;

		const model = {
			style: {
				local: _style,
				shared: style,
			},
			props: {
				local: _props,
				shared: props,
			},
			id: mainAttribute.id,
			styleRef: mainAttribute.styleRef,
			clientId,
		};

		return {
			model,
			styledElements,
			styledComponents: styledElements,
			statesByComponent,
			styledElementsEnum,
			styledElementsByName,
		};
	}

	static normalizeBlockData( block, blockType ) {
		const mainAttribute = LodashBasic.get( block, [
			'attributes',
			Config.mainAttributeKey,
		] );

		//if (!mainAttribute) return {};

		const styledElementsByName = LodashBasic.get(
			blockType,
			`supports.${ Config.mainAttributeKey }.${ Config.elementsKey }`,
			[]
		);

		const styledElementsEnum = LodashBasic.get(
			blockType,
			`supports.${ Config.mainAttributeKey }.${ Config.elementsEnum }`,
			[]
		);

		const styledElements = LodashBasic.map(
			styledElementsByName,
			( item, name ) => {
				return { ...item, name };
			}
		);

		LodashBasic.each( styledElementsEnum, ( name ) => {
			if ( ! styledElementsByName[ name ] ) {
				styledElementsByName[ name ] = {};
			}
		} );

		const statesByComponent = {};
		styledElements.forEach( ( item ) => {
			statesByComponent[ item.name ] = LodashBasic.get(
				item,
				`supports.${ Config.statesKey }`,
				[]
			);
		} );

		const clientId = LodashBasic.get( block, [ 'clientId' ], false );

		return Utils.normalizeData( {
			mainAttribute,
			styledElements,
			statesByComponent,
			styledElementsByName,
			styledElementsEnum,
			clientId,
		} );
	}

	static walkStyle( style, callback ) {
		const styleKeys = Object.keys( style || {} ).sort( ( name ) => {
			return name === 'default' ? -1 : 1;
		} );
		styleKeys.forEach( ( componentName ) => {
			const medias = style[ componentName ] || {};
			const mediaKeys = Object.keys( medias ).sort( ( name ) => {
				return name === 'desktop' ? -1 : 1;
			} );
			mediaKeys.forEach( ( mediaName ) => {
				const states = medias[ mediaName ] || {};
				const stateKeys = [];

				allStates.forEach( ( { id } ) => {
					if ( LodashBasic.has( states, id ) ) {
						stateKeys.push( id );
					}
				} );

				stateKeys.forEach( ( stateName ) => {
					callback( {
						component: componentName,
						media: mediaName,
						state: stateName,
						style: states[ stateName ],
					} );
				} );
			} );
		} );
	}

	static normalizedStates() {
		const normalized = {};
		Object.keys( statesById ).forEach( ( stateId ) => {
			normalized[ stateId ] = {};
		} );
		return normalized;
	}

	static normalizedDefault() {
		const normalized = {};
		Object.keys( mediasById ).forEach( ( mediaId ) => {
			normalized[ mediaId ] = Utils.normalizedStates();
		} );
		return normalized;
	}

	static extractProperty( style, property, newName, defaultValue = {} ) {
		const descendents = LodashBasic.get( style, property, defaultValue );
		const defaultDesc = LodashBasic.clone( style );
		LodashBasic.unset( defaultDesc, property );
		LodashBasic.set( descendents, newName, defaultDesc );
		return descendents;
	}

	static getComponents( style ) {
		return Utils.extractProperty( style, 'descendants', 'default' );
	}

	static getStates( style ) {
		return Utils.extractProperty( style, 'states', 'normal' );
	}

	static getMedias( style ) {
		return Utils.extractProperty( style, 'media', 'desktop' );
	}

	static normalizeProps( props ) {
		return Utils.getMedias( props );
	}

	static denormalizeProps( props ) {
		const medias = window.structuredClone( props );
		LodashBasic.unset( medias, 'desktop' );
		return {
			media: {
				...medias,
			},
			...props.desktop,
		};
	}

	static normalizeStyle( style, settings_ ) {
		const settings = LodashBasic.merge(
			{
				comply: false,
				allowedComponents: false,
				skipEmpty: false,
				skipClone: false,
			},
			settings_
		);

		if ( ! settings.skipClone ) {
			style = window.structuredClone( style );
		}

		if ( settings.comply ) {
			style = settings.comply( style );
		}

		let components = Utils.getComponents( style );

		if ( settings.allowedComponents ) {
			components = LodashBasic.pick(
				components,
				settings.allowedComponents
			);
		}

		const normalizedComponents = {};
		Object.keys( components ).forEach( ( componentName ) => {
			const component = components[ componentName ];
			const normalized = settings.skipEmpty
				? {}
				: Utils.normalizedDefault();

			const states = Utils.getStates( component );

			Object.keys( states ).forEach( ( stateName ) => {
				const medias = Utils.getMedias( states[ stateName ] );

				Object.keys( medias ).forEach( ( mediaName ) => {
					LodashBasic.set(
						normalized,
						mediaName + '.' + stateName,
						medias[ mediaName ]
					);
				} );
			} );

			normalizedComponents[ componentName ] = normalized;
		} );

		return normalizedComponents;
	}

	static denormalizeComponents( normalizedComponents ) {
		const componentStates = {};
		Utils.walkStyle(
			normalizedComponents,
			( { component, media, state, style } ) => {
				let path = [ component, 'states', state, 'media', media ];

				if ( media === 'desktop' ) {
					if ( state === 'normal' ) {
						path = [ component ];
					} else {
						path = [ component, 'states', state ];
					}
				} else if ( state === 'normal' ) {
					path = [ component, 'media', media ];
				}

				const oldVal = LodashBasic.get( componentStates, path );
				LodashBasic.set(
					componentStates,
					path,
					LodashBasic.merge( {}, oldVal, style )
				);
			}
		);

		return LodashBasic.merge( {}, componentStates.default, {
			descendants: LodashBasic.omit( componentStates, 'default' ),
		} );
	}

	static composeClassForMedia( media, value, prefix, allowEmpty = false ) {
		if ( ! allowEmpty ) {
			const isEmptyString =
				LodashBasic.isString( value ) && value.length === 0;
			if ( isEmptyString ) {
				return;
			}
		}
		const mediaPrefix = LodashBasic.get(
			mediasById[ media ],
			'gridPrefix',
			false
		);
		const prefixedClass = LodashBasic.compactWithExceptions(
			[ prefix, mediaPrefix, value ],
			[ 0, '0' ]
		).join( '-' );
		return prefixedClass;
	}

	static composeClassesByMedia( valuesByMedia, prefix, allowEmpty = false ) {
		const classes = [];
		LodashBasic.each( valuesByMedia, ( value, media ) => {
			classes.push(
				Utils.composeClassForMedia( media, value, prefix, allowEmpty )
			);
		} );
		return classes;
	}
}

export { Utils, Config };
