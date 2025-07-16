/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
	isReusableBlock,
	isTemplatePart,
} from '@wordpress/blocks';
import { __experimentalTruncate as Truncate } from '@wordpress/components';
import { memo, useMemo, useRef } from '@wordpress/element';
import { ENTER, isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import {
	PRO_ON_FREE_FLAG,
	ProBadge,
	proItemOnFreeClass,
	useProModal,
} from '@kubio/pro';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import BlockIcon from '../block-icon';
import InserterDraggableBlocks from '../inserter-draggable-blocks';
import { InserterListboxItem } from '../inserter-listbox';

function InserterListItem( {
	className,
	isFirst,
	item,
	onSelect,
	onHover,
	isDraggable,
	...props
} ) {
	const isDraggingRef = useRef( false );
	const itemIconStyle = item.icon
		? {
				backgroundColor: item.icon.background,
				color: item.icon.foreground,
		  }
		: {};

	const hooks = useSelect( ( select ) => ( {
		getClientIdsWithDescendants:
			select( 'core/block-editor' ).getClientIdsWithDescendants,
		getBlock: select( 'core/block-editor' ).getBlock,
	} ) );

	item = applyFilters( 'kubio.beforeInsertBlock', item, hooks );
	const blocks = useMemo(
		() => [
			createBlock(
				item.name,
				item.initialAttributes,
				createBlocksFromInnerBlocksTemplate( item.innerBlocks )
			),
		],
		[ item.name, item.initialAttributes, item.innerBlocks ]
	);
	const [ ProModal, showProModal ] = useProModal();

	const isSynced =
		( isReusableBlock( item ) && item.syncStatus !== 'unsynced' ) ||
		isTemplatePart( item );

	return (
		<InserterDraggableBlocks
			isEnabled={ isDraggable && ! item.isDisabled }
			blocks={ blocks }
			icon={ item.icon }
		>
			{ ( { draggable, onDragStart, onDragEnd } ) => (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events
				<div
					className={ clsx(
						'block-editor-block-types-list__list-item',
						{
							'block-editor-block-types-list__list-item--is-pro-on-free':
								item?.isProOnFree,
							'is-synced': isSynced,
						}
					) }
					draggable={ draggable }
					onDragStart={ ( event ) => {
						isDraggingRef.current = true;
						if ( onDragStart ) {
							onHover( null );
							onDragStart( event );
						}
					} }
					onDragEnd={ ( event ) => {
						isDraggingRef.current = false;
						if ( onDragEnd ) {
							onDragEnd( event );
						}
					} }
					onMouseUp={ () => {
						if ( item[ PRO_ON_FREE_FLAG ] === true ) {
							showProModal(
								true,
								'block-pro-modal-' + item.name
							);
						}
					} }
					role={ 'button' }
					tabIndex={ 0 }
				>
					<InserterListboxItem
						isFirst={ isFirst }
						className={ clsx(
							'block-editor-block-types-list__item',
							{['block-editor-block-types-list__item--disabled']:item.isDisabled },
							className,
							proItemOnFreeClass( item )
						) }
						disabled={ item.isDisabled }
						onClick={ ( event ) => {
							if ( item.isDisabled ) return;
							event.preventDefault();
							onSelect(
								item,
								isAppleOS() ? event.metaKey : event.ctrlKey
							);
							onHover( null );
						} }
						onKeyDown={ ( event ) => {
							const { keyCode } = event;
							if ( keyCode === ENTER ) {
								event.preventDefault();
								onSelect(
									item,
									isAppleOS() ? event.metaKey : event.ctrlKey
								);
								onHover( null );
							}
						} }
						onMouseEnter={ () => {
							if ( isDraggingRef.current ) {
								return;
							}
							onHover( item );
						} }
						onMouseLeave={ () => onHover( null ) }
						{ ...props }
					>
						<span
							className="block-editor-block-types-list__item-icon"
							style={ itemIconStyle }
						>
							<BlockIcon icon={ item.icon } showColors />
						</span>
						<span className="block-editor-block-types-list__item-title">
							<Truncate numberOfLines={ 3 }>
								{ item.title }
							</Truncate>
						</span>
						<ProBadge item={ item } />
						<ProModal
							id={ 'block-pro-modal-' + item.name }
							urlArgs={ {
								source: 'block-inserter',
								content: item.name.split( '/' ).pop(),
							} }
						/>
					</InserterListboxItem>
				</div>
			) }
		</InserterDraggableBlocks>
	);
}

export default memo( InserterListItem );
