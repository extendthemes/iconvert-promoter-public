import { hasKubioSupport } from '@kubio/utils';
import { BlockList } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';

const rootElementContext = createContext( null );

const elementContext =
	BlockList?.__unstableElementContext || rootElementContext;

const hasGutenbergElementContext = !! BlockList?.__unstableElementContext;

const useRootElementContext = () => {
	return useContext( elementContext );
};

const KubioRootElementProvider = ( { BlockListBlock, ...props } ) => {
	const [ rootElement, setRootElement ] = useState();
	const ref = useRef();

	useEffect( () => {
		const root = ref.current?.closest( '.is-root-container' );
		if ( root ) {
			setRootElement( root );
		}
	}, [] );

	return (
		<>
			{ ! hasGutenbergElementContext && ! rootElement && (
				<style ref={ ref }></style>
			) }
			<rootElementContext.Provider value={ rootElement }>
				<BlockListBlock { ...props } />
			</rootElementContext.Provider>
		</>
	);
};

const withRootElement = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( ! hasKubioSupport( props.name ) ) {
			return <BlockListBlock { ...props } />;
		}

		return (
			<KubioRootElementProvider
				BlockListBlock={ BlockListBlock }
				{ ...props }
			/>
		);
	};
}, 'withRootElement' );

export { useRootElementContext, withRootElement };
