import { controls } from '@wordpress/data';
import { apiFetch } from '@wordpress/data-controls';
import { addQueryArgs, getPathAndQueryString } from '@wordpress/url';
import { STORE_KEY } from '../store/constants';
const { select, dispatch } = controls;

/**
 * Returns an action object used to toggle a feature flag.
 *
 * @param {string} feature Feature name.
 * @return {Object} Action object.
 */
export function toggleFeature( feature ) {
	return {
		type: 'TOGGLE_FEATURE',
		feature,
	};
}

/**
 * Returns an action object used to toggle the width of the editing canvas.
 *
 * @param {string} deviceType
 * @return {Object} Action object.
 */
export function __experimentalSetPreviewDeviceType( deviceType ) {
	return {
		type: 'SET_PREVIEW_DEVICE_TYPE',
		deviceType,
	};
}

/**
 * Returns an action object used to set a template.
 *
 * @param {number}  templateId   The template ID.
 * @param {string}  templateSlug The template slug.
 * @param {boolean} resetPage    The template slug.
 * @return {Object} Action object.
 */
export function* setTemplate( templateId, templateSlug, resetPage = false ) {
	const pageContext = { templateSlug };
	if ( ! templateSlug ) {
		const template = yield controls.resolveSelect(
			'core',
			'getEntityRecord',
			'postType',
			'wp_template',
			templateId
		);
		pageContext.templateSlug = template?.slug;
	}
	return {
		type: 'SET_TEMPLATE',
		templateId,
		page: { context: resetPage ? {} : pageContext },
	};
}

/**
 * Adds a new template, and sets it as the current template.
 *
 * @param {Object} template The template.
 * @return {Object} Action object used to set the current template.
 */
export function* addTemplate( template ) {
	const newTemplate = yield controls.dispatch(
		'core',
		'saveEntityRecord',
		'postType',
		'wp_template',
		template
	);
	return {
		type: 'SET_TEMPLATE',
		templateId: newTemplate.id,
		page: { context: { templateSlug: newTemplate.slug } },
	};
}

/**
 * Removes a template, and updates the current page and template.
 *
 * @param {number} templateId The template ID.
 */
export function* removeTemplate( templateId ) {
	yield apiFetch( {
		path: `/wp/v2/templates/${ templateId }`,
		method: 'DELETE',
	} );
	const page = yield controls.select( STORE_KEY, 'getPage' );
	yield controls.dispatch( STORE_KEY, 'setPage', page );
}

/**
 * Returns an action object used to set a template part.
 *
 * @param {number} templatePartId The template part ID.
 * @return {Object} Action object.
 */
export function setTemplatePart( templatePartId ) {
	return {
		type: 'SET_TEMPLATE_PART',
		templatePartId,
	};
}

/**
 * Updates the homeTemplateId state with the templateId of the page resolved
 * from the given path.
 *
 * @param {number} homeTemplateId The template ID for the homepage.
 */
export function setHomeTemplateId( homeTemplateId ) {
	return {
		type: 'SET_HOME_TEMPLATE',
		homeTemplateId,
	};
}

/**
 * Resolves the template for a page and displays both. If no path is given, attempts
 * to use the postId to generate a path like `?p=${ postId }`.
 *
 * @param {Object} page         The page object.
 * @param {string} page.type    The page type.
 * @param {string} page.slug    The page slug.
 * @param {string} page.path    The page path.
 * @param {Object} page.context The page context.
 * @param          template
 * @param          templateType [FSE, classic]
 * @param          fseTemplate
 * @return {number} The resolved template ID for the page route.
 */
export function* setPage( page, template, fseTemplate = true ) {
	if ( page === null ) {
		return {
			type: 'SET_PAGE',
			page: null,
			templateId: null,
			changingPage: true,
		};
	}

	if ( ! page.path && page.context?.postId ) {
		const entity = yield controls.resolveSelect(
			'core',
			'getEntityRecord',
			'postType',
			page.context.postType || 'post',
			page.context.postId
		);

		page.path = getPathAndQueryString( entity.link );
	}
	if ( ! fseTemplate ) {
		yield {
			type: 'SET_PAGE_CONTENT',
			page,

			//if the template is '' we'll set the template as page
			classicTemplateId: template !== '' ? template : 'page.php',
		};

		return;
	}
	let templateForLink;
	if ( ! template && fseTemplate ) {
		const link = addQueryArgs( page.path, { _: Date.now() } );
		try {
			const templateForLinkResult = yield apiFetch( {
				url: addQueryArgs( link, { '_wp-find-template': true } ),
			} );
			templateForLink = templateForLinkResult?.data;
		} catch ( e ) {
			console.error( e );
		}

		if ( ! templateForLink ) {
			// yield {
			// 	type: 'SET_PAGE_CONTENT',
			// 	page,
			// };
			yield {
				type: 'SET_PAGE',
				page,
				templateId: null,
			};

			return;
		}
	}

	const templateSource = template ? template : templateForLink;

	const { id: templateId, slug: templateSlug } = templateSource;

	yield {
		type: 'SET_PAGE',
		page: ! templateSlug
			? page
			: {
					...page,
					context: {
						...page.context,
						templateSlug,
					},
			  },
		templateId,
	};
	return templateId;
}

/**
 * Displays the site homepage for editing in the editor.
 *
 * @param root0
 * @param root0.skipTemplate
 */
export function* showHomepage() {
	const { show_on_front: showOnFront, page_on_front: frontpageId } =
		yield controls.resolveSelect(
			'core',
			'getEntityRecord',
			'root',
			'site'
		);

	const { siteUrl } = yield controls.select( STORE_KEY, 'getSettings' );

	const page = {
		path: siteUrl,
		context:
			showOnFront === 'page'
				? {
						postType: 'page',
						postId: frontpageId,
				  }
				: {},
	};

	const homeTemplate = yield* setPage( page );
	if ( ! homeTemplate ) {
		return {
			type: 'GUTENTAG_NO_ACTION',
		};
	}
	yield setHomeTemplateId( homeTemplate );
}

/**
 * Opens the navigation panel and sets its active menu at the same time.
 *
 * @param {string} menu Identifies the menu to open.
 */
export function openNavigationPanelToMenu( menu ) {
	return {
		type: 'OPEN_NAVIGATION_PANEL_TO_MENU',
		menu,
	};
}

/**
 * Sets whether the navigation panel should be open.
 *
 * @param {boolean} isOpen If true, opens the nav panel. If false, closes it. It
 *                         does not toggle the state, but sets it directly.
 */
export function setIsNavigationPanelOpened( isOpen ) {
	return {
		type: 'SET_IS_NAVIGATION_PANEL_OPENED',
		isOpen,
	};
}

/**
 * Returns an action object used to update the settings.
 *
 * @param {Object} settings New settings.
 * @return {Object} Action object.
 */
export function updateSettings( settings ) {
	return {
		type: 'UPDATE_SETTINGS',
		settings,
	};
}

export function* openSidebar( name ) {
	return yield dispatch(
		'core/interface',
		'enableComplementaryArea',
		`${ STORE_KEY }/sidebars`,
		`${ STORE_KEY }/sidebar/${ name }`
	);
}

export function* openInserterSidebar() {
	return yield dispatch(
		'core/interface',
		'enableComplementaryArea',
		`${ STORE_KEY }/sidebars`,
		`${ STORE_KEY }/sidebar/block-inserter`
	);
}

export function* addSubSidebar( { areaIdentifier, sidebar } ) {
	return {
		type: 'ADD_SUBSIDEBAR',
		sidebar,
		areaIdentifier,
	};
}

export function* removeSubSidebar( { areaIdentifier } ) {
	return {
		type: 'REMOVE_SUBSIDEBAR',
		areaIdentifier,
	};
}

export function* closeSidebar() {
	yield dispatch(
		'core/interface',
		'disableComplementaryArea',
		`${ STORE_KEY }/sidebars`
	);
}

export function* toggleGlobalStyleEditing( value, previousEntity = null ) {
	return {
		type: 'TOGGLE_GLOBAL_STYLE_EDITING',
		value,
		previousEntity,
	};
}

export function* toggleGutentagDebug( value ) {
	return {
		type: 'TOGGLE_GUTENTAG_DEBUG',
		value,
	};
}

export function* setOpenInserter( value, rootClientId = false, options = {} ) {
	return {
		type: 'TOGGLE_IS_INSERTER_OPEN',
		value,
		rootClientId: ! rootClientId ? false : rootClientId,
		options: {
			closeOnSelect: false,
			replace: false,
			...options,
		},
	};
}

export function setCurrentAncestor( currentAncestor ) {
	return {
		type: 'SET_CURRENT_ANCESTOR',
		currentAncestor,
	};
}

/**
 * Sets whether the list view panel should be open.
 *
 * @param {boolean} isOpen If true, opens the list view. If false, closes it.
 *                         It does not toggle the state, but sets it directly.
 */
export function setIsListViewOpened( isOpen ) {
	return {
		type: 'SET_IS_LIST_VIEW_OPENED',
		isOpen,
	};
}

export function setUIVersion( version ) {
	return {
		type: 'UPDATE_UI_VERSION',
		version,
	};
}

/**
 * Added in kubio
 * Changes the editor mode
 *
 * @param  mode
 * @return {Object} Action object.
 */
export function setKubioEditorMode( mode ) {
	return {
		type: 'UPDATE_EDITOR_MODE',
		value: mode,
	};
}

/**
 * Added in kubio
 * Changes the editor mode
 *
 * @param  value
 * @return {Object} Action object.
 */
export function toggleAICapabilities( value ) {
	return {
		type: 'TOGGLE_AI_CAPABILITIES',
		value,
	};
}

export function updateAIInfo( value ) {
	return {
		type: 'UPDATE_AI_INFO',
		value,
	};
}

export function updateExcludedSectionCategories( value ) {
	return {
		type: 'UPDATE_EXCLUDED_SECTION_CATEGORIES',
		value,
	};
}

export function updateFlagSettings( { path, value } ) {
	return {
		type: 'UPDATE_FLAG_SETTINGS',
		path,
		value,
	};
}
