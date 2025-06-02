import { __ } from '@wordpress/i18n';

const colorTypeOptions = [
	{ value: 'official', label: __( 'Official', 'iconvert-promoter' ) },
	{ value: 'custom', label: __( 'Custom', 'iconvert-promoter' ) },
];

const objectColorIcons = [
	{ name: 'facebook', color: 'rgb(59,89,152)' },
	{ name: 'twitter', color: 'rgb(29,161,242)' },
	{ name: 'linkedin', color: 'rgb(0,119,181)' },
	{ name: 'youtube', color: 'rgb(255,0,0)' },
	{ name: 'whatsapp', color: 'rgb(37,211,102)' },
	{ name: 'tumblr', color: 'rgb(54,70,93)' },
	{ name: 'instagram', color: 'rgb(195,42,163)' },
	{ name: 'snapchat', color: 'rgb(255,252,0)' },
	{ name: 'pinterest', color: 'rgb(189,8,28)' },
	{ name: 'reddit', color: 'rgb(255,69,0)' },
	{ name: 'foursquare', color: 'rgb(249,72,119)' },
	{ name: 'stumbleupon', color: 'rgb(233,72,38)' },
	{ name: 'viadeo', color: 'rgb(240,115,85)' },
	{ name: 'deviantart', color: 'rgb(5,204,71)' },
	{ name: 'flickr', color: 'rgb(244,0,131)' },
	{ name: 'vimeo', color: 'rgb(26,183,234)' },
	{ name: 'google', color: 'rgb(219,68,55)' },
	{ name: 'medium', color: 'rgb(2,184,117)' },
	{ name: 'behance', color: 'rgb(23,105,255)' },
	{ name: 'wordpress', color: 'rgb(61,139,187)' },
];

const properties = {
	colorTypeOptions,
	objectColorIcons,
};
export { properties };
