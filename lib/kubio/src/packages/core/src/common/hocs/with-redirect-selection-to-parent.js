import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import _, { isFunction } from 'lodash';
import { useOwnerDocumentContext } from '../..';

const withRedirectSelectionToParentCondition = (
	parentBlocks = [],
	{ skipKubioEditorCheck = false } = {}
) => {
	return createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { clientId, isSelected } = ownProps;
			const parentClientId = useSelect(
				( select ) =>
					select( blockEditorStore.name ).getBlockRootClientId(
						clientId
					),
				[ clientId ]
			);
			const { getBlocksByClientId } = useSelect( ( select ) =>
				select( blockEditorStore.name )
			);
			const { selectBlock } = useDispatch( blockEditorStore.name );
			let parentBlockType = getBlocksByClientId( parentClientId );
			parentBlockType = _.get( parentBlockType, '0.name' );
			const parentBlockTypeFound =
				parentBlocks.includes( parentBlockType );
			const { ownerDocument } = useOwnerDocumentContext();

			const disableRedirection =
				! window.isKubioBlockEditor && ! skipKubioEditorCheck;

			// disable hover / selected style
			useEffect( () => {
				// do nothing outside kubio editor
				if (
					! parentBlockTypeFound ||
					disableRedirection ||
					! ownerDocument
				) {
					return;
				}

				const style = ownerDocument.createElement( 'style' );
				style.textContent = `[data-block="${ clientId }"]:after { display:none !important }`;
				ownerDocument.head.appendChild( style );
				return () => style.remove();
			}, [ ownerDocument ] );

			useEffect( () => {
				if ( disableRedirection || ! ownerDocument ) {
					return;
				}

				if ( isSelected && parentBlockTypeFound ) {
					selectBlock( parentClientId );
				}
			}, [ isSelected, parentBlockTypeFound, ownerDocument ] );

			return (
				<WrappedComponent
					{ ...ownProps }
					kubioShouldRedirectToParent={ parentBlockTypeFound }
				/>
			);
		},
		'withRedirectSelectionToParentCondition'
	);
};

const withRedirectSelectionToParent = ( {
	skipKubioEditorCheck = false,
	shouldIgnore = null,
} = {} ) => {
	return createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { clientId, isSelected } = ownProps;

			const { parentClientId, currentBlock } = useSelect(
				( select ) => {
					const { getBlockRootClientId, getBlock } = select(
						blockEditorStore.name
					);

					return {
						parentClientId: getBlockRootClientId( clientId ),
						currentBlock: getBlock( clientId ),
					};
				},
				[ clientId ]
			);
			const { selectBlock } = useDispatch( blockEditorStore.name );
			const { ownerDocument } = useOwnerDocumentContext();

			const disableRedirection =
				! window.isKubioBlockEditor && ! skipKubioEditorCheck;

			useEffect( () => {
				if (
					isFunction( shouldIgnore ) &&
					shouldIgnore( currentBlock, ownProps )
				) {
					return;
				}

				if ( disableRedirection ) {
					return;
				}

				if ( isSelected ) {
					selectBlock( parentClientId );
				}
			}, [
				isSelected,
				currentBlock,
				ownProps,
				disableRedirection,
				selectBlock,
				parentClientId,
			] );

			useEffect( () => {
				if ( disableRedirection || ! ownerDocument ) {
					return;
				}

				const style = ownerDocument.createElement( 'style' );
				style.textContent = `[data-block="${ clientId }"]:after { display:none !important }`;
				ownerDocument.head.appendChild( style );
				return () => style.remove();
			}, [ ownerDocument ] );

			return (
				<WrappedComponent
					{ ...ownProps }
					kubioShouldRedirectToParent={ true }
				/>
			);
		},
		'withRedirectSelectionToParent'
	);
};
export {
	withRedirectSelectionToParentCondition,
	withRedirectSelectionToParent,
};
