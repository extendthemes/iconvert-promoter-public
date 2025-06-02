import { __, sprintf } from '@wordpress/i18n';
import _ from 'lodash';
import { useRef, useEffect, useState, useMemo } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { getPathAndQueryString } from '@wordpress/url';
import { parse, serialize } from '@wordpress/blocks';
import { APPLY_TEMPLATE_ON_VALUES } from './config';
import { getUnlinkedBlocks, findBlockByName, useKubioNotices } from './utils';
import { useSetGlobalSessionProp } from '@kubio/editor-data';

const TEMPLATE_STORE_NAME = 'kubio/templates';

function useTemplate( { type, innerBlocks, applyTemplateOn } ) {
	const { storeData = {}, computedData = {} } = useSelect( ( select ) => {
		return select( TEMPLATE_STORE_NAME ).getTemplateData();
	}, [] );
	const { currentPage = {}, postId, postType, templates } = storeData;

	const { configPerType = {} } = computedData;

	const { pageTitle, isFrontPage, getEntityRecords } = useSelect(
		( select ) => {
			const { getEntityRecord, getEntityRecords, getEditedEntityRecord } =
				select( 'core' );

			const record = getEntityRecord( 'postType', postType, postId );
			const pageTitle = record?.title?.raw;

			const siteData = getEditedEntityRecord( 'root', 'site' );
			const frontPageId = siteData?.page_on_front;
			const isFrontPage = frontPageId == postId;

			return { pageTitle, isFrontPage, getEntityRecords };
		}
	);
	const pendingCreateTemplate = useRef( false );
	const pendingCreateTemplatePart = useRef( false );
	const fullWidthTemplates = [ 'kubio-full-width', 'full-width' ];
	const currentTemplate = useMemo( () => {
		const fullWidthTemplate = templates.find( ( template ) =>
			fullWidthTemplates.includes( template.slug )
		);

		return fullWidthTemplate;
	}, [ JSON.stringify( templates ) ] );
	const config = _.get( configPerType, type, {} );
	const typeLabel = _.get( config, 'label', 'Part' );

	const blockNameForCurrentType = _.get( config, 'blockName' );
	const { editEntityRecord, saveEntityRecord, saveEditedEntityRecord } =
		useDispatch( 'core' );

	const { setPage } = useDispatch( 'kubio/edit-site' );

	const { createErrorNotice, createSuccessNotice } = useKubioNotices();

	function triggerError() {
		throw 'Error';
	}
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

	const refreshPage = async ( template ) => {
		const { link } = currentPage;
		let updatedLink;
		try {
			const currentPageUrl = new URL( link );
			const params = currentPageUrl.searchParams;
			params.append( 'random', Math.random() );

			//the setPage function caches the request that gets the page template. It uses the link as a key to determine
			//what template to load. Because we can change the template on the same sesion we need to add a cache busting
			//query string to load the template at every request
			const linkWithCacheBuster = currentPageUrl.toString();
			updatedLink = getPathAndQueryString( linkWithCacheBuster );
		} catch ( e ) {
		} finally {
			hideOverlay();
		}

		await setPage(
			{
				path: updatedLink,
				context: {
					postType,
					postId,
				},
			},
			template
		);
	};

	async function onNewTemplatePart() {
		try {
			if ( pendingCreateTemplatePart.current ) {
				return;
			}
			pendingCreateTemplatePart.current = true;
			const title = `${ pageTitle } ${ type }`;

			const record = {
				title,
				slug: title,
				area: type,
				kubio_template_source: 'kubio-custom',
				content: serialize( innerBlocks ),
			};

			const newTemplatePart = await saveEntityRecord(
				'postType',
				'wp_template_part',
				record
			);

			return newTemplatePart;
		} catch ( e ) {
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
		}
	}
	const onNewTemplate = async (
		templateName = `${ pageTitle } template`
	) => {
		try {
			if ( pendingCreateTemplate.current ) {
				return;
			}

			let pageExists;
			pendingCreateTemplate.current = true;
			showOverlay();
			const parsedBlocks = parse( currentTemplate?.content?.raw );
			const startingBlocks = getUnlinkedBlocks( parsedBlocks );
			const recordExtraData = {};
			let title;
			let slug;
			let isCustomTemplate;
			if ( isFrontPage ) {
				isCustomTemplate = false;
				title = __( 'Front Page', 'kubio' );
				slug = 'front-page';
				recordExtraData.kubio_template_source = 'kubio';
				//if the template should apply to all pages create the page template
			} else if (
				applyTemplateOn === APPLY_TEMPLATE_ON_VALUES.ALL_PAGES
			) {
				//get the entities using a random query argument to cache bust. When going from non fse to fse i noticed
				//the old data was being loaded.
				const templates = getEntityRecords( 'postType', 'wp_template', {
					per_page: -1,
				} );
				const pageTemplate = templates.find(
					( template ) => template.slug === 'page'
				);
				if ( pageTemplate ) {
					return updatePageTemplate( pageTemplate );
				}
				isCustomTemplate = false;
				title = 'Page';
				slug = 'page';
				recordExtraData.kubio_template_source = 'kubio';
			} else {
				isCustomTemplate = true;
				title = templateName;
				slug = `${ postType }-${ title }`;
			}
			const templatePartTitle = `${ title }-${ type }`;
			const newTemplatePart =
				await onNewTemplatePart( templatePartTitle );
			if ( ! newTemplatePart ) {
				triggerError();
			}
			const newSlug = _.get( newTemplatePart, 'slug' );
			const templatePart = findBlockByName(
				startingBlocks,
				blockNameForCurrentType
			);
			_.set( templatePart, [ 'attributes', 'slug' ], newSlug );

			if ( isCustomTemplate ) {
				recordExtraData.kubio_template_source = 'kubio-custom';
			}
			const record = {
				title,
				slug,
				content: serialize( startingBlocks ),
				...recordExtraData,
			};

			const newTemplate = await saveEntityRecord(
				'postType',
				'wp_template',
				record
			);

			if ( ! newTemplate || ! newTemplate?.slug ) {
				triggerError();
			}

			if (
				! isFrontPage &&
				applyTemplateOn !== APPLY_TEMPLATE_ON_VALUES.ALL_PAGES
			) {
				const edit = await editEntityRecord(
					'postType',
					postType,
					postId,
					{
						template: newTemplate?.slug,
					}
				);
			}

			await refreshPage( newTemplate );

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

	//if the Kubio page template already exists and the user want to affect all the pages we only update the template part content
	//and assign the page template tu the current page
	async function updatePageTemplate( pageTemplate ) {
		const parsedBlocks = parse( pageTemplate?.content?.raw );
		const startingBlocks = getUnlinkedBlocks( parsedBlocks );
		const templatePart = findBlockByName(
			startingBlocks,
			blockNameForCurrentType
		);

		const slug = _.get( templatePart, [ 'attributes', 'slug' ] );
		const theme = _.get( templatePart, [ 'attributes', 'theme' ] );
		const templatePartId = `${ theme }//${ slug }`;
		const templatePartChanges = {
			content: serialize( innerBlocks ),
		};
		const templatePartEdit = await editEntityRecord(
			'postType',
			'wp_template_part',
			templatePartId,
			templatePartChanges
		);

		await saveEditedEntityRecord(
			'postType',
			'wp_template_part',
			templatePartId
		);

		//because we want the page to use the page template we remove any template assigned to it
		const pageEdit = await editEntityRecord( 'postType', postType, postId, {
			template: '',
		} );

		await refreshPage( pageTemplate );
		return true;
	}

	return {
		onNewTemplate,
		pageTitle,
		isFrontPage,
	};
}

export { useTemplate };
