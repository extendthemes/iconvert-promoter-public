import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import {
	chevronLeft,
	chevronRight,
	chevronUp,
	chevronDown,
} from '@wordpress/icons';
import _ from 'lodash';
import { useActiveMedia, useAncestorContext, useDeepMemo } from '@kubio/core';
import { useSelect } from '@wordpress/data';
import { isRTL } from '@wordpress/i18n';
import classnames from 'classnames';
import { useEffect, useRef } from '@wordpress/element';

const blockEditorStore = 'core/block-editor';

const ReorderBlocksControls = ({ dataHelper }) => {
	const clientId = dataHelper?.clientId;
	const wrapperStyledComponent = dataHelper.wrapperStyledComponent;
	const activeMedia = useActiveMedia();
	const { ancestor } = useAncestorContext();
	const siblingsDataHelpers = dataHelper.withSiblings();
	const storeOptions = {
		styledComponent: wrapperStyledComponent,
		media: activeMedia,
		ancestor,
		fromRoot: true,
	};
	const items = getItems(siblingsDataHelpers);

	const orderedItems = useDeepMemo(() => {
		return _.orderBy(items, (item) => item.order);
	}, [items]);

	const ref = useRef();
	const { orientation, currentIndex } = useSelect(
		(select) => {
			const {
				getBlockListSettings,
				getBlockIndex,
				getBlockRootClientId,
			} = select(blockEditorStore);
			const parentClientId = getBlockRootClientId(clientId);
			const currentIndex_ = getBlockIndex(clientId, parentClientId);
			const { orientation: blockListOrientation } =
				getBlockListSettings(parentClientId) || {};
			return {
				currentIndex: currentIndex_,
				orientation: blockListOrientation,
			};
		},
		[clientId]
	);

	let currentOrder = dataHelper.getLocalStyle(
		'order',
		currentIndex + 1,
		storeOptions
	);

	let currentPosition = _.findIndex(
		orderedItems,
		(item) => item.order === currentOrder
	);

	const isFirst = currentPosition === 0;
	const isLast = currentPosition === siblingsDataHelpers.length - 1;

	function getItems() {
		const items_ = siblingsDataHelpers.map((itemDataHelper, index) => {
			const order = itemDataHelper.getLocalStyle(
				'order',
				index + 1,
				storeOptions
			);
			return {
				order,
				index,
				clientId: itemDataHelper.clientId,
			};
		});

		return items_;
	}
	function getOrderedSiblingsDataHelpers() {
		const dataHelpersByClientId = _.keyBy(siblingsDataHelpers, 'clientId');
		return orderedItems.map((item) =>
			_.get(dataHelpersByClientId, item.clientId)
		);
	}

	function normalizeOrderStyle() {
		let columnsNeedRecalculations = false;
		const orderedSiblingsDataHelpers = getOrderedSiblingsDataHelpers();
		//add order style to all children if they don't already have the property. Added the properties in reverse so
		//the items won't flicker positions.
		_.forEachRight(orderedSiblingsDataHelpers, (itemDataHelper, index) => {
			// eslint-disable-next-line no-shadow
			const currentOrder = itemDataHelper.getLocalStyle(
				'order',
				null,
				storeOptions
			);
			const orderIsCorrect = currentOrder === index + 1;
			if (currentOrder === null || !orderIsCorrect) {
				itemDataHelper.setLocalStyle('order', index + 1, storeOptions);
			}
			if (!orderIsCorrect) {
				columnsNeedRecalculations = true;
			}
		});

		//when there are gaps or duplicated orders. For example when you delete columns or duplicate them
		if (columnsNeedRecalculations) {
			const newItems = getItems();
			const newOrderedItems = _.orderBy(newItems, (item) => item.order);

			//update the dataHelper object. We made modifications in the siblings array so we must update the current dataHelper
			//object to reflect this modifications.
			dataHelper = siblingsDataHelpers.find(
				(siblingDataHelper) =>
					siblingDataHelper.clientId === dataHelper?.clientId
			);

			currentOrder = dataHelper.getLocalStyle(
				'order',
				currentIndex + 1,
				storeOptions
			);

			currentPosition = _.findIndex(
				newOrderedItems,
				(item) => item.order === currentOrder
			);
		}
	}
	function swapBlocksOrder(direction) {
		const currentPositionDataHelper = dataHelper;

		const nextPosition =
			direction === 'left' ? currentOrder - 1 : currentOrder + 1;

		const newPositionDataHelper = siblingsDataHelpers.find(
			(itemDataHelper) => {
				return (
					itemDataHelper.getLocalStyle(
						'order',
						null,
						storeOptions
					) === nextPosition
				);
			}
		);

		const currentPositionOrder = currentOrder;
		const newPositionOrder = newPositionDataHelper.getLocalStyle(
			'order',
			null,
			storeOptions
		);
		if (isNaN(currentPositionOrder) || isNaN(newPositionOrder)) {
			return;
		}

		currentPositionDataHelper.setLocalStyle(
			'order',
			newPositionOrder,
			storeOptions
		);
		newPositionDataHelper.setLocalStyle(
			'order',
			currentPositionOrder,
			storeOptions
		);
	}
	const reorderItems = (direction) => {
		normalizeOrderStyle();
		swapBlocksOrder(direction);
	};

	const onShiftLeft = () => {
		reorderItems('left');
	};
	const onShiftRight = () => {
		reorderItems('right');
	};
	const kubioToolbarClass = 'kubio-reorder-controls-toolbar';
	const medias = ['desktop', 'tablet', 'mobile'];
	const kubioMediaClasses = medias.map((media) => `kubio-on--${media}`);
	useEffect(() => {
		setTimeout(() => {
			const node = ref.current;
			if (!node) {
				return;
			}
			const toolbar = node.closest(
				'.block-editor-block-contextual-toolbar'
			);
			if (!toolbar) {
				return;
			}
			if (!toolbar.classList.contains(kubioToolbarClass)) {
				toolbar.classList.add(kubioToolbarClass);
			}
			kubioMediaClasses.forEach((mediaClass) => {
				if (toolbar.classList.contains(mediaClass)) {
					toolbar.classList.remove(mediaClass);
				}
				toolbar.classList.add(`kubio-on--${activeMedia}`);
			});
		}, 0);
	}, [activeMedia]);

	const orientationClass = `is-${orientation}`;
	const leftIcon = getArrowIcon('left', orientation);
	const rightIcon = getArrowIcon('right', orientation);

	const leftIsDisabled = isFirst;
	const rightIsDisabled = isLast;

	const onDesktop = activeMedia === 'desktop';

	return (
		<BlockControls>
			<div
				ref={ref}
				className={classnames(
					'kubio-toolbar-reorder-controls',
					'is-visible',
					`is-${orientation}`,
					'block-editor-block-mover',
					orientationClass,
					{ 'd-none': onDesktop }
				)}
			>
				<ToolbarGroup className="block-editor-block-mover__move-button-container">
					<ToolbarButton
						className={classnames(
							'block-editor-block-mover-button',
							'is-up-button'
						)}
						icon={leftIcon}
						onClick={onShiftLeft}
						aria-disabled={leftIsDisabled}
					/>
					<ToolbarButton
						className={classnames(
							'block-editor-block-mover-button',
							'is-down-button'
						)}
						icon={rightIcon}
						onClick={onShiftRight}
						aria-disabled={rightIsDisabled}
					/>
				</ToolbarGroup>
			</div>
		</BlockControls>
	);
};
function getArrowIcon(direction, orientation) {
	if (direction === 'left') {
		if (orientation === 'horizontal') {
			return isRTL() ? chevronRight : chevronLeft;
		}
		return chevronUp;
	} else if (direction === 'right') {
		if (orientation === 'horizontal') {
			return isRTL() ? chevronLeft : chevronRight;
		}
		return chevronDown;
	}
	return null;
}
export { ReorderBlocksControls };
