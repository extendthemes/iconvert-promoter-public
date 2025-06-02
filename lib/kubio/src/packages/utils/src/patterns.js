import _, { omit } from 'lodash';
import { dispatch, select } from '@wordpress/data';
import { STORE_KEY } from '../../constants';
import { removeEmptyObjectV2 } from './index';
// import { isFreeVersion } from "@kubio/pro";

const PATTERNS_KEY = '__experimentalBlockPatterns';
const PATTERN_CATEGORIES_KEY = '__experimentalBlockPatternCategories';
const BLOCK_PRESETS_KEY = 'kubioBlockPresets';
const PRO_BLOCKS = [
	'carousel',
	'slider',
	'flip-box',
	'multiple-images', // - image collage
	'subscribe-form',
	'pricing',
	'pricing-table',
	'counter',
	'subscribe-form',
	'breadcrumb',
	'menu/vertical-menu', // - not implemented yet
	'media-slider',
	'media-carousel',
	'advanced-gallery',
	'blob',
];
const TypesByBlockName = {
	'kubio/section': 'content',
	'kubio/header': 'header',
	'kubio/footer': 'footer',
};

/**
 * This function returns the clean version of a given block, without styleRef data. Maybe move this in '@kubio/utils';
 *
 * @param {Object} props   The given props for the function.
 * @param          options
 */
const getCleanBlock = ( props, options = {} ) => {
	const { removeKubioIds = true } = _.merge(
		{
			removeKubioIds: true,
		},
		options
	);
	let { name, innerBlocks, attributes = {} } = props;
	attributes = removeEmptyObjectV2( {
		...( attributes || {} ),
		kubio: removeKubioIds
			? omit( attributes?.kubio || {}, [ 'styleRef', 'hash', 'id' ] )
			: attributes?.kubio || {},
	} );

	return [
		name,
		attributes,
		innerBlocks.map( ( innerBlock ) =>
			getCleanBlock( innerBlock, options )
		),
	];
};

const getMappedCategory = ( category, type = 'content' ) => {
	return _.toLower( `kubio-${ type }/${ category }` );
};

// not working due to CORS
const URLtoDataURL = ( url ) =>
	window
		.fetch( url )
		.then( ( response ) => response.blob() )
		.then(
			( blob ) =>
				new Promise( ( resolve, reject ) => {
					const reader = new window.FileReader();
					reader.onloadend = () => resolve( reader.result );
					reader.onerror = reject;
					reader.readAsDataURL( blob );
				} )
		);

/**
 * This is used only with cloud snippets
 *
 * @param template
 * @param key
 * @param hooks
 * @param replace
 */
const registerPattern = ( template, replace = false ) => {
	let settings = select( STORE_KEY ).getSettings();
	const { updateSettings } = dispatch( STORE_KEY );
	const type = TypesByBlockName[ template.component ];
	const mappedCategory = getMappedCategory( template.category, type );
	const content = _.isString( template.value )
		? JSON.parse( template.value )
		: template.value;
	const isRestricted = template.isPro;
	// const isRestricted = isFreeVersion() && template.isPro;
	const extraData = {};

	if ( template?.context && template.component === 'kubio/header' ) {
		extraData.context = template.context;
	}
	const cloudPresetId = parseInt( template?.cloudPresetId );
	const pattern = {
		name: `${ mappedCategory }/${ template.name }/${ template.id }`,
		title: template.name,
		collections: [],
		categories: [ mappedCategory ],
		cloudPresetId,
		screenshot: template.screenshot,
		fromColibri: true,
		fromFirebase: true,
		isProOnFree: isRestricted,
		isGutentagPattern: true,
		categoryCloudId: parseInt( template?.categoryId ),
		content,
		...extraData,
	};

	//shallow copy
	settings = { ...settings };

	// we can register a pattern at a specific index, or add it in the stack.
	if ( replace ) {
		const patterns = settings[ PATTERNS_KEY ];
		const currentIndex = _.findIndex(
			patterns,
			( pattern ) => pattern?.cloudPresetId === cloudPresetId
		);
		if ( currentIndex !== -1 ) {
			settings[ PATTERNS_KEY ][ currentIndex ] = pattern;
		}
	} else {
		settings[ PATTERNS_KEY ].push( pattern );
	}

	updateSettings( settings );
};

const registerPreset = ( presetFromCloud, replace = false ) => {
	let settings = select( STORE_KEY ).getSettings();
	const { updateSettings } = dispatch( STORE_KEY );

	const content = JSON.parse( presetFromCloud.value );

	const extraData = {};

	if ( presetFromCloud?.context ) {
		extraData.context = presetFromCloud.context;
	}
	const cloudPresetId = parseInt( presetFromCloud?.cloudPresetId );
	const preset = {
		...presetFromCloud,
		...extraData,
		content,
		title: presetFromCloud.name,
		cloudPresetId,
	};

	//shallow copy
	settings = { ...settings };
	if ( replace ) {
		const presets = settings[ BLOCK_PRESETS_KEY ];
		const currentIndex = _.findIndex(
			presets,
			( preset ) => preset?.cloudPresetId === cloudPresetId
		);
		if ( currentIndex !== -1 ) {
			settings[ BLOCK_PRESETS_KEY ][ currentIndex ] = preset;
		}
	} else {
		settings[ BLOCK_PRESETS_KEY ].push( preset );
	}

	updateSettings( settings );
};

const removePattern = ( id ) => {
	const settings = select( STORE_KEY ).getSettings();
	const { updateSettings } = dispatch( STORE_KEY );

	const key = settings[ PATTERNS_KEY ].findIndex( ( item ) => {
		return id === item.cloudPresetId;
	} );

	settings[ PATTERNS_KEY ].splice( key, 1 );

	updateSettings( settings );

	// return the index of the delete item, in case we want to add a new one there.
	return key;
};

export {
	PATTERNS_KEY,
	PATTERN_CATEGORIES_KEY,
	PRO_BLOCKS,
	getCleanBlock,
	URLtoDataURL,
	registerPattern,
	removePattern,
	registerPreset,
};
