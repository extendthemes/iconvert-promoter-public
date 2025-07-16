import { isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import { withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { withColibriDataAutoSave } from './with-colibri-data';
import { withStyledElements } from './with-styled-elements';

const withDispatchWpBLock = withDispatch(
	( dispatch, ownProps, { select } ) => {
		const {
			updateBlockAttributes,
			insertBlocks,
			mergeBlocks,
			replaceBlocks,
			toggleSelection,
			__unstableMarkLastChangeAsPersistent,
		} = dispatch( 'core/block-editor' );

		// Do not add new properties here, use `useDispatch` instead to avoid
		// leaking new props to the public API (editor.BlockListBlock filter).
		return {
			setAttributes( newAttributes ) {
				const {
					clientId,
					isFirstMultiSelected,
					multiSelectedClientIds,
				} = ownProps;
				const clientIds = isFirstMultiSelected
					? multiSelectedClientIds
					: [ clientId ];

				updateBlockAttributes( clientIds, newAttributes );
			},
			onInsertBlocks( blocks, index ) {
				const { rootClientId } = ownProps;
				insertBlocks( blocks, index, rootClientId );
			},
			onInsertBlocksAfter( blocks ) {
				const { clientId, rootClientId } = ownProps;
				const { getBlockIndex } = select( 'core/block-editor' );
				const index = getBlockIndex( clientId, rootClientId );
				insertBlocks( blocks, index + 1, rootClientId );
			},
			onMerge( forward ) {
				const { clientId } = ownProps;
				const { getPreviousBlockClientId, getNextBlockClientId } =
					select( 'core/block-editor' );

				if ( forward ) {
					const nextBlockClientId = getNextBlockClientId( clientId );
					if ( nextBlockClientId ) {
						mergeBlocks( clientId, nextBlockClientId );
					}
				} else {
					const previousBlockClientId =
						getPreviousBlockClientId( clientId );
					if ( previousBlockClientId ) {
						mergeBlocks( previousBlockClientId, clientId );
					}
				}
			},
			onReplace( blocks, indexToSelect, initialPosition ) {
				if (
					blocks.length &&
					! isUnmodifiedDefaultBlock( blocks[ blocks.length - 1 ] )
				) {
					__unstableMarkLastChangeAsPersistent();
				}
				replaceBlocks(
					[ ownProps.clientId ],
					blocks,
					indexToSelect,
					initialPosition
				);
			},
			toggleSelection( selectionEnabled ) {
				toggleSelection( selectionEnabled );
			},
		};
	}
);

export { withDispatchWpBLock };

/**
 *
 * @param {import('./with-colibri-data').MapSelectToPropsCallback} useComputed
 * @param {Function | Function[]}                                  stylesMapper
 * @param {...any}                                                 toCompose
 * @return {Function} - return composition function with kubio data applied
 */
const gutentagCompose = ( useComputed, stylesMapper, ...toCompose ) =>
	compose(
		withColibriDataAutoSave( useComputed ),
		withStyledElements( stylesMapper ),
		...toCompose
	);

export * from './with-colibri-data';
export * from './with-path';
export * from './with-computed';
export * from './why-rerender';
export * from './with-edit';
export * from './with-dynamic-style';
export * from './with-container';
export * from './with-styled-elements';
export * from './with-container';
export * from './with-selected-block';
export * from './with-background';
export * from './with-remove-on-empty-innerblocks';
export * from './with-is-selected';
export * from './with-redirect-selection-to-parent';
export * from './with-refresh-on-tree-change';
export * from './with-context-prop';
export * from './compose-with-kubio-data-and-style';
export * from './with-observe-other-blocks';
export * from './with-display-if-state';
export * from './with-hooks';
export { gutentagCompose };
