import { posterInsertBlockDefault } from './generators/insert-block-default';
import NamesOfBlocks from '../blocks-list';
import { __ } from '@wordpress/i18n';
import { addProTagToItems } from '@kubio/pro';

const videoDisplayValues = {
	VIDEO: 'video',
	POSTER_IMAGE: 'posterImage',
	ICON_WITH_LIGHTBOX: 'iconWithLightbox',
};

let videoDisplayOptions = [
	{ label: __( 'Video', 'kubio' ), value: videoDisplayValues.VIDEO },
	{
		label: __( 'Poster with Icon', 'kubio' ),
		value: videoDisplayValues.POSTER_IMAGE,
	},
	{
		label: __( 'Icon with lightbox', 'kubio' ),
		value: videoDisplayValues.ICON_WITH_LIGHTBOX,
	},
];

videoDisplayOptions = addProTagToItems( videoDisplayOptions, [
	videoDisplayValues.VIDEO,
] );

const videoDisplayAs = {
	values: videoDisplayValues,
	options: videoDisplayOptions,
};

const videoCategorysValues = {
	INTERNAL: 'internal',
	YOUTUBE: 'youtube',
	VIMEO: 'vimeo',
};

const videoCategorysOptions = [
	{
		label: __( 'Self hosted', 'kubio' ),
		value: videoCategorysValues.INTERNAL,
	},
	{ label: __( 'Youtube', 'kubio' ), value: videoCategorysValues.YOUTUBE },
	{ label: __( 'Vimeo', 'kubio' ), value: videoCategorysValues.VIMEO },
];

const videoCategory = {
	values: videoCategorysValues,
	options: videoCategorysOptions,
};
const posterPlayActionValues = {
	ICON: 'icon',
	BUTTON: 'button',
};
const posterPlayActionOptions = [
	{ label: __( 'Icon', 'kubio' ), value: posterPlayActionValues.ICON },
	{ label: __( 'Button', 'kubio' ), value: posterPlayActionValues.BUTTON },
];

const posterPlayAction = {
	values: posterPlayActionValues,
	options: posterPlayActionOptions,
};

const posterDefaultByType = {
	[ posterPlayActionValues.BUTTON ]: posterInsertBlockDefault(
		NamesOfBlocks.BUTTON
	),
	[ posterPlayActionValues.ICON ]: () => {
		return posterInsertBlockDefault( NamesOfBlocks.ICON )( {
			attributes: { name: 'font-awesome/play' },
		} );
	},
};

const aspectRatioOptions = [
	{ value: '3-2', label: '3:2' },
	{ value: '4-3', label: __( '4:3 - QXGA', 'kubio' ) },
	{ value: '16-9', label: __( '16:9 - HD', 'kubio' ) },
	{ value: '21-9', label: __( '21:9 - Ultra wide', 'kubio' ) },
];

const getAspectRatioClass = ( aspectRatioValue ) => {
	return `h-aspect-ratio--${ aspectRatioValue }`;
};

const posterDimensionOptions = [
	{ label: __( 'Auto', 'kubio' ), value: 'auto' },
];

const properties = {
	videoCategory,
	videoDisplayAs,
	posterPlayAction,
	aspectRatioOptions,
	posterPlayActionOptions,
	posterPlayActionValues,
	posterDimensionOptions,
	posterDefaultByType,
	videoDisplayValues,
	videoCategorysValues,
};

export { properties, getAspectRatioClass };
