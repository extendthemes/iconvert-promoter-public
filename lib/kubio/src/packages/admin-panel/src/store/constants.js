export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

export const SET_SELECTED_NODE = 'SET_SELECTED_NODE';
export const SET_SELECTED_NODE_DOM_UUID = 'SET_SELECTED_NODE_DOM_UUID';
export const SET_SELECTED_NODE_ADVANCED = 'SET_SELECTED_NODE_ADVANCED';
export const SET_HOVERED_NODE = 'SET_HOVERED_NODE';

export const SET_HEADER_NODES = 'SET_HEADER_NODES';
export const SET_FOOTER_NODES = 'SET_FOOTER_NODES';
export const SET_CONTENT_NODES = 'SET_CONTENT_NODES';

export const ADD_NODE = 'ADD_NODE';
export const ADD_NODE_INTERNAL = 'ADD_NODE_INTERNAL';
export const UPDATE_NODE = 'UPDATE_NODE';
export const MOVE_NODE = 'MOVE_NODE';
export const REORDER_NODE = 'REORDER_NODE';
export const DELETE_NODE = 'DELETE_NODE';
export const DELETE_SECTION_NODE = 'DELETE_SECTION_NODE';

export const RESERVE_ID = 'RESERVE_ID';

export const ADD_THEME_COLOR = 'ADD_THEME_COLOR';
export const ADD_SVG_ICON = 'ADD_SVG_ICON';
export const ADD_API_KEYS = 'ADD_API_KEYS';
export const API_KEYS = 'API_KEYS';

export const SVG_ICON = 'SVG_ICON';
export const FONT_ICONS_CONFIG = 'FONT_ICONS_CONFIG';
export const THEME_DATA = 'THEME_DATA';
export const THEME_COLORS = 'THEME_COLORS';
export const ADD_FONT = 'ADD_FONT';
export const THEME_COLOR_PALETTES = 'THEME_COLOR_PALETTES';
export const REPLACE_THEME_COLORS = 'REPLACE_THEME_COLORS';
export const UPDATE_THEME_COLOR = 'UPDATE_THEME_COLOR';

export const CUSTOMIZER_SESSION_WEB_FONTS = 'CUSTOMIZER_SESSION_WEB_FONTS';
export const ADD_CUSTOMIZER_SESSION_WEB_FONTS =
	'ADD_CUSTOMIZER_SESSION_WEB_FONTS';

export const PREVIEW_SESSION_WEB_FONTS = 'PREVIEW_SESSION_WEB_FONTS';
export const ADD_PREVIEW_SESSION_WEB_FONTS = 'ADD_PREVIEW_SESSION_WEB_FONTS';

export const FONTS_IN_USE = 'FONTS_IN_USE';
export const FONTS_IN_USE_BY_VALUE = 'FONTS_IN_USE_BY_VALUE';

export const THEME_TYPOGRAPHY = 'THEME_TYPOGRAPHY';
export const SET_THEME_TYPOGRAPHY = 'SET_THEME_TYPOGRAPHY';
export const SORT_CHILD_NODES = 'SORT_CHILD_NODES';
export const CREATE_THEME_LOCATION = 'CREATE_THEME_LOCATION';
export const DELETE_THEME_LOCATION = 'DELETE_THEME_LOCATION';
export const CLEAN_UP_MENU = 'CLEAN_UP_MENU';
export const THEME_LOCATIONS = 'THEME_LOCATIONS';
export const WIDGET_AREAS = 'WIDGET_AREAS';
export const THEME_COLORS_ARRAY = 'THEME_COLORS_ARRAY';
export const DELETE_THEME_COLOR = 'DELETE_THEME_COLOR';
export const BACK_TO_GENERAL_SETTINGS_PANEL = 'BACK_TO_GENERAL_SETTINGS_PANEL';

export const BASE_COLORS_IDS = {
	FIRST: 0,
	SECOND: 1,
	THIRD: 2,
	FOURTH: 3,
	FIFTH: 4,
	SIXTH: 5,
};

export const menuItems = {
	addMenu: 'addMenu',
	optionsMenu: 'optionsMenu',
	typographyMenu: 'typographyMenu',
	colorPalettesMenu: 'colorPalettesMenu',
	spacingMenu: 'spacingMenu',
	effectsMenu: 'effectsMenu',
	multilanguageMenu: 'multilanguageMenu',
	templatesMenu: 'templatesMenu',

	// wpmu
	wpmu_security: 'wpmuSecurity',
	wpmu_performance: 'wpmuPerformance',
};

// ENUMS //
const ContentMetas = {
	INSERT_ELEMENT: 'insert-element',
	IS_PRESET: 'is-preset',
	IS_DEFAULT_PRESET: 'is-default-preset',
	IS_FREE: 'is-free',
};

const InsertElements = {
	Categories: {
		BASIC: 'Basic',
		COMPONENTS: 'Components',
		ADVANCED_MODULES: 'Advanced Modules',
		EXPORTED: 'Exported',
		SITE_DATA: 'Site Data',
		WIDGETS: 'Widgets',
		BLOG_POST: 'Blog Post',
		BLOG: 'Blog',
		ECOMMERCE: 'eCommerce',
	},
};

const ColibriIcons = {
	COLIBRI_COLUMNS: 'colibri-columns',
	COLIBRI_ACCORDION_MENU: 'colibri-accordion-menu',
	COLIBRI_ACCORDION: 'colibri-accordion',
	INTERNAL_ELEMENTS_BREADCRUMB: 'internal/elements/breadcrumb',
	COLIBRI_BUTTON: 'colibri-button',
	INTERNAL_ELEMENTS_CAROUSEL: 'internal/elements/carousel',
	COLIBRI_CONTACT_FORM: 'colibri-contact-form',
	COLIBRI_CONTENT_SWAP: 'colibri-content-swap',
	COLIBRI_COUNTERS: 'colibri-counters',
	COLIBRI_DIVIDER: 'colibri-divider',
	INTERNAL_ELEMENTS_IMAGE_EFFECTS: 'internal/elements/image-effects',
	COLIBRI_HEADING: 'colibri-heading',
	COLIBRI_DROPDOWN_MENU: 'colibri-dropdown-menu',
	INTERNAL_ELEMENTS_HTML: 'internal/elements/html',
	COLIBRI_ICON_LIST: 'colibri-icon-list',
	COLIBRI_ICON: 'colibri-icon',
	COLIBRI_IMAGE: 'colibri-image',
	COLIBRI_LINK: 'colibri-link',
	COLIBRI_LOGO: 'colibri-logo',
	COLIBRI_MAP: 'colibri-map',
	COLIBRI_MULTIPLE_IMAGES: 'colibri-multiple-images',
	COLIBRI_PAGE_TITLE: 'colibri-page-title',
	COLIBRI_GRID_GALLERY: 'colibri-grid-gallery',
	COLIBRI_PRICING_TABLE: 'colibri-pricing-table',
	COLIBRI_PRICING: 'colibri-pricing',
	COLIBRI_SEARCH: 'colibri-search',
	COLIBRI_SHORTCODE: 'colibri-shortcode',
	INTERNAL_ELEMENTS_BLOG_POSTS: 'internal/elements/blog-posts',
	COLIBRI_BLOG_POSTS: 'colibri-blog-posts',
	COLIBRI_SOCIAL: 'colibri-social',
	COLIBRI_SPACER: 'colibri-spacer',
	COLIBRI_TABS: 'colibri-tabs',
	COLIBRI_TEXT: 'colibri-text',
	COLIBRI_VERTICAL_MENU: 'colibri-vertical-menu',
	COLIBRI_VIDEO: 'colibri-video',
	COLIBRI_WIDGETS: 'colibri-widgets',
	INTERNAL_ELEMENTS_SLIDEHSOW: 'internal/elements/slidehsow',
	INTERNAL_ELEMENTS_SOCIAL: 'internal/elements/social',
	FONT_AWESOME_CIRCLE: 'font-awesome/circle',
};

const IS_COLIBRI = document.domain.endsWith('colibriwp.com');

const GlobalFlags = {
	IS_COLIBRI,
	SHOW_PHOTO_GALLERY: !IS_COLIBRI,
};

export { ContentMetas, InsertElements, ColibriIcons, GlobalFlags };
