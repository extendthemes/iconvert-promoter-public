import { useEditorIsLoadedChanged } from '@kubio/editor-data';
import {
	BlockTools,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseResizeCanvas as useResizeCanvas,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__unstableUseTypingObserver as useTypingObserver,
} from '@wordpress/block-editor';
import { pure, useMergeRefs } from '@wordpress/compose';
import { useRef } from '@wordpress/element';
import { KubioBlinkingLogoIframe } from '../kubio-blinking-logo';

let addReadyClassesTo;
const addReadyClassesToDocument = ( ownerDoc, isLoaded ) => {
	if ( ownerDoc ) {
		ownerDoc
			.querySelector( '#kubio-editor-view' )
			?.classList?.remove( 'device-change-animation' );
		if ( isLoaded ) {
			addReadyClassesTo = ownerDoc.defaultView.setTimeout( () => {
				ownerDoc.body.classList.add( 'kubio-iframe-holder--show' );
				ownerDoc.body.classList.remove( 'kubio-iframe-holder--hide' );
				ownerDoc.body.classList.remove( 'h-ui-disable-transitions' );
			}, 100 );
		} else {
			ownerDoc.defaultView.clearTimeout( addReadyClassesTo );
			ownerDoc.body.classList.remove( 'kubio-iframe-holder--show' );
			ownerDoc.body.classList.add( 'kubio-iframe-holder--hide' );
			ownerDoc.body.classList.add( 'h-ui-disable-transitions' );
		}
	}
};

const IframeWrapper = pure( ( { iframe, deviceType } ) => {
	const resizedCanvasStyles = useResizeCanvas( deviceType, true );
	const contentRef = useRef();
	const editorViewRef = useRef();
	const iframeHolder = useRef();
	const mergedRefs = useMergeRefs( [ contentRef, useTypingObserver() ] );

	useEditorIsLoadedChanged( ( isLoaded ) => {
		addReadyClassesToDocument(
			iframeHolder.current?.ownerDocument,
			isLoaded
		);
		addReadyClassesToDocument(
			contentRef.current?.ownerDocument,
			isLoaded
		);
	} );

	return (
		<>
			<BlockTools
				className={ 'kubio-block-tools' }
				__unstableContentRef={ contentRef }
			>
				<div id={ 'kubio-editor-view' } ref={ editorViewRef }>
					<div
						id={ 'kubio-iframe-holder' }
						className={
							'editor-styles-wrapper edit-site-block-editor__editor-styles-wrapper'
						}
						style={ resizedCanvasStyles }
						ref={ iframeHolder }
					>
						{ iframe( mergedRefs ) }
					</div>
					<KubioBlinkingLogoIframe key={ 'kubio-blinking-iframe' } />
				</div>
			</BlockTools>
		</>
	);
} );

export { IframeWrapper };
