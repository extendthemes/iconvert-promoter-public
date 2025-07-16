import { useGlobalSessionProp } from '@kubio/editor-data';
import { hasKubioSupport } from '@kubio/utils';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect, useMemo } from '@wordpress/element';
import { OwnerDocumentContext } from '../../context';
import { useOwnerDocumentContext } from '../../context/owner-document-context';
import { useRootElementContext } from './root-element';
import { useRegistry } from '@wordpress/data';

const OwnerDocumentContextProvider = ( { BlockListBlock, ...props } ) => {
	const [ globalOwnerDocument, setStoreOwnerDocument ] = useGlobalSessionProp(
		'blocksOwnerDocument'
	);

	const element = useRootElementContext();
	const ownerDocument = element?.ownerDocument;

	const { ownerDocument: inheritedOwnerDocument } = useOwnerDocumentContext();
	const registry = useRegistry();
	const settings = registry.select( 'core/block-editor' ).getSettings();

	const contextValue = useMemo(
		() => ( {
			ownerDocument,
		} ),
		[ ownerDocument ]
	);

	useEffect( () => {
		if ( settings.__unstableIsPreviewMode ) {
			return;
		}

		if ( ownerDocument && ownerDocument !== globalOwnerDocument ) {
			setStoreOwnerDocument( ownerDocument );
		}
	}, [
		globalOwnerDocument,
		ownerDocument,
		props.name,
		setStoreOwnerDocument,
		settings.__unstableIsPreviewMode,
	] );

	if ( ! ownerDocument || inheritedOwnerDocument ) {
		return <BlockListBlock { ...props } />;
	}

	return (
		<>
			<OwnerDocumentContext.Provider value={ contextValue }>
				<BlockListBlock { ...props } />
			</OwnerDocumentContext.Provider>
		</>
	);
};

const BlockListBlockOwnerDocument = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if ( ! hasKubioSupport( props.name ) ) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<OwnerDocumentContextProvider
					BlockListBlock={ BlockListBlock }
					{ ...props }
				/>
			);
		};
	},
	'BlockListBlockOwnerDocument'
);

export { BlockListBlockOwnerDocument };
