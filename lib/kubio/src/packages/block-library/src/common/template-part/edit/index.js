/**
 * WordPress dependencies
 */
import { BlockPlaceholder, SmallPlaceholder } from '@kubio/controls';
import { isKubioEditor, silentDispatch } from '@kubio/core';
import {
	store as blockEditorStore,
	useBlockProps,
	Warning,
	__experimentalUseNoRecursiveRenders as useNoRecursiveRenders,
} from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Button, Spinner } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import _, { first, intersection, isArray } from 'lodash';
import { TemplatePartAdvancedControls } from './advanced-controls';
import TemplatePartInnerBlocks from './inner-blocks';
/**
 * Internal dependencies
 */
import TemplatePartPlaceholder from './placeholder';

// set kubio-* parts first for 3rd party themes
// on supported themes the kubio-* templates will not exists
const defaultKubioTemplateParts = [
	'kubio-header',
	'kubio-footer',

	'kubio-blog-sidebar',
	'kubio-page-sidebar',

	'header',
	'footer',
	'sidebar',
];

export default function TemplatePartEdit({
	attributes,
	setAttributes,
	isSelected,
	clientId,
	innerBlocksProps,
	tagName: tagNameProp,
	blockArea = undefined,
	displayAppender = false,
}) {
	let { slug = null, theme = null, tagName, layout = {} } = attributes;

	const partsForAreaLoaded = useRef(false);
	const partsForArea = useSelect((select) => {
		if (partsForAreaLoaded.current) {
			return [];
		}

		const { getEntityRecords } = select('core');
		let parts = getEntityRecords('postType', 'wp_template_part', {
			per_page: -1,
		});

		parts = parts
			?.filter(({ area }) => area === blockArea)
			?.map(({ id }) => id.split('//').pop());
		return parts;
	}, []);

	tagName = tagNameProp || tagName;

	const templatePartId = theme && slug ? theme + '//' + slug : null;

	const currentTheme = useSelect(
		(select) => select('core').getCurrentTheme()?.stylesheet
	);
	/**
	 * make an educated guess for possible part to load
	 * or add the first available one
	 */
	useEffect(() => {
		if (isArray(partsForArea) && !slug) {
			partsForAreaLoaded.current = true;
			let nextSlug = first(
				intersection(defaultKubioTemplateParts, partsForArea)
			);

			if (!nextSlug) {
				nextSlug = first(partsForArea);
			}

			if (nextSlug) {
				silentDispatch(() => {
					setAttributes({ theme: currentTheme, slug: nextSlug });
				});
			}
		}
	}, [partsForArea, slug]);

	const blockTitle = useSelect(
		(select) =>
			select('core/blocks')?.getBlockType(
				select('core/block-editor')?.getBlock(clientId)?.name
			)?.title,
		[clientId]
	);

	// set the current stylesheet as theme if none is avaialble
	useEffect(() => {
		if (!theme && currentTheme) {
			silentDispatch(() => setAttributes({ theme: currentTheme }));
		}
	}, [theme, currentTheme]);

	const [hasAlreadyRendered, RecursionProvider] = useNoRecursiveRenders(
		templatePartId
	);

	const instanceId = useInstanceId(TemplatePartEdit);

	// Set the postId block attribute if it did not exist,
	// but wait until the inner blocks have loaded to allow
	// new edits to trigger this.
	const {
		isResolved,
		storeInnerBlocks,
		isMissing,
		defaultWrapper,
		content,
	} = useSelect(
		(select) => {
			const { getEditedEntityRecord, hasFinishedResolution } = select(
				coreStore
			);
			const { getBlocks } = select(blockEditorStore);

			const getEntityArgs = [
				'postType',
				'wp_template_part',
				templatePartId,
			];
			const entityRecord = templatePartId
				? getEditedEntityRecord(...getEntityArgs)
				: null;
			const hasResolvedEntity = templatePartId
				? hasFinishedResolution('getEditedEntityRecord', getEntityArgs)
				: false;

			const defaultWrapperElement = select(editorStore)
				.__experimentalGetDefaultTemplatePartAreas()
				.find(
					({ area }) =>
						area === (entityRecord?.area || attributes.area)
				)?.area_tag;

			return {
				storeInnerBlocks: getBlocks(clientId),
				content: entityRecord?.content || '',
				isResolved: hasResolvedEntity,
				isMissing: hasResolvedEntity && _.isEmpty(entityRecord),
				defaultWrapper: defaultWrapperElement || 'div',
			};
		},
		[templatePartId, clientId, instanceId]
	);

	const innerBlocks = useMemo(() => {
		if (storeInnerBlocks.length) {
			return storeInnerBlocks;
		}

		let parsedBlocks = [];
		try {
			parsedBlocks = parse(content || '');
		} catch (e) {
			parsedBlocks = [];
		}

		return parsedBlocks;
	}, [storeInnerBlocks, content]);

	const blockProps = useBlockProps();
	const isPlaceholder = !slug;
	const isEntityAvailable = !isPlaceholder && !isMissing && isResolved;
	const TagName = tagName || defaultWrapper;

	if (!isKubioEditor()) {
		const kubioEditorURL = window?.kubioUtilsData?.kubioEditorURL;
		return (
			<div {...blockProps}>
				<BlockPlaceholder
					title={
						// translators: %s - block title
						sprintf(__('Kubio %s block', 'kubio'), blockTitle)
					}
					description={__(
						'A Kubio template part content can be edited inside the Kubio Page Builder',
						'kubio'
					)}
				>
					{kubioEditorURL && (
						<Button
							isPrimary
							className={
								'button button-hero kubio-template-part-button--in-editor'
							}
							onClick={() => (window.location = kubioEditorURL)}
						>
							{__('Edit with Kubio', 'kubio')}
						</Button>
					)}
				</BlockPlaceholder>
			</div>
		);
	}

	// We don't want to render a missing state if we have any inner blocks.
	// A new template part is automatically created if we have any inner blocks but no entity.
	if (innerBlocks.length === 0 && ((slug && !theme) || (slug && isMissing))) {
		return (
			<TagName {...blockProps}>
				<SmallPlaceholder
					message={
						<p>
							{sprintf(
								/* translators: %s: Template part slug */
								__(
									'Template part has been deleted or is unavailable: %s',
									'kubio'
								),
								slug
							)}
						</p>
					}
				/>
			</TagName>
		);
	}

	if (isEntityAvailable && hasAlreadyRendered) {
		return (
			<TagName {...blockProps}>
				<Warning>
					{__('Block cannot be rendered inside itself.', 'kubio')}
				</Warning>
			</TagName>
		);
	}

	return (
		<RecursionProvider>
			{isSelected && (
				<TemplatePartAdvancedControls
					tagName={tagName}
					setAttributes={setAttributes}
					isEntityAvailable={isEntityAvailable}
					templatePartId={templatePartId}
					defaultWrapper={defaultWrapper}
				/>
			)}

			{isPlaceholder && (
				<TagName {...blockProps}>
					<TemplatePartPlaceholder
						area={attributes.area}
						clientId={clientId}
						setAttributes={setAttributes}
						blockArea={blockArea}
					/>
				</TagName>
			)}

			{isEntityAvailable && (
				<>
					<TemplatePartInnerBlocks
						tagName={TagName}
						blockProps={blockProps}
						postId={templatePartId}
						hasInnerBlocks={innerBlocks.length > 0}
						layout={layout}
						innerBlocksProps={innerBlocksProps}
						displayAppender={displayAppender}
						innerBlocks={innerBlocks}
					/>
				</>
			)}
			{!isPlaceholder && !isResolved && (
				<TagName {...blockProps}>
					<Spinner />
				</TagName>
			)}
		</RecursionProvider>
	);
}
