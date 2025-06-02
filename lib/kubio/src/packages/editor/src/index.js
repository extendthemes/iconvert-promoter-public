import { initFirebaseData } from '@kubio/block-patterns';
import {
	fetchLinkSuggestions,
	reactRender
} from '@kubio/core';
import {
	__experimentalRegisterExperimentalCoreBlocks,
	registerCoreBlocks,
} from '@wordpress/block-library';
import { StrictMode } from '@wordpress/element';
import { addAction, doAction } from '@wordpress/hooks';
import '@wordpress/notices';
import { isFunction } from 'lodash';
import Editor from './components/editor';
import SidebarArea from './components/sidebar/sidebar-area';
import {
	registerSidebarArea,
	registerSubSidebarArea,
} from './components/sidebar/sidebars-registry';
import SubSidebarArea from './components/sidebar/subsidebar-area';
import './hooks';
import registerEditSiteStore from './store';
import { STORE_KEY } from './store/constants';
/**
 * Initializes the site editor screen.
 *
 * @param {string} id       ID of the root element to render the screen in.
 * @param {Object} settings Editor settings.
 */
export function initialize(editorClassName, settings) {
	const editorNode = document.querySelector(`.${editorClassName}`);
	if (!editorNode) {
		return;
	}
	settings = cloneDeep(settings);
	settings.__experimentalFetchLinkSuggestions = fetchLinkSuggestions;
	settings.__experimentalSpotlightEntityBlocks = ['core/template-part'];

	const searchParams = new URLSearchParams(window.location.search);
	settings.isGutentagDebug = !!searchParams.get('kubio-debug');

	const initialState = settings.state;
	delete settings.state;
	initialState.settings = settings;

	doAction('kubio.editor.initialize');
	registerCoreBlocks();

	// initializing the firebase data before defining the register functions reduces stress on store
	// data is queued in preregisteredPatterns and preregisteredCategories
	initFirebaseData();

	if (isFunction(__experimentalRegisterExperimentalCoreBlocks)) {
		__experimentalRegisterExperimentalCoreBlocks({
			enableFSEBlocks: true,
		});
	}

	const EditorComponent = Editor;

	if (settings.wpVersion) {
		document.body.classList.add(
			`kubio-wp-` + settings.wpVersion.replace('.', '-')
		);
	}

	registerEditSiteStore(initialState);
	reactRender(
		<StrictMode>
			<EditorComponent initialSettings={initialState.settings} />
		</StrictMode>,
		document.getElementById(id)
	);

	window.kubioToggleDebug = (value) => {
		// eslint-disable-next-line no-undef
		wp.data.dispatch('kubio/edit-site').toggleGutentagDebug(value);
	};

	top.kubioStartTime = performance.now();
	addAction(
		'kubio.editor.page-changed',
		'kubio/editor/page-changed/restart-performance-timer',
		() => {
			top.kubioStartTime = performance.now();
		}
	);
}

export * from './components';
export { default as __experimentalFullscreenModeClose } from './components/header/fullscreen-mode-close';
export * from './hooks';
export * from './hooks/editor-hooks';
export * from './hooks/use-page-title';
export {
	STORE_KEY,
	registerEditSiteStore,
	registerSidebarArea,
	SidebarArea,
	SubSidebarArea,
	registerSubSidebarArea,
	Editor,
};


