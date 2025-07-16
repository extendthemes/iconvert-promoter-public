import { Media, Utils } from '@kubio/style-manager';
import { mergeNoArrays, deepmergeAll } from '@kubio/utils';
import _ from 'lodash';
import { getBlockCurrentData, getBlockDefault } from './index';

const { mediasById } = Media;
const { denormalizeComponents, normalizeStyle } = Utils;

const mergeProps = ( defaultProps, nodeProps ) => {
	const result = defaultProps;

	_.each( nodeProps, ( propsOfType, propsType ) => {
		const props = mergeNoArrays(
			{},
			defaultProps[ propsType ],
			propsOfType
		);
		const medias = _.get( props, 'media', {} );

		_.unset( props, 'media' );

		const merged = {
			...props,
		};

		const defaultMedia = props;

		Object.keys( mediasById ).forEach( ( mediaName ) => {
			if ( mediaName !== 'desktop' ) {
				_.set(
					merged,
					[ 'media', mediaName ],
					mergeNoArrays( {}, defaultMedia, medias[ mediaName ] )
				);
			}
		} );

		result[ propsType ] = merged;
	} );
	return result;
};

//const defaultStyle = getDefaultStyle( node );
// 	const nodeStyle = getNodeStyle( node );
const mergeStyle = ( style, defaultStyle, { states, statesByComponent } ) => {
	const result = defaultStyle;
	_.each( defaultStyle, ( defaultStyleObj, name ) => {
		const mergedStyle = mergeNoArrays(
			{},
			defaultStyleObj,
			_.get( style, name, {} )
		);

		if ( _.isEmpty( mergedStyle ) ) {
			return mergedStyle;
		}

		const styledComponents = normalizeStyle( mergedStyle, {
			skipClone: true,
		} );

		const mergeStyledComponents = mergeNormalizedComponents(
			styledComponents,
			{
				states,
				statesByComponent,
			}
		);

		const denormalizedMergedStyle = denormalizeComponents(
			mergeStyledComponents
		);
		result[ name ] = denormalizedMergedStyle;
	} );

	return result;
};

const mergeNormalizedComponents = ( style, { states, statesByComponent } ) => {
	const merged = {};
	Object.keys( style ).forEach( ( componentName ) => {
		let componentStates = _.get( statesByComponent, componentName, states );
		if ( componentName === 'default' ) {
			componentStates = states;
		}
		merged[ componentName ] = mergeNormalizedStyle(
			style[ componentName ],
			{
				states: componentStates,
			}
		);
	} );
	return merged;
};

const mergeNormalizedStyle = function ( style, { states } ) {
	const merged = {};
	addState( style, 'normal', merged );
	_.each( states, ( stateId ) => {
		if ( stateId !== 'normal' ) {
			addState( style, stateId, merged );
		}
	} );
	return merged;
};

const addState = ( normalizedStyle, state, merged = {} ) => {
	const isNormal = state === 'normal';
	const desktopNormalStyle = isNormal
		? {}
		: _.get( normalizedStyle, 'desktop.normal' );

	const desktopStateStyle = _.get( normalizedStyle, 'desktop.' + state );
	_.set(
		merged,
		'desktop.' + state,
		deepmergeAll( [ {}, desktopNormalStyle, desktopStateStyle ] )
	);

	Object.keys( normalizedStyle ).forEach( ( mediaName ) => {
		if ( mediaName === 'desktop' ) {
			return;
		}

		const deviceNormalMergedStyle = isNormal
			? {}
			: _.get( merged, mediaName + '.normal' );

		const statePath = mediaName + '.' + state;
		const deviceStateStyle = _.get( normalizedStyle, statePath, {} );

		_.set(
			merged,
			statePath,
			deepmergeAll( [
				{},
				desktopNormalStyle,
				deviceNormalMergedStyle,
				desktopStateStyle,
				deviceStateStyle,
			] )
		);
	} );
};

const mergeBlockData = ( block ) => {
	const { name } = block;
	const blockData = getBlockCurrentData( block );
	const blockDefault = getBlockDefault( name );
	const { model = {} } = blockData;
	const props = mergeProps(
		window.structuredClone( blockDefault.props ),
		model.props
	);
	const style = mergeStyle(
		model.style,
		window.structuredClone( blockDefault.style ),
		{
			statesByComponent: blockData.statesByComponent,
		}
	);
	return {
		style,
		props,
	};
};
const mergeMainAttribute = ( sharedData, blockName ) => {
	const merged = mergeBlockData( {
		name: blockName,
		attributes: { kubio: sharedData },
	} );
	const { style, props } = merged;
	return {
		...sharedData,
		style: style?.shared,
		_style: style?.local,
		props: props?.shared,
		_props: props?.local,
	};
};

export {
	mergeNormalizedComponents,
	mergeNormalizedStyle,
	mergeStyle,
	mergeProps,
	mergeBlockData,
	mergeMainAttribute,
};
