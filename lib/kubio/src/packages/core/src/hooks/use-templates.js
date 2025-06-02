import { useSetGlobalSessionProp } from '@kubio/editor-data';
import { parse, serialize } from '@wordpress/blocks';
import { useDispatch, useRegistry, useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import _, { get, set } from 'lodash';
import { useKubioNotices } from '../notices';
import { TEMPLATE_STORE_NAME } from '../templates-store';
import {
	findBlockByName,
	getPostListAndEditsByType,
} from '../templates-store/utils';
import { getBlocksWithNewRefs } from '../utils';
import { getColibriData, useColibriDataHooks } from './data';

const useTemplateData = ( type ) => {
	const { storeData = {}, computedData = {} } = useSelect( ( select ) => {
		return select( TEMPLATE_STORE_NAME ).getTemplateData();
	}, [] );

	let {
		currentTemplate = null,
		editedTemplatesById = {},
		currentPage = {},
		postId,
		postType,
		templates,
	} = storeData;

	const {
		configPerType = {},
		defaultTemplatesByPostType = {},
		templateIsUsedOnMultiplePages = true,
		templateOptions = [],
		templateParsedContentById = {},
		templatePartDataByType = {},
	} = computedData;

	const {
		templatePartsOptions = [],
		templatePartIsUsedOnMultipleTemplates = true,
		templatePartIsFoundOnPage = true,
		templatePartBlocksByTemplateId = {},
	} = _.get( templatePartDataByType, type, {} );

	const pendingCreateTemplate = useRef( false );
	const pendingCreateTemplatePart = useRef( false );
	const hideOverlayRef = useRef();
	const setEditorReady = useSetGlobalSessionProp( 'ready' );

	const showOverlay = () => {
		clearTimeout( hideOverlayRef.current );
		setEditorReady( false );
	};

	//usually after the new template/ template part is created it still needs some time until the new part is created
	//so we give it some extra time to generate the content
	const hideOverlay = () => {
		clearTimeout( hideOverlayRef.current );
		hideOverlayRef.current = setTimeout( () => {
			setEditorReady( true );
		}, 3000 );
	};

	useEffect( () => {
		return () => {
			clearTimeout( hideOverlayRef.current );
		};
	}, [] );

	// eslint-disable-next-line no-restricted-syntax
	const [ , setDummyState ] = useState( Math.random() );

	const config = _.get( configPerType, type, {} );
	const typeLabel = _.get( config, 'label', 'Part' );
	const blockNameForCurrentType = _.get( config, 'blockName' );

	let currentTemplateId = _.get( currentTemplate, 'id' );
	let currentTemplateLabel = _.get( currentTemplate, 'title.rendered' );

	const currentTemplatePartSlug =
		getTemplatePartSlugByTemplateId( currentTemplateId );

	//if the current fse template does not have a kubio block like header/footer/sidebar it won't be found by getTemplatePartSlugByTemplateId
	if ( ! currentTemplatePartSlug ) {
		const fallbackTemplatesSlug = [ 'full-width', 'kubio-full-width' ];
		const fallbackTemplate = ( templates || [] ).find( ( template ) =>
			fallbackTemplatesSlug.includes( template.slug )
		);
		currentTemplate = fallbackTemplate;
		currentTemplateId = _.get( fallbackTemplate, 'id' );
		currentTemplateLabel = _.get( fallbackTemplate, 'title.rendered' );
	}

	const { editEntityRecord, saveEntityRecord } = useDispatch( 'core' );
	const registry = useRegistry();
	function refreshState() {
		// eslint-disable-next-line no-restricted-syntax
		setDummyState( Math.random() );
	}

	const { createErrorNotice, createSuccessNotice } = useKubioNotices();

	const getBlocksByTemplateId = ( templateId ) => {
		return _.get( templateParsedContentById, templateId, [] );
	};

	const hooksData = useColibriDataHooks();
	const { getBlocks } = useSelect( ( select ) => {
		return select( 'core/block-editor' );
	} );
	const { setPage } = useDispatch( 'kubio/edit-site' );
	const getCurrentTemplatePartDataHelper = () => {
		const blocks = getBlocks();

		const block = findBlockByName( blocks, blockNameForCurrentType );

		const clientId = block?.clientId;
		const dataHelper = getColibriData(
			{
				clientId,
				autoSave: true,
				loadColibriData: true,
			},
			hooksData
		);
		return dataHelper;
	};

	const onChangeTemplatePartSlugByTemplateId =
		( templateId ) => async ( newTemplatePartSlug ) => {
			const parsedBlocks = getBlocksByTemplateId( templateId );
			const templatePartBlock = findBlockByName(
				parsedBlocks,
				blockNameForCurrentType
			);
			_.set( templatePartBlock, 'attributes.slug', newTemplatePartSlug );
			if ( currentTemplateId === templateId ) {
				const currentTemplatePartDataHelper =
					getCurrentTemplatePartDataHelper();
				currentTemplatePartDataHelper.setAttribute(
					'slug',
					newTemplatePartSlug
				);
			}
			const serializedContent = serialize( parsedBlocks );
			try {
				await editEntityRecord( 'postType', 'wp_template', templateId, {
					content: serializedContent,
				} );

				createSuccessNotice( __( `Updated template`, 'kubio' ) );
			} catch ( e ) {
				createErrorNotice(
					__(
						'Could not update template. Please try again later',
						'kubio'
					)
				);
			}
		};
	function triggerError() {
		throw 'Error';
	}

	function getTemplatePartBlockByTemplateId(
		templateId = currentTemplateId
	) {
		return _.get( templatePartBlocksByTemplateId, templateId );
	}

	function getTemplatePartSlugByTemplateId( templateId = currentTemplateId ) {
		const templatePartBlock =
			getTemplatePartBlockByTemplateId( templateId );
		return _.get( templatePartBlock, 'attributes.slug' );
	}

	const refreshPage = async ( template, fseTemplate = true ) => {
		const { link } = currentPage;

		const updatedLink = addQueryArgs( link, { _: Date.now() } );

		await setPage(
			{
				path: updatedLink,
				context: {
					postType,
					postId,
				},
			},
			template,
			fseTemplate
		);
		hideOverlay();
	};

	const onNewTemplate = async ( templateName, options = {} ) => {
		try {
			if ( pendingCreateTemplate.current ) {
				return;
			}

			pendingCreateTemplate.current = true;
			showOverlay();
			let startingBlocks = [];

			const editedTemplate = _.get(
				editedTemplatesById,
				currentTemplateId
			);

			//if the template part we will duplicate has been edited we must load the edited data
			if ( editedTemplate ) {
				startingBlocks = getBlocksWithNewRefs( editedTemplate );

				//if the template part was not edited in the current session we will get the raw html and parsed it
			} else {
				const content = currentTemplate?.content?.raw
					? currentTemplate?.content?.raw
					: currentTemplate?.content;
				const parsedBlocks = parse( content );
				startingBlocks = getBlocksWithNewRefs( parsedBlocks );
			}

			const title = templateName;
			const templatePartTitle = `${ title }-${ type }`;
			const newTemplatePart = await onNewTemplatePart(
				templatePartTitle,
				{
					assignOnCreate: false,
					showLoader: false,
					...options,
				}
			);
			if ( ! newTemplatePart ) {
				triggerError();
			}
			const newSlug = _.get( newTemplatePart, 'slug' );
			const templatePart = findBlockByName(
				startingBlocks,
				blockNameForCurrentType
			);
			_.set( templatePart, [ 'attributes', 'slug' ], newSlug );

			const slug = `${ postType }-${ title }`;

			const record = {
				title,
				slug,
				kubio_template_source: 'kubio-custom',
				content: serialize( startingBlocks ),
			};

			const newTemplate = await saveEntityRecord(
				'postType',
				'wp_template',
				record
			);

			if ( ! newTemplate || ! newTemplate?.slug ) {
				triggerError();
			}

			await editEntityRecord( 'postType', postType, postId, {
				template: newTemplate?.slug,
			} );

			refreshPage( newTemplate );

			createSuccessNotice(
				__( `New template created successfully`, 'kubio' )
			);
			return newTemplate;
		} catch ( e ) {
			hideOverlay();
			createErrorNotice(
				__(
					`Could not create new template. Please try again later`,
					'kubio'
				)
			);
		} finally {
			pendingCreateTemplate.current = false;
		}
	};

	const defaultTemplatePartLabel = `${ currentTemplateLabel }-${ typeLabel }`;
	const onNewTemplatePart = async (
		templatePartName = defaultTemplatePartLabel,
		options = {}
	) => {
		try {
			if ( pendingCreateTemplatePart.current ) {
				return;
			}
			pendingCreateTemplatePart.current = true;
			showOverlay();

			const defaultOptions = {
				revertEditsOnOriginal: false,
				assignOnCreate: true,
				showLoader: true,
			};
			const mergedOptions = _.merge( {}, defaultOptions, options );
			const { assignOnCreate, revertEditsOnOriginal, showLoader } =
				mergedOptions;
			let startingBlocks = [];

			const templatePartSlug =
				getTemplatePartSlugByTemplateId( currentTemplateId );

			const templatePart = templatePartsOptions.find(
				( item ) => item.value === templatePartSlug
			);
			if ( ! templatePart ) {
				triggerError();
			}
			const templatePartId = _.get( templatePart, 'id' );
			const [ , editedTemplatePartsById ] =
				getPostListAndEditsByType( 'wp_template_part' );

			let editedTemplatePart = _.get(
				editedTemplatePartsById,
				templatePartId
			);
			if ( typeof editedTemplatePart === 'string' ) {
				editedTemplatePart = parse( editedTemplatePart );
			}
			//if the template part we will duplicate has been edited we must load the edited data
			if ( editedTemplatePart ) {
				startingBlocks = getBlocksWithNewRefs( editedTemplatePart );

				//if the template part was not edited in the current session we will get the raw html and parsed it
			} else {
				const content = templatePart?.content?.raw
					? templatePart?.content?.raw
					: templatePart?.content;
				const parsedBlocks = parse( content );
				startingBlocks = getBlocksWithNewRefs( parsedBlocks );
			}

			const title = templatePartName;

			const record = {
				title,
				slug: title,
				area: type,
				kubio_template_source: 'kubio-custom',
				content: serialize( startingBlocks ),
			};

			const newTemplatePart = await saveEntityRecord(
				'postType',
				'wp_template_part',
				record
			);
			if ( ! newTemplatePart ) {
				triggerError();
			}
			createSuccessNotice(
				sprintf(
					// translators: %s: template part type label
					__( `New %s created successfully`, 'kubio' ),
					typeLabel
				)
			);

			if ( assignOnCreate ) {
				const currentTemplatePartDataHelper =
					getCurrentTemplatePartDataHelper();
				currentTemplatePartDataHelper.setAttribute(
					'slug',
					newTemplatePart.slug
				);
			}

			if ( revertEditsOnOriginal ) {
				clearChangesOnTemplatePart( registry, templatePartId );
			}

			if ( showLoader ) {
				hideOverlay();
			}

			return newTemplatePart;
		} catch ( e ) {
			hideOverlay();
			createErrorNotice(
				sprintf(
					// translators: %s: type label
					__(
						'Could not create new %s. Please try again later',
						'kubio'
					),
					typeLabel
				)
			);
		} finally {
			pendingCreateTemplatePart.current = false;
			refreshState();
		}
	};

	async function assignTemplate( templateSlug, showNotifications = true ) {
		try {
			showOverlay();
			await editEntityRecord( 'postType', postType, postId, {
				template: templateSlug,
				// set a random meta value to ensure changes when the page is empty and the template is changed from automatically set full-width to default page template ('')
				meta: {
					[ `_random_unused_${ Date.now() }` ]: Date.now(),
				},
			} );

			//when you want to assign the default template
			if ( ! templateSlug ) {
				const defaultTemplate = _.get(
					defaultTemplatesByPostType,
					postType
				);
				if ( ! defaultTemplate ) {
					triggerError();
				}

				templateSlug = defaultTemplate;
			}
			const selectedOption = templateOptions.find(
				( template ) => template.templateSlug === templateSlug
			);
			if ( ! selectedOption ) {
				triggerError();
			}
			const templateData = {
				slug: selectedOption.templateSlug,
				id: selectedOption.value,
			};
			await refreshPage( templateData );
			if ( showNotifications ) {
				createSuccessNotice( __( 'Template assigned', 'kubio' ) );
			}
		} catch ( e ) {
			hideOverlay();
			if ( showNotifications ) {
				createErrorNotice(
					__(
						`Could not assign the template to the current page. Please try again later`,
						'kubio'
					)
				);
			}
		}
	}

	async function assignClassicTemplate( templateSlug ) {
		try {
			showOverlay();
			await editEntityRecord( 'postType', postType, postId, {
				template: templateSlug,
				// set a random meta value to ensure changes when the page is empty and the template is changed from automatically set full-width to default page template ('')
				meta: {
					[ `_random_unused_${ Date.now() }` ]: Date.now(),
				},
			} );

			await refreshPage( templateSlug, false );
			createSuccessNotice( __( 'Template assigned', 'kubio' ) );
		} catch ( e ) {
			createErrorNotice(
				__(
					`Could not assign the template to the current page. Please try again later`,
					'kubio'
				)
			);
			hideOverlay();
		}
	}

	return {
		currentTemplate,
		templateOptions,
		templatePartsOptions,
		config,
		templateIsUsedOnMultiplePages,
		templatePartIsUsedOnMultipleTemplates,
		templatePartIsFoundOnPage,
		postId,
		postType,

		getTemplatePartBlockByTemplateId,
		getTemplatePartSlugByTemplateId,
		onChangeTemplatePartSlugByTemplateId,

		onNewTemplate,
		onNewTemplatePart,
		refreshPage,
		assignTemplate,
		assignClassicTemplate,

		getCurrentTemplatePartDataHelper,

		showOverlay: false,
		// pendingCreateTemplate.current ||
		// pendingCreateTemplatePart.current ||
		// forceOverlay,
	};
};

//you can drag and drop components inside the header/footer and if the user uses the change for this page only
//we should keep the changes on the new header but discard on the old one.
function clearChangesOnTemplatePart( registry, templatePartId ) {
	const coreStore = registry?.stores?.core?.store;
	const dirtyEntities =
		registry?.stores?.core?.selectors?.__experimentalGetDirtyEntityRecords() ||
		[];

	const currentDirtyTemplatePart = dirtyEntities.find(
		( entity ) => entity.key === templatePartId
	);

	//check to see if the current template part is dirty. If it's not do nothing. But if it's dirty remove the changes
	if ( ! currentDirtyTemplatePart ) {
		return;
	}
	const { key, name, kind } = currentDirtyTemplatePart;
	coreStore.dispatch( {
		type: 'REMOVE_ITEMS',
		itemIds: [ key ],
		kind,
		name,
		invalidateCache: true,
	} );

	//to be backward compatible we will support both versions
	const getDataRoot = () => {
		//pre wp 6.0 entities were stored inside the data object. After wp 6.0 entities are stored inside the record object
		const dataRootPossibilities = [ 'data', 'records' ];
		return dataRootPossibilities.find( ( rootPath ) => {
			return get(
				coreStore.getState(),
				`entities.${ rootPath }.${ kind }.${ name }.edits.${ key }`
			);
		} );
	};

	const dataRoot = getDataRoot();

	set(
		coreStore.getState(),
		`entities.${ dataRoot }.${ kind }.${ name }.edits.${ key }`,
		{}
	);

	set(
		coreStore.getState(),
		`entities.${ dataRoot }.${ kind }.${ name }.saving.${ key }`,
		{}
	);
}
export { useTemplateData };
