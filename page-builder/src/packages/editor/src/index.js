import { fetchLinkSuggestions, registerTemplateStore } from '@kubio/core';
import {
	registerCoreBlocks,
	__experimentalRegisterExperimentalCoreBlocks,
} from '@wordpress/block-library';
import { render, StrictMode } from '@wordpress/element';
import '@wordpress/notices';
import _, { cloneDeep } from 'lodash';
import { addFilter, doAction } from '@wordpress/hooks';
import { Editor } from './components';
import {
	registerEditSiteStore,
	SubSidebarArea,
	registerSidebarArea,
	registerSubSidebarArea,
	SidebarArea,
	// Editor,
} from '@kubio/editor';

import { initFirebaseData } from '@kubio/block-patterns';

/**
 * Initializes the site editor screen.
 *
 * @param {string} editorClassName class of the root element to render the screen in.
 * @param {Object} settings        Editor settings.
 */
export function initialize( editorClassName, settings ) {
	const editorNode = document.querySelector( `.${ editorClassName }` );
	if ( ! editorNode ) {
		return;
	}
	settings = cloneDeep( settings );
	settings.__experimentalFetchLinkSuggestions = fetchLinkSuggestions;
	settings.__experimentalSpotlightEntityBlocks = [ 'core/template-part' ];

	addFilter(
		'kubio.editor.inserterItems',
		'cspromos.editor.inserterItems',
		( items ) => {
			return items.filter( ( { name } ) => {
				return (
					name === 'core/html' || name.startsWith( 'cspromo/' ) /* ||
					name.startsWith( 'woocommerce/' ) */
				);
			} );
		}
	);

	const searchParams = new URLSearchParams( window.location.search );
	settings.isGutentagDebug = !! searchParams.get( 'kubio-debug' );

	const initialState = settings.state;
	delete settings.state;
	initialState.settings = settings;

	doAction( 'kubio.editor.initialize' );
	registerCoreBlocks();

	// initializing the firebase data before defining the register functions reduces stress on store
	// data is queued in preregisteredPatterns and preregisteredCategories
	initFirebaseData();

	if ( _.isFunction( __experimentalRegisterExperimentalCoreBlocks ) ) {
		__experimentalRegisterExperimentalCoreBlocks( {
			enableFSEBlocks: true,
		} );
	}
	registerEditSiteStore( initialState );
	registerTemplateStore();
	render(
		<StrictMode>
			<Editor initialSettings={ initialState.settings } />
		</StrictMode>,
		document.querySelector( `.${ editorClassName }` )
	);

	window.kubioToggleDebug = ( value ) => {
		// eslint-disable-next-line no-undef
		wp.data.dispatch( 'kubio/edit-site' ).toggleGutentagDebug( value );
	};
}

// export { default as __experimentalFullscreenModeClose } from './components/header/fullscreen-mode-close';
export { SidebarArea, SubSidebarArea, registerSubSidebarArea };
