import {
	KubioPopup,
	TemplateLockControls,
	TemplateLockModal,
	useTemplatePartLock,
} from '@kubio/controls';
import { WithKubioDataHelperProp } from '@kubio/core';
import { useUIVersion } from '@kubio/core-hooks';
import { isGutentagPrefixed } from '@kubio/utils';
import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import {
	AsyncModeProvider,
	useDispatch,
	useSelect,
	withDispatch,
	withSelect,
} from '@wordpress/data';
import { useMemo, useRef, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { cog, plus } from '@wordpress/icons';
import classnames from 'classnames';
import _, { find, noop, set } from 'lodash';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { STORE_KEY } from '../../../store/constants';
import { HandledBlockItem } from './handled-block-item';
import { SectionListManager } from './manager';
import { SectionListMenuContextProvider } from './menu-context';
import { UnhandledBlockItem } from './unhandled-block-item';

const TEMPLATE_PARTS_AREAS = {
	HEADER: 'header',
	FOOTER: 'footer',
	SIDEBAR: 'sidebar',
	CONTENT: 'content',
};

const LABEL_BY_TEMPLATE_PART_AREA = {
	[TEMPLATE_PARTS_AREAS.HEADER]: __('Header', 'kubio'),
	[TEMPLATE_PARTS_AREAS.FOOTER]: __('Footer', 'kubio'),
	[TEMPLATE_PARTS_AREAS.SIDEBAR]: __('Sidebar', 'kubio'),
	[TEMPLATE_PARTS_AREAS.CONTENT]: __('Content', 'kubio'),
};

const TEMPLATE_PARTS_AREAS_ORDER = [
	TEMPLATE_PARTS_AREAS.HEADER,
	TEMPLATE_PARTS_AREAS.CONTENT,
	TEMPLATE_PARTS_AREAS.SIDEBAR,
	TEMPLATE_PARTS_AREAS.FOOTER,
];

const SUPPORTED_TEMPLATE_PARTS = [
	'kubio/header',
	'kubio/footer',
	// 'kubio/sidebar',
	'core/post-content',
	'core/template-part',
];
const INSERTER_TYPES_BY_AREA = {
	[TEMPLATE_PARTS_AREAS.HEADER]: 'header',
	[TEMPLATE_PARTS_AREAS.FOOTER]: 'footer',
	[TEMPLATE_PARTS_AREAS.SIDEBAR]: 'sidebar',
	[TEMPLATE_PARTS_AREAS.CONTENT]: 'post-content',
};

const SectionListItem = SortableElement(
	({ item, onRemove = noop, onSelect = noop, dataHelper }) => {
		if (!isGutentagPrefixed(item.name)) {
			return (
				<UnhandledBlockItem
					onRemove={() => onRemove(item)}
					onSelect={() => onSelect(item)}
					item={item}
					dataHelper={dataHelper}
				/>
			);
		}

		return (
			<>
				<HandledBlockItem
					onRemove={() => onRemove(item)}
					onSelect={() => onSelect(item)}
					item={item}
					dataHelper={dataHelper}
				/>
			</>
		);
	}
);

const SectionListItemWithData = (props) => {
	const SectionListWithData = useMemo(() => {
		return SectionListFactory();
	}, []);

	return <SectionListWithData clientId={props.item?.clientId} {...props} />;
};

const SectionListFactory = () => {
	return WithKubioDataHelperProp(SectionListItem);
};

const SortableSectionsList = SortableContainer(
	({ items, onRemove, onSelect }) => {
		return (
			<div>
				<AsyncModeProvider value={true}>
					{items?.map((item, index) => {
						return (
							<SectionListItemWithData
								key={item.clientId}
								item={item}
								onRemove={onRemove}
								onSelect={onSelect}
								index={index}
							/>
						);
					})}
				</AsyncModeProvider>
			</div>
		);
	}
);

const SectionsListArea = ({
	name: templatePartName = '',
	reorderBlocks,
	templatePart = {},
	blockTypes,
	removeBlocks,
	selectBlock,
	templatePartClientId,
	label,
}) => {
	const area = templatePart?.area;
	const defaultPatternType =
		INSERTER_TYPES_BY_AREA[TEMPLATE_PARTS_AREAS.CONTENT];
	const inserterType = _.get(
		INSERTER_TYPES_BY_AREA,
		area,
		defaultPatternType
	);

	const ref = useRef();
	const lockButtonRef = useRef();
	const sectionsListRef = useRef();
	const [popupIsOpened, setPopupIsOpened] = useState(false);
	const { setOpenInserter } = useDispatch(STORE_KEY);
	const partialName = inserterType;
	const { isUnlocked } = useTemplatePartLock(partialName);
	const [isWizardShown, setIsWizardShown] = useState(false);
	const { postType, postId } = useSelect(
		(select) => select(STORE_KEY)?.getPage()?.context || {},
		[]
	);

	const openedInserter = useSelect((select) => {
		select(STORE_KEY).getOpenedInserter();
	});

	const { uiVersion } = useUIVersion();

	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(templatePartClientId),
		[templatePartClientId]
	);

	// if the render content is displayed instead the post content do no show the content section
	if (
		templatePartName === 'core/post-content' &&
		applyFilters(
			'kubio.showRenderedPostContent',
			postType !== 'page',
			postType,
			postId
		)
	) {
		return <></>;
	}

	const canBeLockedTemplateParts = ['header', 'footer', 'sidebar'];

	//we support the template part block to be set as header/footer. But we won't have all the features enabled for
	//the template part block. For example the lock mechanic is disabled
	const isKubioBlock = templatePartName.includes('kubio');

	const showLock =
		isKubioBlock && canBeLockedTemplateParts.includes(partialName);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		reorderBlocks(innerBlocks, oldIndex, newIndex);
	};

	const getBlockTitle = () => {
		const name = templatePartName;
		const found = find(blockTypes, { name });
		return found?.title || name;
	};

	const getTemplatePartLabel = () => {
		let _label = LABEL_BY_TEMPLATE_PART_AREA[area];
		if (!_label) {
			_label = getBlockTitle();
		}
		return _label;
	};

	const buttonStyling = (name, extraClasses = []) => {
		if (area === TEMPLATE_PARTS_AREAS.HEADER) {
			return ['btn-primary', 'header-button']
				.concat(extraClasses)
				.join(' ');
		}

		return ['btn-primary'].concat(extraClasses).join(' ');
	};

	const buttonContent = () => {
		switch (area) {
			case TEMPLATE_PARTS_AREAS.HEADER:
				return __('Choose header design', 'kubio');
			case TEMPLATE_PARTS_AREAS.FOOTER:
				return __('Choose footer design', 'kubio');
			case TEMPLATE_PARTS_AREAS.SIDEBAR:
				return __('Add section', 'kubio');
			default:
				return __('Add predesigned section', 'kubio');
		}
	};

	const onSelectTemplatePart = () => {
		selectBlock(templatePart.clientId);
	};

	const canAddSection = () => {
		return inserterType;
	};

	const addSection = async (sectionArea = area) => {
		const patternInserterType = _.get(
			INSERTER_TYPES_BY_AREA,
			sectionArea,
			defaultPatternType
		);

		const nextOpenedInserter = `pattern-inserter/${patternInserterType}`;

		if (openedInserter !== nextOpenedInserter) {
			await setOpenInserter(false, null);
		}

		setOpenInserter(nextOpenedInserter, templatePart.clientId);
	};

	function addBlocks() {
		setOpenInserter(
			`pattern-inserter/${inserterType}-blocks`,
			templatePart.clientId
		);
	}

	const containerClasses = ['kubio-full-section'];
	if (showLock) {
		if (isUnlocked) {
			containerClasses.push('kubio-full-section--unlocked');
		} else {
			containerClasses.push('kubio-full-section--locked');
		}
	}
	return (
		<div ref={ref} className={containerClasses.join(' ')}>
			{showLock && (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events
				<div
					ref={lockButtonRef}
					tabIndex={-1}
					role={'button'}
					className={classnames('kubio-full-section-overlay', {
						'kubio-full-section-overlay--show-popup': popupIsOpened,
					})}
				/>
			)}
			<div className={'kubio-subsidebar-container'}>
				<div
					className={classnames(
						'components-panel__header',
						'interface-complementary-area-header',
						'kubio-subsidebar-title',
						'kubio-subsidebar-title-header'
					)}
					tabIndex={-1}
				>
					<div className={'kubio-sidebar-title-text'}>
						{label || getTemplatePartLabel()}
					</div>
					<div className="dummy-column" />
					<div
						ref={sectionsListRef}
						className="section-list-header-buttons-holder"
					>
						{showLock && !isUnlocked && (
							<KubioPopup
								position={
									uiVersion === 2
										? 'middle right'
										: 'top left'
								}
								className={`kubio-options-popover kubio-template-controls-popover`}
								buttonRef={lockButtonRef}
								anchorRef={
									uiVersion === 2 ? sectionsListRef : ref
								}
								selectorToIgnoreOnClickOutside={
									'.h-template-wizard__modal'
								}
								onOpen={() => setPopupIsOpened(true)}
								onClose={() => setPopupIsOpened(false)}
							>
								<TemplateLockModal
									title={__('Choose editing mode', 'kubio')}
								>
									<TemplateLockControls
										isWizardShown={isWizardShown}
										setIsWizardShown={setIsWizardShown}
										templatePart={partialName}
									/>
								</TemplateLockModal>
							</KubioPopup>
						)}

						<Button
							isSmall
							icon={cog}
							className={'section-icon-container'}
							onClick={onSelectTemplatePart}
							showTooltip
							tooltipPosition={'top left'}
							label={__('Settings', 'kubio')}
						/>

						<Button
							isSmall
							icon={plus}
							className={'section-icon-container'}
							onClick={addBlocks}
							showTooltip
							tooltipPosition={'top left'}
							label={__('Add block/section', 'kubio')}
						/>
					</div>
				</div>
			</div>

			<SortableSectionsList
				helperClass={'kubio-list-item-is-sorting'}
				helperContainer={() => {
					return ref.current;
				}}
				onSortEnd={onSortEnd}
				lockAxis={'y'}
				useDragHandle={true}
				items={innerBlocks}
				onRemove={(item) => {
					removeBlocks([item.clientId], false);
				}}
				onSelect={(item) => {
					selectBlock(item.clientId);
				}}
			/>

			{canAddSection(templatePart) && (
				<Button
					isPrimary
					onClick={() => addSection()}
					className={buttonStyling(templatePartName, [
						'kubio-button-add-blocks',
						'kubio-sidebar-add-section-button',
					])}
				>
					<span className={'kubio-header-section-main-button'}>
						{buttonContent(templatePartName)}
					</span>
				</Button>
			)}
		</div>
	);
};

const SectionsList = (props) => {
	return (
		<SectionListMenuContextProvider>
			<div className="block-editor-block-navigation__container kubio-interface">
				<div className="block-editor-block-navigation__label">
					<SectionListManager {...props} />
				</div>
			</div>
		</SectionListMenuContextProvider>
	);
};

export default compose(
	withSelect((select) => {
		const {
			getSelectedBlockClientId,
			getBlock,
			getBlockParents,
			getClientIdsWithDescendants,
		} = select('core/block-editor');

		const templateParts = getClientIdsWithDescendants()
			.map(getBlock)
			.filter(({ name }) => SUPPORTED_TEMPLATE_PARTS.includes(name));

		return {
			selectedBlockClientId: getSelectedBlockClientId(),
			templateParts,
			getBlockParents,
		};
	}),
	withDispatch(
		(
			dispatch,
			{ onSelect = noop, getBlockParents, getBlockAttributes }
		) => {
			const {
				removeBlocks,
				moveBlockToPosition,
				updateBlockAttributes,
			} = dispatch('core/block-editor');

			const reorderBlocks = (blocks, oldIndex, newIndex) => {
				const parents = getBlockParents(blocks[oldIndex].clientId);
				const parent = parents.pop();
				// debugger;
				moveBlockToPosition(
					blocks[oldIndex].clientId,
					parent,
					parent,
					newIndex
				);
			};

			const updateBlockAttribute = (clientId, path, value) => {
				let attributes = getBlockAttributes(clientId);
				attributes = set(attributes, path, value);
				updateBlockAttributes(clientId, { ...attributes });
			};
			return {
				selectBlock(clientId) {
					dispatch('core/block-editor').selectBlock(clientId);
					onSelect(clientId);
				},
				removeBlocks,
				reorderBlocks,
				updateBlockAttribute,
			};
		}
	)
)(SectionsList);

export {
	SectionsListArea,
	TEMPLATE_PARTS_AREAS,
	TEMPLATE_PARTS_AREAS_ORDER,
	INSERTER_TYPES_BY_AREA,
	LABEL_BY_TEMPLATE_PART_AREA,
};
