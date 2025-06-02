import { STORE_KEY as KUBIO_STORE_KEY } from '@kubio/constants';
import { parse } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import _ from 'lodash';
import { useDeepMemo } from '../hooks';
import {
	configPerType,
	coreKubioTemplatesSlugs,
	coreTemplateOrder,
	coreTemplatesSlugThatCanBeCopied,
	defaultTemplatesByPostType,
	templateLabels,
	templatePartLabels,
	templatePartsAreas,
} from './config';
import { TEMPLATE_STORE_NAME } from './constants';
import {
	findBlockByName,
	getPostData,
	getPostListAndEditsByType,
	isCoreTemplate,
	useTemplatePartLock,
} from './utils';

import { useGetGlobalSessionProp } from '@kubio/editor-data';
import isEqual from 'react-fast-compare';
import { reactRender } from '../common';

const TemplateStoreInit = () => {
	useSyncTemplateStore();
	return <></>;
};

const TemplateStoreSyncComponent = () => {
	const isEditorReady = useGetGlobalSessionProp( 'ready', false );
	const [ started, setStarted ] = useState( false );

	useEffect( () => {
		if ( isEditorReady ) {
			window.requestIdleCallback( () => {
				setStarted( true );
			} );
		}
	}, [ isEditorReady ] );

	if ( started ) {
		return <TemplateStoreInit />;
	}
	return <></>;
};

const useSyncTemplateStore = () => {
	const { updateTemplateData } = useDispatch( TEMPLATE_STORE_NAME );

	const storeData = useStoreData();
	const {
		siteUrl = '',
		currentPage = {},
		postId,
		postType,
		currentTemplate = null,
		templateParts = [],
		templates = [],
		rawEditedTemplatesById = {},
	} = storeData;

	//rawEditedTemplatesById may contain content that is no parsed. The getEntityRecordEdits returned only the parsed blocks
	//But now some templates return the parsed blocks some return the unparsed content. We handle both cases
	const editedTemplatesById = useDeepMemo( () => {
		const editedTemplatesById = {};
		_.each( rawEditedTemplatesById, ( content, templateId ) => {
			let parsedContent;
			if ( typeof content === 'string' ) {
				parsedContent = parse( content );
			} else {
				parsedContent = content;
			}
			_.set( editedTemplatesById, templateId, parsedContent );
		} );

		return editedTemplatesById;
	}, [ rawEditedTemplatesById ] );

	const currentTemplateSlug = _.get( currentTemplate, 'slug' );
	//load static data that does not change in editor like posts and page list only at the begining to increase aplication
	//performance. When you fix the page settings you'll also need to load edited pages/posts to get actual templates set
	//on pages
	const {
		currentTemplatePagesByPostType = {},
		pages,
		posts,
	} = useMemo( () => {
		return getStaticStoreData( currentTemplateSlug );
	}, [ postId, currentTemplateSlug ] );

	const currentPageUrl = useMemo( () => {
		try {
			const currentPageUrl = new URL( `${ siteUrl }/wp-admin/admin.php` );
			const params = currentPageUrl.searchParams;
			params.append( 'page', 'kubio' );
			params.append( 'postId', postId );
			params.append( 'postType', postType );
			return currentPageUrl.toString();
		} catch ( e ) {
			return '#';
		}
	}, [ siteUrl, postId, postType ] );
	const contentLoaded = pages.length > 0 || posts.length > 0;
	const templateIsUsedOnMultiplePages = useDeepMemo( () => {
		if ( ! postType ) {
			return true;
		}
		//for posts we say the template is only used on this page so we don't create a new template just a new template part
		if ( postType !== 'page' ) {
			return false;
		}

		//while the content loads assume the template is used on multiple pages.
		if ( ! contentLoaded ) {
			return true;
		}

		let numberOfUses = 0;
		_.each( currentTemplatePagesByPostType, ( pages = [] ) => {
			numberOfUses += pages.length;
		} );

		//There are two types of templates: system templates a page when it loads based on the templates that the theme
		//supports index/page/front page will be assigned one of these templates. Then there are user defined templates.
		//At the moment only two system templates supports overwrite using user defined templates(page and post). If a page
		//or post has a template assigned to the database post in the template column then when the page/post system template
		//loads it looks for user defined templates assigned if it has then it will load that one instead.

		//When we look for template that is used using the numberOfUses variable we look for user defined templates,
		//a system template is not assigned per post. Because of that we check if the page is post or page or if the template
		//is used on multiple pages. If the current template passes one of the requirements than we must create a new template
		//otherwise we must use the same template and replace the template part if it's used on multiple templates
		//or directly unlock the template part if it's used only on this page.
		const templateIsUsedOnMultiplePages =
			numberOfUses > 1 ||
			coreTemplatesSlugThatCanBeCopied.includes( currentTemplateSlug ) ||
			coreKubioTemplatesSlugs.includes( currentTemplateSlug );

		//if this value is true then we must create a new template
		return templateIsUsedOnMultiplePages;
	}, [
		postType,
		currentTemplate,
		coreTemplatesSlugThatCanBeCopied,
		currentTemplatePagesByPostType,
		contentLoaded,
		currentTemplateSlug,
	] );

	const templateOptions = useDeepMemo( () => {
		const templatesOptions = templates.map( ( template ) => {
			//the template names has this structure kubio//single. Where kubio is the theme name
			const templateId = template?.id || '';
			const templateSlug = template?.slug;
			let label = _.get( template, 'title.rendered' );
			label = _.get( templateLabels, templateSlug, label );
			const isCurrentTemplate =
				_.get( currentTemplate, 'id' ) === templateId;
			if ( isCurrentTemplate ) {
				label = `${ label } (Current page)`;
			}

			return {
				label,
				value: templateId,
				current: isCurrentTemplate,
				templateSlug,
				isCoreTemplate: isCoreTemplate( templateSlug ),
			};
		} );
		let orderedTemplateOptions = [];
		coreTemplateOrder.forEach( ( orederedTemplateId ) => {
			const removed = _.remove( templatesOptions, ( item ) => {
				return item.templateSlug === orederedTemplateId;
			} );
			orderedTemplateOptions = orderedTemplateOptions.concat( removed );
		} );

		orderedTemplateOptions =
			orderedTemplateOptions.concat( templatesOptions );

		//move the current item to the first position
		let currentItem = null;
		orderedTemplateOptions = orderedTemplateOptions.filter( ( item ) => {
			if ( item?.current ) {
				currentItem = item;
			}
			return ! item?.current;
		} );
		if ( currentItem ) {
			orderedTemplateOptions.unshift( currentItem );
		}

		return orderedTemplateOptions;
	}, [ currentTemplate, templates ] );

	const templateParsedContentById = useDeepMemo( () => {
		const result = {};
		templates.forEach( ( template ) => {
			const editedTemplate = _.get( editedTemplatesById, template.id );
			let parsedContent = null;
			if ( editedTemplate ) {
				parsedContent = editedTemplate;
			} else {
				const content = _.get( template, 'content.raw' );
				parsedContent = parse( content );
			}

			_.set( result, template.id, parsedContent );
		} );

		return result;
	}, [ templates, editedTemplatesById ] );

	const templatePartData = {
		templateParsedContentById,
		templateParts,
		templates,
		editedTemplatesById,
		currentTemplate,
	};

	const templatePartDataByType = {};
	templatePartsAreas.forEach( ( part ) => {
		const data = useTemplatePartData( templatePartData, part );
		_.set( templatePartDataByType, part, data );
	} );

	const data = useDeepMemo( () => {
		return {
			storeData: {
				currentTemplate,
				postId,
				postType,
				currentPage,
				editedTemplatesById,
				templates,
			},
			computedData: {
				configPerType,
				defaultTemplatesByPostType,
				currentPageUrl,
				templateIsUsedOnMultiplePages,
				templateOptions,
				templateParsedContentById,
				templatePartDataByType,
			},
		};
	}, [
		currentTemplate,
		postId,
		postType,
		currentPage,
		editedTemplatesById,
		templates,
		configPerType,
		defaultTemplatesByPostType,
		currentPageUrl,
		templateIsUsedOnMultiplePages,
		templateOptions,
		templateParsedContentById,
		templatePartDataByType,
	] );
	const lockStatusData = {
		currentTemplate,
		templatePartDataByType,
		templateIsUsedOnMultiplePages,
		postId,
	};

	templatePartsAreas.forEach( ( part ) => {
		useManageLockStatus( lockStatusData, part );
	} );

	useEffect( () => {
		updateTemplateData( data );
	}, [ data ] );
};

function useManageLockStatus( data, templatePartArea ) {
	const {
		templatePartDataByType,
		templateIsUsedOnMultiplePages,
		postId,
		currentTemplate,
	} = data;
	const currentTemplateId = _.get( currentTemplate, 'id' );
	const templatePartIsUsedOnMultipleTemplates = _.get(
		templatePartDataByType,
		[ templatePartArea, 'templatePartIsUsedOnMultipleTemplates' ]
	);
	const [ templatePartIsNew, setTemplatePartIsNew ] = useState( false );
	const currentTemplatePartHasContent = !! _.get( templatePartDataByType, [
		templatePartArea,
		'currentTemplatePartHasContent',
	] );

	//reset new flag when page changes
	useEffect( () => {
		if ( templatePartIsNew ) {
			setTemplatePartIsNew( false );
		}
	}, [ postId ] );

	//check if the template part is new for the current page. New template parts are unlocked by default
	useEffect( () => {
		if ( ! currentTemplateId ) {
			return;
		}
		const isNew =
			currentTemplateId && currentTemplatePartHasContent === false;

		if ( isNew && isNew !== templatePartIsNew ) {
			setTemplatePartIsNew( isNew );
		}
	}, [ currentTemplatePartHasContent, currentTemplateId ] );

	const { isUnlocked, unlock, lock } =
		useTemplatePartLock( templatePartArea );
	const isLocked = ! isUnlocked;

	useEffect( () => {
		//we wait until the postId data is loaded until we start running the lock/unloc logic.
		if ( ! postId ) {
			return;
		}

		//new template parts are unlocked. Except for the sidebar because of cases like this: https://mantis.iconvert.pro/view.php?id=51488
		if ( templatePartIsNew && templatePartArea !== 'sidebar' ) {
			unlock();
			return;
		}
		//if the template is used on multiple pages, then a new template is needed
		if ( templateIsUsedOnMultiplePages && isUnlocked ) {
			lock();
			return;
		}
		if ( templateIsUsedOnMultiplePages && isLocked ) {
			return;
		}
		if ( ! templatePartIsUsedOnMultipleTemplates && isLocked ) {
			unlock();
		}
		if ( templatePartIsUsedOnMultipleTemplates && isUnlocked ) {
			lock();
		}
	}, [
		templatePartIsNew,
		templatePartIsUsedOnMultipleTemplates,
		templateIsUsedOnMultiplePages,
		postId,
		currentTemplateId,
	] );
}

function getStaticStoreData( currentTemplateSlug ) {
	function getPagesForCurrentTemplate( pages ) {
		return pages.filter( ( page ) => {
			const pageTemplateSlug = _.get( page, 'template' );
			return currentTemplateSlug === pageTemplateSlug;
		} );
	}

	const pages = getPostData( 'page' );
	const posts = getPostData( 'post' );

	const pagesForCurrentTemplate = getPagesForCurrentTemplate( pages );
	const postsForCurrentTemplate = getPagesForCurrentTemplate( posts );
	const currentTemplatePagesByPostType = {
		page: pagesForCurrentTemplate,
		post: postsForCurrentTemplate,
	};

	return {
		pages,
		posts,
		currentTemplatePagesByPostType,
	};
}

function useStoreData() {
	const previousData = useRef( {} );
	return useSelect( ( select ) => {
		try {
			const {
				getTemplateId = _.noop,
				getPage = _.noop,
				getSettings,
			} = select( KUBIO_STORE_KEY );
			let currentPage = getPage();

			const context = _.get( currentPage, 'context', {} );
			let { postId, postType } = context;
			let currentTemplateId = getTemplateId();

			//in case your viewing a template
			if ( ! postId && currentTemplateId ) {
				postId = currentTemplateId;
				postType = 'wp_template';
				currentPage = window.structuredClone( currentPage );
				_.set(
					currentPage,
					[ 'context', 'postId' ],
					currentTemplateId
				);
			}

			const post = select( 'core' ).getEntityRecord(
				'postType',
				postType,
				postId
			);
			const postSlug = _.get( post, 'slug' );
			const postLink = _.get( post, 'link' );
			_.set( currentPage, 'slug', postSlug );
			_.set( currentPage, 'link', postLink );

			const templateParts = getPostData( 'wp_template_part', select );
			const [ templates, rawEditedTemplatesById ] =
				getPostListAndEditsByType( 'wp_template', select );

			let currentTemplate = templates.find( ( template ) => {
				return template.id === currentTemplateId;
			} );

			//if we don't have a FSE template assigned we assume the current template is kubio full width for the logic that
			//creates new templates / template parts to start from the full width template.
			if ( ! currentTemplate && templates.length > 0 ) {
				currentTemplate = templates.find( ( template ) =>
					[ 'full-width', 'kubio-full-width' ].includes(
						template?.slug
					)
				);
				currentTemplateId = _.get( currentTemplate, 'id' );
			}

			const { siteUrl } = getSettings();

			const response = {
				siteUrl,
				postId,
				postType,
				currentPage,
				currentTemplate,
				templateParts,
				templates,
				rawEditedTemplatesById,
			};

			if ( ! isEqual( previousData.current, response ) ) {
				previousData.current = response;
			}

			return previousData.current;
		} catch ( e ) {
			return {};
		}
	} );
}

function useTemplatePartData( data, type ) {
	const {
		templateParsedContentById,
		templateParts = [],
		templates = [],
		editedTemplatesById = {},
		currentTemplate,
	} = data;
	const currentTemplateId = _.get( currentTemplate, 'id' );
	const config = _.get( configPerType, type, {} );
	const blockNameForCurrentType = _.get( config, 'blockName' );
	const { currentTheme } = useSelect( ( select ) => {
		return {
			currentTheme: select( 'core' )?.getCurrentTheme(),
		};
	} );
	const stylesheet = currentTheme?.stylesheet;

	const usedTemplatePartsForType = useDeepMemo( () => {
		const blocksOfType = [];
		_.each( templateParsedContentById, ( blocks, id ) => {
			const currentBlockOfType = findBlockByName(
				blocks,
				blockNameForCurrentType
			);

			if ( currentBlockOfType ) {
				blocksOfType.push( currentBlockOfType );
			}
		} );
		return blocksOfType;
	}, [ templates, editedTemplatesById, templateParsedContentById, type ] );

	const templatePartsOptions = useDeepMemo( () => {
		const templatePartsByTheme = _.groupBy( templateParts, 'theme' );
		const currentThemeTemplateParts = _.get(
			templatePartsByTheme,
			stylesheet,
			[]
		);
		const usedSlugs = _.uniq(
			usedTemplatePartsForType.map( ( item ) => {
				return _.get( item, 'attributes.slug' );
			} )
		);
		const partsOfType = currentThemeTemplateParts.filter(
			( templatePart ) => {
				return templatePart.area === type;
			}
		);
		return partsOfType.map( ( templatePart ) => {
			let label = _.get( templatePart, 'title.rendered' );
			label = _.get( templatePartLabels, templatePart.slug, label );
			return {
				label,
				value: templatePart.slug,
				id: templatePart.id,
				content: templatePart.content.raw,
				showDelete: ! usedSlugs.includes( templatePart.slug ),
			};
		} );
	}, [ templateParts, usedTemplatePartsForType, stylesheet ] );

	const currentTemplatePart = useDeepMemo( () => {
		const currentTemplateBlocks = _.get(
			templateParsedContentById,
			currentTemplateId,
			[]
		);
		return findBlockByName(
			currentTemplateBlocks,
			blockNameForCurrentType
		);
	}, [
		templateParsedContentById,
		currentTemplateId,
		blockNameForCurrentType,
	] );

	const templatePartIsFoundOnPage = useMemo( () => {
		return !! currentTemplatePart;
	}, [ currentTemplatePart ] );

	const templatePartIsUsedOnMultipleTemplates = useDeepMemo( () => {
		if ( ! currentTemplatePart ) {
			return undefined;
		}

		const currentTemplatePartSlug = _.get(
			currentTemplatePart,
			'attributes.slug'
		);

		let numberOfUsesOfCurrentTemplatePart = 0;

		usedTemplatePartsForType.forEach( ( templatePart ) => {
			const slug = _.get( templatePart, 'attributes.slug' );
			if ( slug === currentTemplatePartSlug ) {
				numberOfUsesOfCurrentTemplatePart++;
			}
		} );
		const templatePartIsUsedOnMultipleTemplates =
			numberOfUsesOfCurrentTemplatePart > 1;
		return templatePartIsUsedOnMultipleTemplates;
	}, [
		templateParsedContentById,
		currentTemplatePart,
		usedTemplatePartsForType,
	] );

	const templatePartBlocksByTemplateId = useDeepMemo( () => {
		const data = {};
		_.each( templateParsedContentById, ( parsedBlocks, templateId ) => {
			const templatePartBlock = findBlockByName(
				parsedBlocks,
				blockNameForCurrentType
			);
			_.set( data, templateId, templatePartBlock );
		} );
		return data;
	}, [ templateParsedContentById, blockNameForCurrentType ] );

	const currentTemplatePartHasContent = useDeepMemo( () => {
		const currenteTemplatePart = _.get(
			templatePartBlocksByTemplateId,
			currentTemplate?.id
		);
		const slugId = _.get( currenteTemplatePart, [ 'attributes', 'slug' ] );
		return !! slugId;
	}, [ templatePartBlocksByTemplateId, currentTemplate ] );

	return {
		templatePartIsFoundOnPage,
		currentTemplatePartHasContent,
		templatePartsOptions,
		templatePartIsUsedOnMultipleTemplates,
		templatePartBlocksByTemplateId,
	};
}

const startSync = () => {
	const container = document.createElement( 'div' );
	reactRender( <TemplateStoreSyncComponent />, container );
};

export { startSync };
