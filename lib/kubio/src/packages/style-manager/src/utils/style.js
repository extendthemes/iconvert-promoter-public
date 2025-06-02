import _ from 'lodash';

import { mediasById } from '../medias';
import { states as allStates, statesById } from '../states';

const walkStyle = function ( style, callback ) {
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
				if ( _.has( states, id ) ) {
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
};
const normalizedStyle = () => {
	return {};
};

const normalizedStates = () => {
	const normalized = {};
	Object.keys( statesById ).forEach( ( stateId ) => {
		normalized[ stateId ] = normalizedStyle();
	} );
	return normalized;
};

const normalizeMedias = () => {
	const normalized = {};
	_.each( mediasById, ( media, mediaId ) => {
		normalized[ mediaId ] = {};
	} );
	return normalized;
};

const normalizedDefault = () => {
	const normalized = {};
	Object.keys( mediasById ).forEach( ( mediaId ) => {
		normalized[ mediaId ] = normalizedStates();
	} );
	return normalized;
};

const extractProperty = function (
	style,
	property,
	newName,
	defaultValue = {}
) {
	const descendents = _.get( style, property, defaultValue );
	const defaultDesc = _.clone( style );
	_.unset( defaultDesc, property );
	_.set( descendents, newName, defaultDesc );
	return descendents;
};

const getComponents = function ( style ) {
	const comp = extractProperty( style, 'descendants', 'default' );
	return comp;
};

const getStates = function ( style ) {
	const states = extractProperty( style, 'states', 'normal' );
	return states;
};

const getMedias = function ( style ) {
	const medias = extractProperty( style, 'media', 'desktop' );
	return medias;
};

const normalizeProps = function ( props ) {
	return getMedias( props );
};

const denormalizeProps = function ( props ) {
	const medias = window.structuredClone( props );
	_.unset( medias, 'desktop' );
	return {
		media: {
			...medias,
		},
		...props.desktop,
	};
};

/*
* {
    desktop: {
      normal: {},
      hover: {},
      ...
    },
    ...
  }
 */

const normalizeStyle = function (
	style,
	{
		comply,
		allowedComponents = false,
		skipEmpty = false,
		skipClone = false,
	} = {}
) {
	if ( ! skipClone ) {
		style = window.structuredClone( style );
	}

	if ( comply ) {
		style = comply( style );
	}

	let components = getComponents( style );

	if ( allowedComponents ) {
		components = _.pick( components, allowedComponents );
	}

	const normalizedComponents = {};
	Object.keys( components ).forEach( ( componentName ) => {
		const component = components[ componentName ];
		const normalized = skipEmpty ? {} : normalizedDefault();

		const states = getStates( component );

		Object.keys( states ).forEach( ( stateName ) => {
			const medias = getMedias( states[ stateName ] );

			Object.keys( medias ).forEach( ( mediaName ) => {
				_.set(
					normalized,
					mediaName + '.' + stateName,
					medias[ mediaName ]
				);
			} );
		} );

		normalizedComponents[ componentName ] = normalized;
	} );

	return normalizedComponents;
};

const denormalizeComponents = function ( normalizedComponents ) {
	const componentStates = {};
	walkStyle( normalizedComponents, ( { component, media, state, style } ) => {
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

		const oldVal = _.get( componentStates, path );
		_.set( componentStates, path, _.merge( {}, oldVal, style ) );
	} );

	return {
		...componentStates.default,
		descendants: {
			..._.omit( componentStates, 'default' ),
		},
	};
};

export {
	walkStyle,
	normalizeStyle,
	normalizeProps,
	denormalizeProps,
	denormalizeComponents,
	normalizedDefault,
};
