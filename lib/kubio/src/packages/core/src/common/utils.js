import { refreshBlockStyleRefs } from '@kubio/utils';
import { getBlockVariations } from '@wordpress/blocks';
import _ from 'lodash';

const applyMultipleStyles = ( style, dataHelper ) => {
	const styleCopy = window.structuredClone( style );
	const descendants = _.get( styleCopy, 'descendants' );
	if ( descendants ) {
		delete styleCopy.descendants;
	}

	setMultipleStyles( styleCopy, {}, dataHelper );

	_.each( descendants, ( descendantValue, descendantName ) => {
		const options = {
			styledComponent: descendantName,
		};
		setMultipleStyles( descendantValue, options, dataHelper );
	} );
};
const setMultipleStyles = ( defaultValue, options = {}, dataHelper ) => {
	_.each( defaultValue, ( value, property ) => {
		dataHelper.setStyle( property, value, options );
	} );
};

const getBlockDefaultVariation = ( blockName ) => {
	const variations = getBlockVariations( blockName );
	const defaultVariation = variations?.filter(
		( variation ) => variation.isDefault
	)?.[ 0 ];
	return defaultVariation
		? refreshBlockStyleRefs( window.structuredClone( defaultVariation ) )
		: null;
};

export { applyMultipleStyles, getBlockDefaultVariation };
