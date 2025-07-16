import _, { difference } from 'lodash';

const getStyledElementBemClass = ( blockName, name ) => {
	const base = 'wp-block-' + ( blockName || 'blockName' ).replace( '/', '-' );

	if ( ! name ) {
		return base;
	}

	return base + '__' + name;
};

const getStyledElementSharedClasses = ( elementName, styleRef ) => {
	return 'style-' + styleRef + '-' + elementName;
};

const getStyledElementLocalClasses = ( elementName, localId = false ) => {
	return localId ? 'style-local-' + localId + '-' + elementName : false;
};

const getStyledElementBaseClasses = ( {
	name,
	localId,
	styleRef,
	blockName,
	extraClasses,
	options = {},
} ) => {
	const mergedOptions = _.merge(
		{},
		{
			disableStyleClasses: false,
			withoutClasses: [],
		},
		options
	);
	let styleClases = [];
	if ( ! mergedOptions?.disableStyleClasses ) {
		styleClases = [
			getStyledElementSharedClasses( name, styleRef ),
			getStyledElementLocalClasses( name, localId ),
		];
	}

	let newClassName = [
		'position-relative',
		getStyledElementBemClass( blockName, name ),
	].concat( styleClases, extraClasses );

	newClassName = difference( newClassName, mergedOptions?.withoutClasses );

	return newClassName;
};

export {
	getStyledElementLocalClasses,
	getStyledElementSharedClasses,
	getStyledElementBaseClasses,
	getStyledElementBemClass,
};
