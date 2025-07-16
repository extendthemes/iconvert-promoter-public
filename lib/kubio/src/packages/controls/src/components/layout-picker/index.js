import _ from 'lodash';
import classNames from 'classnames';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useEntityBlockEditor } from '@wordpress/core-data';
import { createBlock, parse } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseDropZone as useDropZone,
	compose,
	createHigherOrderComponent,
	pure,
} from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import {
	createBlockWithDataHelper,
	asyncSilentDispatch,
	isKubioEditor,
} from '@kubio/core';
import { STORE_KEY } from '@kubio/constants';
import { columnWidth } from '@kubio/style-manager';
import { slugify } from '@kubio/utils';
import { useEffectAsync } from '@kubio/core-hooks';
import { TemplatesList, HeroTemplatesList } from './templates-list';

const { ColumnWidthTypes } = columnWidth;

const getPercentageColumn = (percentage) => {
	return {
		type: ColumnWidthTypes.CUSTOM,
		custom: {
			value: percentage,
			unit: '%',
		},
	};
};

const useLayoutSelect = (
	sectionName = __('Section', 'kubio'),
	replaceBlockInsteadInsert = false
) => {
	const { insertBlock, replaceInnerBlocks } = useDispatch(
		'core/block-editor'
	);

	const { getBlockOrder, getClientIdsWithDescendants, getBlock } = useSelect(
		(select) => ({
			getBlockOrder: select('core/block-editor').getBlockOrder,
			getClientIdsWithDescendants: select('core/block-editor')
				.getClientIdsWithDescendants,
			getBlock: select('core/block-editor').getBlock,
		})
	);

	const getNextSectionNameAndId = (nameRoot) => {
		const currentIds = getClientIdsWithDescendants()
			.map((id) => getBlock(id)?.attributes?.anchor)
			.filter(Boolean);

		const currentIdRoot = slugify(nameRoot);
		let currentSuffixIndex = 0;
		let currentSuffix = '';

		while (currentIds.indexOf(`${currentIdRoot}${currentSuffix}`) !== -1) {
			currentSuffixIndex++;
			currentSuffix = `-${currentSuffixIndex}`;
		}

		return {
			name: currentSuffixIndex
				? `${nameRoot} ${currentSuffixIndex}`
				: nameRoot,
			anchor: `${currentIdRoot}${currentSuffix}`,
		};
	};

	return (clientId, columns, columnsContents = []) => {
		const { anchor, name } = getNextSectionNameAndId(sectionName);

		const row = createBlockWithDataHelper(
			'kubio/row',
			(blockDataHelper) => {
				blockDataHelper.setProp('layout', {
					itemsPerRow: columns.length,
					custom: columns,
					equalHeight: true,
					equalWidth: false,
				});
			}
		);

		row.innerBlocks = [];
		for (const colObj of columns) {
			const column = createBlockWithDataHelper(
				'kubio/column',
				(blockDataHelper) => {
					blockDataHelper.setLocalStyle('columnWidth', colObj, {
						styledComponent: 'container',
					});
				}
			);
			column.innerBlocks = columnsContents[columns.indexOf(colObj)] || [];
			row.innerBlocks.push(column);
		}

		const newBlock = createBlock('kubio/section', {
			anchor,
			attrs: {
				name,
			},
		});

		newBlock.innerBlocks = [row];

		if (!replaceBlockInsteadInsert) {
			insertBlock(
				newBlock,
				getBlockOrder(clientId).length,
				clientId,
				true
			);
		} else {
			replaceInnerBlocks(clientId, [row], true);
		}
	};
};

const LayoutStructuresContainer = (props) => {
	const {
		clientId,
		insertLayout,
		replaceBlockInsteadInsert,
		defaultDisplayStructure = false,
	} = props;

	const { getBlockName } = useSelect(blockEditorStore);
	const [displayStructures, setDisplayStructures] = useState(
		defaultDisplayStructure
	);
	const isHero = getBlockName(clientId) === 'kubio/hero';
	const isSection = getBlockName(clientId) === 'kubio/section';

	const { setOpenInserter: postSetOpenInserter } =
		useDispatch('core/edit-post') || {};

	const title = isHero
		? __('Select Hero layout', 'kubio')
		: __('Select section layout', 'kubio');
	const addBlankLabel =
		isHero || isSection
			? __('Select section layout', 'kubio')
			: __('Add blank section', 'kubio');
	const addSectionLabel =
		isHero || isSection
			? __('Change with a predesigned section', 'kubio')
			: __('Add predesigned section', 'kubio');
	let { setOpenInserter } = useDispatch(STORE_KEY) || {
		setOpenInserter: postSetOpenInserter,
	};

	if (!setOpenInserter) {
		setOpenInserter = postSetOpenInserter;
	}

	const onLayoutSelect = (columns) => {
		setDisplayStructures(false);
		insertLayout(clientId, columns);
	};

	const rowClassName = isHero
		? 'structures-list is-hero'
		: 'structures-list h-row';

	const layoutStructuresRef = useRef(null);
	const [toggleLayoutStructure, setToggleLayoutStructure] = useState(false);
	const [dummyState, setDummyState] = useState();
	const scrollToLayoutStructures = () => {
		const layoutStructuresElem = layoutStructuresRef?.current.parentNode;
		const sectionElem = layoutStructuresElem.parentNode;

		sectionElem.scrollIntoView({
			block: 'center',
			behavior: 'smooth',
		});
	};

	const isDefaultEditor = !isKubioEditor();

	useEffect(() => {
		if (!layoutStructuresRef?.current || !toggleLayoutStructure) {
			return;
		}
		scrollToLayoutStructures();
	}, [layoutStructuresRef?.current]);

	useEffect(() => {
		if (toggleLayoutStructure) {
			setDummyState(Date.now());
		}
	}, [toggleLayoutStructure]);

	if (isDefaultEditor || displayStructures) {
		const hideCloseClass = isDefaultEditor
			? ' layout-structures--hide-close'
			: '';

		return (
			<div
				ref={layoutStructuresRef}
				className={
					'layout-structures d-flex flex-column' + hideCloseClass
				}
			>
				<span className="layout-structures-title">{title}</span>
				<span className={rowClassName}>
					{isHero ? (
						<HeroTemplatesList
							clientId={clientId}
							onLayoutSelect={onLayoutSelect}
						/>
					) : (
						<TemplatesList onLayoutSelect={onLayoutSelect} />
					)}
				</span>
				{!isHero && (
					<span
						className="layout-structures-close-button"
						onClick={() => {
							setDisplayStructures(false);
							setToggleLayoutStructure(false);
						}}
					>
						×
					</span>
				)}
			</div>
		);
	}

	return (
		<div className={'insert-options d-flex'}>
			<Button
				isPrimary
				onClick={() => {
					setDisplayStructures(true);
					setToggleLayoutStructure(true);
				}}
			>
				{addBlankLabel}{' '}
			</Button>
			&nbsp;
			<Button
				isPrimary
				onClick={() =>
					setOpenInserter('pattern-inserter/post-content', clientId, {
						replace: replaceBlockInsteadInsert,
						closeOnSelect: isHero || isSection,
					})
				}
			>
				{addSectionLabel}{' '}
			</Button>
		</div>
	);
};

function useDirectInsert() {
	const { insertBlock } = useDispatch('core/block-editor');
	const { getBlockOrder } = useSelect('core/block-editor');

	const onDirectInsert = (block, parentClientId) => {
		insertBlock(
			block,
			getBlockOrder(parentClientId).length,
			parentClientId,
			true
		);
	};

	return onDirectInsert;
}

const LayoutPicker_ = (props) => {
	const { clientId, frontPageSuggestions, replaceBlockInsteadInsert } = props;
	const insertLayout = useLayoutSelect(
		__('Section', 'kubio'),
		replaceBlockInsteadInsert
	);
	const onDirectInsert = useDirectInsert();

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();
			const blocks = window?.kubioDraggingData?.blocks;
			const isDraggedFromInserter =
				window.kubioDraggingData?.type === 'inserter';

			let columns = [getPercentageColumn(100)];
			if (blocks && isDraggedFromInserter) {
				if (blocks[0].name === 'kubio/query-layout') {
					onDirectInsert(blocks[0], clientId);

					window.kubioDraggingData = null;
					return;
				}
				// if dropped a row or a section just a an empty one
				if (
					(blocks.length === 1 && blocks[0].name === 'kubio/row') ||
					blocks[0].name === 'kubio/section'
				) {
					columns = [
						getPercentageColumn(50),
						getPercentageColumn(50),
					];

					insertLayout(clientId, columns);

					return;
				}

				insertLayout(clientId, columns, [blocks]);

				window.kubioDraggingData = null;
			}
		},
		[clientId]
	);

	const dropRef = useDropZone({
		onDrop,
	});

	return (
		<div id={'section-insert'} ref={dropRef}>
			{frontPageSuggestions}
			<div className={'insert-options-container'}>
				<LayoutStructuresContainer
					{...props}
					insertLayout={insertLayout}
				/>
			</div>
		</div>
	);
};

let currentFrontPageContent = null;
const LayoutPicker = compose(
	createHigherOrderComponent((WrappedComponent) => (ownProps) => {
		const { postType, postId, clientId, disableFPS = false } = ownProps;
		const [frontPageBlocks, setFrontPageBlocks] = useState(null);
		const [hideFPS, setHideFPS] = useState(disableFPS);
		const [isInserting, setIsInserting] = useState(false);
		const [blocks] = useEntityBlockEditor('postType', postType, {
			id: postId,
		});
		const { replaceInnerBlocks } = useDispatch('core/block-editor');
		const { getBlockHierarchyRootClientId } = useSelect(
			'core/block-editor'
		);
		const contentClientId = getBlockHierarchyRootClientId(clientId);
		const {
			stylesheet,
			template,
			themeName,
			isKubioTheme,
			themeUri,
			kubioThemeAssetsUrlBase,
			kubioHasFpsScrollPreview,
			isFrontPage,
		} = useSelect((select) => {
			const currentTheme = select('core')?.getCurrentTheme();
			const settings = select(blockEditorStore)?.getSettings();

			return {
				stylesheet: currentTheme?.stylesheet,
				template: currentTheme?.template,
				themeName: currentTheme?.name,
				themeUri: settings?.themeUri,
				kubioThemeAssetsUrlBase: settings?.kubioThemeAssetsUrlBase,
				kubioHasFpsScrollPreview: settings?.kubioHasFpsScrollPreview,
				isKubioTheme: settings?.isKubioTheme,
				isFrontPage: select(STORE_KEY)?.getIsFrontPage?.() || false,
			};
		});

		useEffectAsync(
			async (isMounted) => {
				if (
					hideFPS ||
					!isKubioTheme ||
					!isFrontPage ||
					blocks.length > 0 ||
					frontPageBlocks === null
				) {
					return;
				}

				if (isMounted()) {
					if (currentFrontPageContent) {
						const url = addQueryArgs(
							`https://themes.kubiobuilder.com/${stylesheet}__${template}__only-front.data`,
							{
								json: 'true',
							}
						);

						const response = await window.fetch(url).then((res) => {
							return res.json();
						});

						const frontPage = _.get(response, [
							'pages',
							'front-page',
						]);
						if (frontPage) {
							const newTemplate = response?.pages[
								'front-page'
							].replaceAll(
								'{{{kubio_asset_base_url}}}',
								kubioThemeAssetsUrlBase
							);
							currentFrontPageContent = parse(newTemplate);
						}
					}
				}

				if (isMounted() && currentFrontPageContent) {
					setFrontPageBlocks(currentFrontPageContent);
				}
			},
			[
				hideFPS,
				isKubioTheme,
				isFrontPage,
				blocks.length,
				frontPageBlocks === null,
				kubioThemeAssetsUrlBase,
			]
		);

		useEffect(() => {
			if (isInserting === true) {
				replaceInnerBlocks(contentClientId, frontPageBlocks);
			}
		}, [isInserting]);

		// reset isInserting after added the blocks
		useEffect(() => {
			if (blocks.length === 0 && isInserting) {
				setIsInserting(false);
			}
		}, [blocks.length]);

		if (
			hideFPS ||
			!isKubioTheme ||
			!isFrontPage ||
			blocks.length > 0 ||
			frontPageBlocks === null
		) {
			return <WrappedComponent {...ownProps} />;
		}

		const hideFPSPanel = () => {
			setHideFPS(true);
		};

		const previewImage = kubioHasFpsScrollPreview
			? `${themeUri}/resources/images/front-page-preview.jpg`
			: `${themeUri}/screenshot.jpg`;

		const previewImageClass = classNames(
			'kubio-front-page-preview-image-scroller',
			{
				'is-animated': kubioHasFpsScrollPreview,
			}
		);

		const importButtonClasses = classNames(
			'button components-button btn-primary is-primary',
			{
				'is-busy': isInserting,
			}
		);

		const frontPageSuggestions = (
			<div className={'kubio-front-page-suggestions'}>
				<div className="content-holder">
					<div className="front-page-preview">
						<div className="kubio-front-page-preview-browser-bar">
							<div className="kubio-front-page-preview-browser-dot"></div>
							<div className="kubio-front-page-preview-browser-dot"></div>
							<div className="kubio-front-page-preview-browser-dot"></div>
						</div>
						<div className={previewImageClass}>
							<img
								src={previewImage}
								alt={__('Theme preview.', 'kubio')}
							/>
						</div>
					</div>
					<div className="messages-area">
						<h3 className={'title'}>
							{__(
								'Hey, it seems that you lack some content on this page.',
								'kubio'
							)}
						</h3>
						<p className={'content'}>
							{sprintf(
								// translators: %s is for the Theme's name.
								__(
									'Would you like some help with that? The %s homepage has beautiful ready-made content sections that you can start customizing right away.',
									'kubio'
								),
								themeName?.raw
							)}
						</p>
						<div className={'action-buttons'}>
							<Button
								onClick={() => setIsInserting(true)}
								disabled={isInserting}
								className={importButtonClasses}
							>
								{sprintf(
									// translators: %$1s is for the Theme's name.
									__('Yes, import %1$s homepage', 'kubio'),
									themeName?.raw
								)}
							</Button>
							<Button
								isLink
								variant="link"
								onClick={hideFPSPanel}
								className="button button-link"
							>
								{__('No, thanks', 'kubio')}
							</Button>
						</div>
					</div>
				</div>

				<span
					className="kubio-front-page-suggestions-close-button"
					onClick={hideFPSPanel}
				>
					×
				</span>
			</div>
		);

		return (
			<WrappedComponent
				{...ownProps}
				frontPageSuggestions={frontPageSuggestions}
			/>
		);
	}),
	pure
)(LayoutPicker_);

export { LayoutPicker };
