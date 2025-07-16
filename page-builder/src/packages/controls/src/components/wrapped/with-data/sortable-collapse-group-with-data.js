import { BaseControl, Button } from '@wordpress/components';

import { withComputedData } from '@kubio/core';
import _ from 'lodash';

import { useDispatch, useSelect } from '@wordpress/data';
import { AddItemIcon } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import { SortableAccordion } from '@kubio/controls';

const SortableCollapseGroup_ = ( { computed, ...props } ) => {
	const {
		addButtonText = __( 'Add item', 'iconvert-promoter' ),
		allowMultipleExpanded = false,
		label = __( 'Items', 'iconvert-promoter' ),
		lockAxis = 'y',
		customAddButton = null,
		cloneBlockName = null,
	} = props;
	const {
		items,
		onSelect,
		onAdd,
		onDuplicate,
		onRemove,
		onSortEnd,
		activeItems,
	} = computed;
	return (
		// eslint-disable-next-line @wordpress/no-base-control-with-label-without-id
		<BaseControl label={ label } className="kubio-control">
			<SortableAccordion
				items={ items }
				useDragHandle
				helperClass={ 'sortable-collapse-item--is-sorting' }
				onSortEnd={ onSortEnd }
				onDelete={ onRemove }
				onDuplicate={ onDuplicate }
				onSelect={ onSelect }
				contentRendered={ props.children }
				activeItems={ activeItems }
				allowMultipleExpanded={ allowMultipleExpanded }
				lockAxis={ lockAxis }
				{ ...props }
			/>
			{ customAddButton === null ? (
				<BaseControl>
					<Button
						variant={ 'primary' }
						icon={ AddItemIcon }
						onClick={ onAdd }
						className={
							'kubio-button-group-button sortable-collapse__add-button'
						}
					>
						{ addButtonText }
					</Button>
				</BaseControl>
			) : (
				customAddButton
			) }
		</BaseControl>
	);
};

const useComputed = ( dataHelper, ownProps ) => {
	const {
		activeItems = [],
		afterAddHook = _.noop,
		afterDuplicateHook = _.noop,
		afterDeleteHook = null,
		selectItem = false,
		iconGetter = _.noop,
		titleGetter = null,
		titlePath = 'text',
		selectPrevious = true,
		selectHook = null,
		onSortEndHook = null,
		onSelect: onItemSelect = _.noop,
		cloneBlockName = null,
	} = ownProps;
	const groupClientId = dataHelper.clientId;

	const children = dataHelper.withChildren();

	const { removeBlock, moveBlockToPosition, selectBlock } =
		useDispatch( 'core/block-editor' );

	const { selectedBlock } = useSelect( ( select ) => ( {
		selectedBlock: select( 'core/block-editor' ).getSelectedBlock(),
	} ) );

	const items = children.map( ( child, index ) => {
		let title = null;
		if ( titleGetter && typeof titleGetter === 'function' ) {
			title = titleGetter( child, index );
		} else {
			title = child.getAttribute( titlePath, 'item' );
		}

		const data = {
			id: child.clientId,
			clientId: child.clientId,
			title,
			slug: child.localData.slug,
			isSelected:
				child.clientId === selectedBlock?.clientId ||
				-1 !== activeItems.indexOf( index ),
			index,
		};

		data.icon = iconGetter( child );
		return data;
	} );

	const onSortEnd = ( changes = {} ) => {
		const { oldIndex, newIndex } = changes;
		const clientId = _.get( children, [ oldIndex, 'clientId' ] );
		moveBlockToPosition( clientId, groupClientId, groupClientId, newIndex );

		if ( onSortEndHook !== null && typeof onSortEndHook === 'function' ) {
			onSortEndHook( oldIndex, newIndex );
		}
	};

	const onRemove = ( item, itemIndex ) => {
		if ( children.length < 2 ) {
			return;
		}

		// While deleting a child item from the parent panel we should avoid changing the focus to previous child.
		if ( dataHelper.blockName === selectedBlock.name ) {
			removeBlock( item?.id, false );
		} else {
			removeBlock( item?.id, selectPrevious );

			if ( ! itemIndex ) {
				// When we try to remove the first child block there is no "previous" so we'll select the first child as fallback.
				selectBlock( children[ 1 ].clientId );
			}
		}

		if (
			afterDeleteHook !== null &&
			typeof afterDeleteHook === 'function'
		) {
			afterDeleteHook( item );
		}
	};
	const onAdd = async () => {
		const filteredBlocks = cloneBlockName
			? children.filter( ( ch ) => ch.block.name === cloneBlockName )
			: [];
		const filteredLastBlock = filteredBlocks[ filteredBlocks.length - 1 ];
		const lastChild = filteredLastBlock
			? filteredLastBlock
			: children[ children.length - 1 ];
		const newItemDataHelper = await onDuplicate(
			lastChild?.clientId,
			true
		);
		afterAddHook( newItemDataHelper, items );
	};

	async function onDuplicate( clientId, fromAdd = false, item ) {
		const newItemDataHelper = await dataHelper.duplicate( {
			clientId,

			//when used from add unlink the items
			unlink: fromAdd,
			selectDuplicate: false,
		} );
		if ( ! fromAdd ) {
			afterDuplicateHook( newItemDataHelper, items, item );
		}
		return newItemDataHelper;
	}
	const onSelect = ( item ) => {
		if ( selectItem ) {
			selectBlock( item.id );
		}

		if ( selectHook !== null && typeof selectHook === 'function' ) {
			selectHook( item );
		}
		onItemSelect( item );
	};

	return {
		activeItems,
		items,
		onSelect,
		onDuplicate,
		onAdd,
		onRemove,
		onSortEnd,
	};
};

const SortableCollapseGroupWithData = withComputedData( useComputed )(
	SortableCollapseGroup_
);

export { SortableCollapseGroupWithData };
