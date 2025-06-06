/**
 * WordPress dependencies
 */
import { cog, styles, listView } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

export const TAB_SETTINGS = {
	name: 'settings',
	title: __( 'Settings', 'kubio' ),
	value: 'settings',
	icon: cog,
	className: 'block-editor-block-inspector__tab-item',
};

export const TAB_STYLES = {
	name: 'styles',
	title: __( 'Styles', 'kubio' ),
	value: 'styles',
	icon: styles,
	className: 'block-editor-block-inspector__tab-item',
};

export const TAB_LIST_VIEW = {
	name: 'list',
	title: __( 'List View', 'kubio' ),
	value: 'list-view',
	icon: listView,
	className: 'block-editor-block-inspector__tab-item',
};
