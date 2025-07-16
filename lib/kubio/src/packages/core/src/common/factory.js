import { createBlock, synchronizeBlocksWithTemplate } from '@wordpress/blocks';
import _ from 'lodash';
import { withColibri } from '../data-wrapper/access';
import { getBlockDefaultVariation } from './utils';

const createBlockWithDataHelper = ( name, mapDataHelper = null ) => {
	let block = null;
	const defaultVariation = getBlockDefaultVariation( name );
	const data = {};
	if ( defaultVariation ) {
		const { attributes, innerBlocks = [] } = defaultVariation;
		const createdInnerBlocks = [];
		innerBlocks?.forEach( ( innerBlock ) => {
			createdInnerBlocks.push( createBlock( ...innerBlock ) );
		} );
		block = createBlock( name, attributes, createdInnerBlocks );
	} else {
		block = createBlock( name );
	}
	const helper = withColibri.init( data );
	if ( mapDataHelper ) {
		mapDataHelper( helper );
	}
	const { kubio, localData } = helper.export();
	block.attributes.kubio = kubio;
	_.each( localData, ( attributeValue, attributeName ) => {
		block.attributes[ attributeName ] = attributeValue;
	} );

	return block;
};

const composeBlockWithStyle = (
	name,
	{ _style = {}, _props = {}, style = {}, props, attributes = {} } = {},
	children,
	asTemplate = true
) => {
	const newAttributes = {
		kubio: {
			// styleRef: shortid.generate(), - the style ref is added automatically on block insertion
			style,
			props,
			_props,
			_style,
		},
		...attributes,
	};
	return asTemplate
		? [ name, newAttributes, children ]
		: { name, attributes: newAttributes, innerBlocks: children || [] };
};

const convertTemplateFormatToBlock = ( template ) => {
	return synchronizeBlocksWithTemplate( [], template );
};

export {
	composeBlockWithStyle,
	createBlockWithDataHelper,
	convertTemplateFormatToBlock,
};
