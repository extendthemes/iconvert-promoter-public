/**
 * WordPress dependencies
 */
import { getNamesOfBlocks } from '@kubio/block-library';
import { STORE_KEY } from '@kubio/constants';
import { useOnClickOutside } from '@kubio/core';
import { useBlocksOwnerDocument } from '@kubio/editor-data';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { __experimentalLibrary as Library } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useRef } from '@wordpress/element';
import { _x } from '@wordpress/i18n';
import { close, closeSmall, plus } from '@wordpress/icons';
import { isUndefined } from 'lodash';

const InserterSidebar = () => {
	const { setOpenInserter } = useDispatch( STORE_KEY );

	const insertionPoint = useSelect(
		( select ) => select( STORE_KEY ).getOpenedInserter(),
		[]
	);

	const ownerDocument = useBlocksOwnerDocument();

	const isMobile = useViewportMatch( 'medium', '<' );

	const inserterDialogRef = useRef();

	const onClickOutside = useCallback(
		( event ) => {
			if ( insertionPoint === false ) {
				return;
			}

			if (
				event.target.classList.contains(
					'edit-site-header-toolbar__inserter-toggle'
				) ||
				event.target.closest(
					'.edit-site-header-toolbar__inserter-toggle'
				) ||
				event.target.closest( '.kubio-inserter-ignore-click-outisde' )
			) {
				return;
			}

			setOpenInserter( false );
		},
		[ insertionPoint, setOpenInserter ]
	);

	useOnClickOutside( inserterDialogRef, onClickOutside );

	return (
		<div
			ref={ inserterDialogRef }
			className="edit-site-editor__inserter-panel"
		>
			<div className="edit-site-editor__inserter-panel-header">
				<Button
					icon={ close }
					onClick={ () => setOpenInserter( false ) }
				/>
			</div>
			<div className="edit-site-editor__inserter-panel-content">
				{ insertionPoint && (
					<Library
						shouldFocusBlock={ isMobile }
						rootClientId={ insertionPoint?.rootClientId }
						__experimentalInsertionIndex={
							insertionPoint?.insertionIndex
						}
						ownerDocument={ ownerDocument }
						insertionPoint={ insertionPoint }
						isAppender={ insertionPoint?.isAppender }
					/>
				) }
			</div>
		</div>
	);
};

const NamesOfBlocks = getNamesOfBlocks();
const allowedBlocks = [
	'cspromo/promopopup',
	'core/column',
	'core/post-content',
	'core/template-part',
	NamesOfBlocks.HEADER,
	NamesOfBlocks.FOOTER,
	NamesOfBlocks.SIDEBAR,
	NamesOfBlocks.COLUMN,
	NamesOfBlocks.LOOP_ITEM,
	NamesOfBlocks.SLIDER_CONTENT,
];

const AddBlockButton = () => {
	const { rootClientId, isInserterOpen, insertionIndex } = useSelect(
		( select ) => {
			const {
				getBlockListSettings,
				getSelectedBlockClientId,
				getBlockRootClientId,
				getBlock,
				getBlockIndex,
			} = select( 'core/block-editor' );

			let rootClientId_ = getSelectedBlockClientId();
			//console.log("rootClientId_",rootClientId_)
			// if block does not accept innerblocks go up
			let currentBlockListSettings =
				getBlockListSettings( rootClientId_ );
			let _insertionIndex;
			if (
				isUndefined( currentBlockListSettings ) ||
				currentBlockListSettings.templateLock
			) {
				_insertionIndex = getBlockIndex( rootClientId_ );
				rootClientId_ = getBlockRootClientId( rootClientId_ );
				currentBlockListSettings =
					getBlockListSettings( rootClientId_ );
			}

			const hasRootClientId =
				rootClientId_ &&
				allowedBlocks.includes( getBlock( rootClientId_ )?.name ) &&
				( isUndefined( currentBlockListSettings ) ||
					! currentBlockListSettings.templateLock );

			return {
				isInserterOpen: select( STORE_KEY ).getOpenedInserter(),
				rootClientId: hasRootClientId ? rootClientId_ : null,
				insertionIndex: _insertionIndex,
			};
		},
		[]
	);
	const { setOpenInserter } = useDispatch( STORE_KEY );
	const { selectBlock } = useDispatch( 'core/block-editor' );
	const inserterButton = useRef();

	const onToggleInserter = useCallback(
		( event ) => {
			const nextState = isInserterOpen ? false : 'block-inserter';
			console.log( 'rootClientId', rootClientId );
			if ( nextState ) {
				//selectBlock(null);
				selectBlock( rootClientId ); //- attempt to open contextualized inserter
			} else {
				// Focusing the inserter button closes the inserter popover
				inserterButton.current.focus();
				event.preventDefault();
				event.stopPropagation();
			}
			setOpenInserter( nextState, rootClientId );
		},
		[ isInserterOpen, rootClientId ]
	);

	const getLabelText = ( isInserterOpen ) => {
		return isInserterOpen ? 'Close' : 'Add block';
	};

	return (
		<>
			<Button
				ref={ inserterButton }
				isSecondary
				isPressed={ isInserterOpen }
				className="edit-site-header-toolbar__inserter-toggle"
				onClick={ onToggleInserter }
				icon={ isInserterOpen ? closeSmall : plus }
				onMouseDown={ ( event ) => {
					event.preventDefault();
				} }
				label={ _x(
					getLabelText( isInserterOpen ),
					'Generic label for block inserter button',
					'iconvert-promoter'
				) }
			/>
		</>
	);
};

export { AddBlockButton, InserterSidebar };
