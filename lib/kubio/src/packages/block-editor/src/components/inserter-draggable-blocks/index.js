/**
 * WordPress dependencies
 */
import {
	store as blocksStore,
	createBlock,
	serialize,
} from '@wordpress/blocks';
import { Draggable } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BlockDraggableChip from '../block-draggable/draggable-chip';
import { INSERTER_PATTERN_TYPES } from '../inserter/block-patterns-tab/utils';
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

const DraggableChip = ( { length, icon } ) => {
	return <BlockDraggableChip count={ length } icon={ icon } />;
};

const HIDE_INSERTER_CLASS = 'kubio-dragging-from-inserter--active';

const showInsertSiderbar = () => {
	top.requestIdleCallback( () => {
		setTimeout(
			() => top.document.body.classList.remove( HIDE_INSERTER_CLASS ),
			10
		);
	} );
};

const hideInsertSiderbar = () => {
	setTimeout( () => {
		const topBody = top.document.querySelector( 'body' );
		if ( topBody.classList.contains( HIDE_INSERTER_CLASS ) ) {
			return;
		}
		topBody.classList.add( HIDE_INSERTER_CLASS );
	}, 10 );
};

const InserterDraggableBlocks = ( {
	isEnabled,
	blocks,
	icon,
	children,
	pattern,
} ) => {
	const transferData = {
		type: 'inserter',
		blocks,
	};
	const { hideInsertionPoint } = useDispatch( blockEditorStore );

	const blockTypeIcon = useSelect(
		( select ) => {
			const { getBlockType } = select( blocksStore );
			return (
				blocks.length === 1 && getBlockType( blocks[ 0 ].name )?.icon
			);
		},
		[ blocks ]
	);

	const { startDragging, stopDragging } = unlock(
		useDispatch( blockEditorStore )
	);

	if ( ! isEnabled ) {
		return children( {
			draggable: false,
			onDragStart: undefined,
			onDragEnd: undefined,
		} );
	}

	return (
		<Draggable
			__experimentalTransferDataType="wp-blocks"
			transferData={ transferData }
			onDragStart={ ( event ) => {
				startDragging();
				const parsedBlocks =
					pattern?.type === INSERTER_PATTERN_TYPES.user &&
					pattern?.syncStatus !== 'unsynced'
						? [ createBlock( 'core/block', { ref: pattern.id } ) ]
						: blocks;
				event.dataTransfer.setData(
					'text/html',
					serialize( parsedBlocks )
				);
			} }
			onDragEnd={ () => {
				stopDragging();
			} }
			__experimentalDragComponent={
				<DraggableChip
					count={ blocks.length }
					icon={ icon || ( ! pattern && blockTypeIcon ) }
					isPattern={ !! pattern }
				/>
			}
		>
			{ ( { onDraggableStart, onDraggableEnd } ) => {
				const onDragStart = ( ...args ) => {
					window.kubioDraggingData = transferData;
					hideInsertionPoint();
					onDraggableStart( ...args );
					hideInsertSiderbar();
				};

				const onDragEnd = ( ...args ) => {
					onDraggableEnd( ...args );
					showInsertSiderbar();
				};

				return children( {
					draggable: isEnabled,
					onDragStart: isEnabled ? onDragStart : undefined,
					onDragEnd: isEnabled ? onDragEnd : undefined,
				} );
			} }
		</Draggable>
	);
};

export default InserterDraggableBlocks;
