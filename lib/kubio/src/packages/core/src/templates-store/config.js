import { __ } from '@wordpress/i18n';

const coreTemplatesSlugThatCanBeCopied = [ 'page', 'single' ];

//List of kubio templates that shoudl be used for multiple pages. It's not specific to one page. One a user wants to create
//a new header for a page with this template a new template should be created to not replace all the pages.
let coreKubioTemplatesSlugs = [
	'full-width',
	'page-with-left-sidebar',
	'page-with-right-sidebar',
];
coreKubioTemplatesSlugs = coreKubioTemplatesSlugs.concat(
	coreKubioTemplatesSlugs.map( ( slug ) => `kubio-${ slug }` )
);

const templatePartLabels = {
	// 'front-header': __('Front Page Header', 'kubio'),
	// header: __('Inner Page Header', 'kubio'),
};

const templateLabels = {
	404: __( '404 Page', 'kubio' ),
	search: __( 'Search Page', 'kubio' ),
	'front-page': __( 'Front Page', 'kubio' ),
	index: __( 'Archive Page', 'kubio' ),
	page: __( 'Inner Page', 'kubio' ),
	single: __( 'Post Page', 'kubio' ),
};

const coreTemplateOrder = [
	'front-page',
	'page',
	// 'archive',
	'index',
	'single',
	'archive-product',
	'single-product',
	'404',
	'search',
];

const defaultTemplatesByPostType = {
	post: 'single',
	page: 'page',
};

const templatePartsAreas = [ 'header', 'footer', 'sidebar' ];

const configPerType = {
	header: {
		blockName: 'kubio/header',
		label: __( 'Header', 'kubio' ),
	},
	footer: {
		blockName: 'kubio/footer',
		label: __( 'Footer', 'kubio' ),
	},
	sidebar: {
		blockName: 'kubio/sidebar',
		label: __( 'Sidebar', 'kubio' ),
	},
};

export {
	coreKubioTemplatesSlugs,
	coreTemplatesSlugThatCanBeCopied,
	templatePartLabels,
	templateLabels,
	coreTemplateOrder,
	templatePartsAreas,
	configPerType,
	defaultTemplatesByPostType,
};
