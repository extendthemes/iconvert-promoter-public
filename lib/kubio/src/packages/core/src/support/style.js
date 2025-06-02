import { addFilter } from '@wordpress/hooks';

const addStyleSupport = (
	name,
	{ support, stylePanel = null, contentPanel = null }
) => {
	addFilter(
		'kubio.registerBlockStyle',
		`kubio.style.${ name.replace( /\//gim, '_' ) }`,
		( stylesByBlock ) => {
			stylesByBlock[ name ] = support;
			return stylesByBlock;
		}
	);

	addFilter(
		'kubio.registerBlockStyle.stylePanel',
		`kubio.style.stylePanel.${ name.replace( /\//gim, '_' ) }`,
		( stylesByBlock ) => {
			stylesByBlock[ name ] = stylePanel;
			return stylesByBlock;
		}
	);

	addFilter(
		'kubio.registerBlockStyle.contentPanel',
		`kubio.style.contentPanel.${ name.replace( /\//gim, '_' ) }`,
		( stylesByBlock ) => {
			stylesByBlock[ name ] = contentPanel;
			return stylesByBlock;
		}
	);
};

export { addStyleSupport };
