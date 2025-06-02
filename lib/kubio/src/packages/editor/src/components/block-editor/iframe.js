import { STORE_KEY } from '@kubio/constants';
import { OwnerDocumentContext } from '@kubio/core';
import {
	useCurrentPageBodyClasses,
	useGetGlobalSessionProp,
	useGlobalSessionProp,
	useSetGlobalSessionProp,
} from '@kubio/editor-data';
import { removeStyleManager } from '@kubio/style-manager';
import { useMergeRefs } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import {
	createPortal,
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { each, noop, uniq } from 'lodash';
const BODY_CLASS_NAME = 'editor-styles-wrapper';
const BLOCK_PREFIX = 'wp-block';
const CLASSIC_GUTENBERG_STYLE_ID = 'wp-editor-classic-layout-styles';

/**
 * Clones stylesheets targetting the editor canvas to the given document. A
 * stylesheet is considered targetting the editor a canvas if it contains the
 * `editor-styles-wrapper`, `wp-block`, or `wp-block-*` class selectors.
 *
 * Ideally, this hook should be removed in the future and styles should be added
 * explicitly as editor styles.
 *
 * @param {Document} doc The document to append cloned stylesheets to.
 */
function styleSheetsCompat( doc ) {
	// Search the document for stylesheets targetting the editor canvas.
	const usedNodes = new Map();
	Array.from( document.styleSheets ).forEach( ( styleSheet ) => {
		try {
			// May fail for external styles.
			// eslint-disable-next-line no-unused-expressions
			styleSheet.cssRules;
		} catch ( e ) {
			return;
		}

		const { ownerNode, cssRules } = styleSheet;

		if ( ! cssRules ) {
			return;
		}

		const isMatch = Array.from( cssRules ).find(
			( { selectorText } ) =>
				selectorText &&
				( selectorText.includes( `.${ BODY_CLASS_NAME }` ) ||
					selectorText.includes( `.${ BLOCK_PREFIX }` ) )
		);

		if ( isMatch && ! usedNodes.has( ownerNode ) ) {
			// place the classic gutenberg style on top of other styles
			if (
				( ownerNode.id &&
					ownerNode.id.indexOf( CLASSIC_GUTENBERG_STYLE_ID ) !==
						-1 ) ||
				( ownerNode.href &&
					ownerNode.href.indexOf( CLASSIC_GUTENBERG_STYLE_ID ) !==
						-1 )
			) {
				doc.head.prepend( ownerNode.cloneNode( true ) );
			} else {
				doc.head.appendChild( ownerNode.cloneNode( true ) );
			}

			usedNodes.set( ownerNode, true );
		}
	} );
}

const handleSelectAll = ( contentEditable, event ) => {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();

	if ( contentEditable ) {
		contentEditable.ownerDocument.execCommand( 'selectAll', false, null );
	}

	return false;
};

/**
 * Bubbles some event types (keydown, keypress, and dragover) to parent document
 * document to ensure that the keyboard shortcuts and drag and drop work.
 *
 * Ideally, we should remove event bubbling in the future. Keyboard shortcuts
 * should be context dependent, e.g. actions on blocks like Cmd+A should not
 * work globally outside the block editor.
 *
 * @param {Document} doc Document to attach listeners to.
 */
function bubbleEvents( doc ) {
	const { defaultView } = doc;
	const { frameElement } = defaultView;

	function bubbleEvent( event ) {
		const { keyCode, ctrlKey, metaKey } = event;
		// handle
		if ( ( keyCode === 65 || keyCode === 95 ) && ( ctrlKey || metaKey ) ) {
			const contentEditable = event.target.hasAttribute(
				'contenteditable'
			)
				? event.target
				: event.target.closest( '[contenteditable]' );
			if ( contentEditable ) {
				return handleSelectAll( contentEditable, event );
			}
		}

		const prototype = Object.getPrototypeOf( event );
		const constructorName = prototype.constructor.name;
		const Constructor = window[ constructorName ];

		const init = {};

		for ( const key in event ) {
			init[ key ] = event[ key ];
		}

		if ( event instanceof defaultView.MouseEvent ) {
			const rect = frameElement.getBoundingClientRect();
			init.clientX += rect.left;
			init.clientY += rect.top;
		}

		const newEvent = new Constructor( event.type, init );
		newEvent.iframeEvent = true;
		const cancelled = ! frameElement.dispatchEvent( newEvent );

		if ( cancelled ) {
			event.preventDefault();
		}
	}

	const eventTypes = [ 'keydown', 'keypress', 'dragover' ];

	for ( const name of eventTypes ) {
		doc.addEventListener( name, bubbleEvent );
	}
}

/**
 * Sets the document head and default styles.
 *
 * @param {Document} doc  Document to set the head for.
 * @param {string}   head HTML to set as the head.
 */
function setHead( doc, head ) {
	doc.head.innerHTML =
		// Body margin must be overridable by themes.
		`<style>/* head style start */</style>` +
		head +
		`<style>/* head style end */</style>` +
		'<style>*{scroll-behavior:  auto !important; } html#kubio {height:auto!important; margin-top:initial !important}</style>' +
		doc.head.innerHTML;
}

/**
 *
 * @param {Document} document
 */
const resetCSSVarsOnKubioTemplated = ( document ) => {
	let style = document.querySelector( '.kubio-block-vars-reset' );
	if ( ! style ) {
		style = document.createElement( 'style' );
		style.classList.add( 'kubio-block-vars-reset' );
		style.textContent = `
		:root,
		body,
		body *,
		.editor-styles-wrapper .block-editor-block-list__layout.is-root-container > *
		{
			--wp--style--block-gap:0px;
			--gallery-block--gutter-size:0.5em;
			--global-content-width: unset;
		}`;
		document.head.appendChild( style );
	}
};

const removeKubioCSSVarsReset = ( document ) => {
	const style = document.querySelector( '.kubio-block-vars-reset' );
	if ( style ) {
		style?.remove?.();
	}
};

const addEventPreventDefault = ( node ) => {
	// avoid preventing form submission in table block.
	if ( node.nodeName === 'BUTTON' ) {
		const formClassesToPreventSubmit = [
			//forminator
			'forminator-ui',
			//contact form 7
			'wpcf7-form ',
			//wpforms
			'wpforms-form',
			//mailchimp
			'mc4wp-form',
		];
		const form = node.closest( 'form' );
		const preventFormSubmit = formClassesToPreventSubmit.some(
			( formClass ) => form?.classList?.contains( formClass )
		);
		if ( form && ! form.getAttribute( 'action' ) && ! preventFormSubmit ) {
			return;
		}
	}

	node.addEventListener( 'click', ( event ) => {
		event.preventDefault();
	} );
};

function IframeComponent(
	{
		contentRef,
		children,
		head,
		headHTML,
		contentHolderSelector,
		assetsHolderSelector,
		src,
		onLoad = noop,
		execStylesheetCompat = true,
		...props
	},
	ref
) {
	const [ iframeDocument, setIframeDocument ] = useState();
	const [ contentContainer, setContentContainer ] = useState();
	const bodyClasses = useCurrentPageBodyClasses();
	const setEditorOwnerDocument = useSetGlobalSessionProp( 'ownerDocument' );
	const setBlockEditorRootClasses = useSetGlobalSessionProp(
		'blockEditorRootClasses',
		''
	);

	const innerRef = useRef();

	const isReady = useGetGlobalSessionProp( 'ready', false );

	const { currentTemplateSource, kubioThemesBaseURL } = useSelect(
		( select ) => {
			const { getCurrentKubioTemplateSource, getSettings } =
				select( STORE_KEY );

			return {
				currentTemplateSource: getCurrentKubioTemplateSource(),
				kubioThemesBaseURL: getSettings().kubioThemesBaseURL,
			};
		},
		[]
	);

	useEffect( () => {
		if ( ! isReady && src ) {
			setIframeDocument( null );
			setContentContainer( null );
			setEditorOwnerDocument( window.document );
			removeStyleManager( iframeDocument );
		}
	}, [ src, isReady, setEditorOwnerDocument, iframeDocument ] );

	useEffect( () => {
		if ( ! isReady || ! iframeDocument ) {
			return;
		}

		const editorStylesDisabled = isReady && src && iframeDocument;

		if ( [ 'kubio-custom', 'kubio' ].includes( currentTemplateSource ) ) {
			resetCSSVarsOnKubioTemplated( iframeDocument );
		} else {
			removeKubioCSSVarsReset( iframeDocument );
		}

		const stylesToRemove = [
			'wp-reset-editor-styles-css',
			'wp-editor-classic-layout-styles-css',
			'common-css',
			'forms-css',
		];

		iframeDocument
			.querySelectorAll(
				stylesToRemove.map(
					( styleToRemove ) => `link#${ styleToRemove }`
				)
			)
			.forEach( ( style ) => {
				if ( style.sheet ) {
					style.sheet.disabled = editorStylesDisabled;
				}
			} );
	}, [
		isReady,
		src,
		currentTemplateSource,
		iframeDocument,
		kubioThemesBaseURL,
	] );

	useEffect( () => {
		if ( iframeDocument && bodyClasses.length ) {
			const classes = Array.from( iframeDocument.body.classList );
			iframeDocument.body.setAttribute(
				'class',
				uniq( classes.concat( bodyClasses ) ).join( ' ' )
			);
		}
	}, [ iframeDocument, bodyClasses ] );

	const [ , setOwnerDocument ] = useGlobalSessionProp(
		'blocksOwnerDocument',
		null,
		[]
	);

	const [ , setCurrentPageHasBlockContent ] = useGlobalSessionProp(
		'currentPageHasBlocksContent',
		null,
		[]
	);

	const setRef = useCallback( ( node ) => {
		if ( ! node ) {
			return;
		}

		node.contentDocument.body.parentElement.className = 'kubio-iframe';

		function setDocumentIfReady() {
			const { contentDocument } = node;
			const { readyState, body } = contentDocument;

			if ( readyState !== 'complete' ) {
				return false;
			}

			if ( typeof contentRef === 'function' ) {
				contentRef( body );
			} else if ( contentRef ) {
				contentRef.current = body;
			}
			const preventDefaultSelectors = [
				'a',
				'[type="submit"]',
				'form button',
			];

			const mutationObserver =
				new contentDocument.defaultView.MutationObserver( function (
					mutations
				) {
					each( mutations, function ( mutation ) {
						mutation.target
							.querySelectorAll(
								preventDefaultSelectors.join( ',' )
							)
							.forEach( addEventPreventDefault );
					} );
				} );

			mutationObserver.observe( contentDocument, {
				childList: true,
				subtree: true,
			} );

			contentDocument
				.querySelectorAll( preventDefaultSelectors.join( ',' ) )
				.forEach( addEventPreventDefault );

			if ( execStylesheetCompat ) {
				styleSheetsCompat( contentDocument );
			}

			contentDocument.defaultView.isKubioBlockEditor = true;
			contentDocument.defaultView.isInsideIframe = true;
			contentDocument.defaultView.requestIdleCallback =
				contentDocument.defaultView.requestIdleCallback ||
				function ( cb ) {
					const start = Date.now();
					// eslint-disable-next-line @wordpress/react-no-unsafe-timeout
					return setTimeout( function () {
						cb( {
							didTimeout: false,
							timeRemaining() {
								return Math.max(
									0,
									50 - ( Date.now() - start )
								);
							},
						} );
					}, 1 );
				};

			contentDocument.defaultView.cancelIdleCallback =
				contentDocument.defaultView.cancelIdleCallback ||
				function ( id ) {
					clearTimeout( id );
				};

			setHead( contentDocument, headHTML );
			bubbleEvents( contentDocument );
			setIframeDocument( contentDocument );
			setEditorOwnerDocument( contentDocument );

			let container =
				contentHolderSelector &&
				contentDocument.querySelector( contentHolderSelector );

			let blockEditorRootClasses = '';
			if ( contentHolderSelector && container ) {
				const containerParent = container.parentElement;
				// use the container parent if it has only the container inside
				if ( containerParent.children.length === 1 ) {
					container.remove();
					container = containerParent;
				}

				blockEditorRootClasses = container.getAttribute( 'class' );

				container.setAttribute(
					'class',
					'kubio-hybrid-template-content-edit'
				);
			}

			setBlockEditorRootClasses( blockEditorRootClasses );

			let contentHolder = contentDocument.body;
			if ( container ) {
				contentHolder = container;
				setCurrentPageHasBlockContent( true );
			} else if ( src || contentHolderSelector ) {
				contentHolder.classList.add( 'kubio-hybrid-no-block-content' );
				setCurrentPageHasBlockContent( false );
			}

			contentHolder.classList.add( BODY_CLASS_NAME );
			contentHolder.classList.add( 'wp-embed-responsive' );

			onLoad( node, contentDocument /* , oldContainer */ );

			setContentContainer( contentHolder );
			setOwnerDocument( contentDocument );

			return true;
		}

		if ( src ) {
			node.addEventListener( 'load', () => {
				setDocumentIfReady();
			} );

			return;
		}

		if ( setDocumentIfReady() ) {
			return;
		}

		// Document is not immediately loaded in Firefox.
		node.addEventListener( 'load', () => {
			setDocumentIfReady();
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const assetsContainer = useMemo( () => {
		if ( ! iframeDocument ) {
			return false;
		}

		const container_ =
			assetsHolderSelector &&
			iframeDocument.querySelector( assetsHolderSelector );

		return container_ || iframeDocument.head;
	}, [ assetsHolderSelector, iframeDocument ] );

	const contextDoc = useMemo(
		() => ( {
			ownerDocument: iframeDocument || window.document,
		} ),
		[ iframeDocument ]
	);

	return (
		<OwnerDocumentContext.Provider value={ contextDoc }>
			<iframe
				{ ...props }
				ref={ useMergeRefs( [ ref, setRef, innerRef ] ) }
				tabIndex="0"
				title={ __( 'Editor canvas', 'kubio' ) }
				className="kubio-iframe"
				name="editor-canvas"
				src={ src }
			>
				{ contentContainer &&
					createPortal( children, contentContainer ) }
				{ assetsContainer && createPortal( head, assetsContainer ) }
			</iframe>
		</OwnerDocumentContext.Provider>
	);
}

const Iframe = forwardRef( IframeComponent );

export { Iframe };
