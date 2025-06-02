import { useEffect, useMemo, useRef } from '@wordpress/element';
import { generate as generateShortId } from 'shortid';
import { __ } from '@wordpress/i18n';
import { debounce, isFunction, noop } from 'lodash';
import { BACKSPACE, DELETE, F10, isKeyboardEvent } from '@wordpress/keycodes';
import { BaseControl } from '@wordpress/components';

const { wp } = window;

function isTmceEmpty( editor ) {
	// When tinyMce is empty the content seems to be:
	// <p><br data-mce-bogus="1"></p>
	// avoid expensive checks for large documents
	const body = editor.getBody();
	if ( body.childNodes.length > 1 ) {
		return false;
	} else if ( body.childNodes.length === 0 ) {
		return true;
	}
	if ( body.childNodes[ 0 ].childNodes.length > 1 ) {
		return false;
	}
	return /^\n?$/.test( body.innerText || body.textContent );
}

const useInitializeTinyMCE = ( {
	onChange,
	didMount,
	value,
	clientId,
	settings: customSettings = {},
	onTextChange = noop,
} ) => {
	const onChangeRef = useRef( onChange );

	useEffect( () => {
		onChangeRef.current = onChange;
		if ( onTextChange ) {
			onTextChange( value );
		}
	}, [ onChange ] );

	useEffect( () => {
		const { baseURL, suffix } = window.wpEditorL10n?.tinymce;

		didMount.current = true;

		window.tinymce.EditorManager.overrideDefaults( {
			base_url: baseURL,
			suffix,
		} );

		const {
			onInit: onInitCallback,
			onSetup: onSetupCallback,
			...remainingSettings
		} = customSettings;

		function onSetup( editor ) {
			let bookmark;

			if ( value ) {
				editor.on( 'loadContent', () => editor.setContent( value ) );
			}

			editor.on( 'blur', () => {
				bookmark = editor.selection.getBookmark( 2, true );
				// There is an issue with Chrome and the editor.focus call in core at https://core.trac.wordpress.org/browser/trunk/src/js/_enqueues/lib/link.js#L451.
				// This causes a scroll to the top of editor content on return from some content updating dialogs so tracking
				// scroll position until this is fixed in core.
				const scrollContainer = document.querySelector(
					'.interface-interface-skeleton__content'
				);
				const scrollPosition = scrollContainer.scrollTop;

				onChangeRef.current( editor.getContent() );

				editor.once( 'focus', () => {
					if ( bookmark ) {
						editor.selection.moveToBookmark( bookmark );
						if ( scrollContainer.scrollTop !== scrollPosition ) {
							scrollContainer.scrollTop = scrollPosition;
						}
					}
				} );

				return false;
			} );

			editor.on( 'mousedown touchstart', () => {
				bookmark = null;
			} );

			const onTinyMCEChange = () => {
				const nextValue = editor.getContent();

				if ( nextValue !== editor._lastChange ) {
					editor._lastChange = nextValue;
					onChangeRef.current( nextValue );
				}
			};
			editor.on( 'Paste Change input Undo Redo', onTinyMCEChange );

			editor.on( 'keydown', ( event ) => {
				if ( isKeyboardEvent.primary( event, 'z' ) ) {
					// Prevent the gutenberg undo kicking in so TinyMCE undo stack works as expected
					event.stopPropagation();
				}

				if (
					( event.keyCode === BACKSPACE ||
						event.keyCode === DELETE ) &&
					isTmceEmpty( editor )
				) {
					// delete the block
					event.preventDefault();
					event.stopImmediatePropagation();
					onChangeRef.current( editor.getContent() );
				}

				const { altKey } = event;
				/*
				 * Prevent Mousetrap from kicking in: TinyMCE already uses its own
				 * `alt+f10` shortcut to focus its toolbar.
				 */
				if ( altKey && event.keyCode === F10 ) {
					event.stopPropagation();
				}
			} );

			editor.on( 'init', () => {
				const rootNode = editor.getBody();

				rootNode.blur();
				// editor.focus();

				if ( isFunction( onInitCallback ) ) {
					onInitCallback( editor );
				}
			} );

			if ( isFunction( onSetupCallback ) ) {
				onSetupCallback( editor );
			}
		}

		const { settings } = window.wpEditorL10n.tinymce;
		wp.oldEditor.initialize( `editor-${ clientId }`, {
			tinymce: {
				...settings,
				...( remainingSettings || {} ),
				inline: true,
				content_css: false,
				fixed_toolbar_container: `#toolbar-${ clientId }`,
				init_instance_callback( editor ) {
					// This will trick the editor into thinking it was focused
					// without actually focusing it (causing the toolbar to appear)
					editor.fire( 'focus' );
				},
				setup: onSetup,
			},
		} );

		return () => {
			wp.oldEditor.remove( `editor-${ clientId }` );
		};
	}, [] );
};

const TinyMCEControl = ( {
	value,
	onChange,
	label,
	editorSettings = {},
	onTextChange = noop,
} ) => {
	const clientId = useMemo( () => generateShortId(), [] );
	const didMount = useRef( false );

	useEffect( () => {
		if ( ! didMount.current ) {
			return;
		}

		const editor = window.tinymce.get( `editor-${ clientId }` );
		const currentContent = editor?.getContent();

		if ( currentContent !== value ) {
			editor.setContent( value || '' );
		}
	}, [ value ] );

	const focus = () => {
		const editor = window.tinymce.get( `editor-${ clientId }` );
		if ( editor ) {
			editor.focus();
		}
	};

	const blur = ( value ) => {
		if ( onTextChange ) {
			onTextChange();
		}
	};

	const onToolbarKeyDown = ( event ) => {
		// Prevent WritingFlow from kicking in and allow arrows navigation on the toolbar.
		event.stopPropagation();
		// Prevent Mousetrap from moving focus to the top toolbar when pressing `alt+f10` on this block toolbar.
		event.nativeEvent.stopImmediatePropagation();
	};

	const customSettings = useMemo( () => {
		return {
			...editorSettings,
			forced_root_block: '',
			force_br_newlines: true,
			force_p_newlines: false,
		};
	}, [] );

	useInitializeTinyMCE( {
		onChange,
		didMount,
		value,
		clientId,
		settings: customSettings,
		onTextChange,
	} );

	return (
		<BaseControl label={ label } className="kubio-control">
			<div className={ 'kubio-tinymce' }>
				{ /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */ }
				<div
					key="toolbar"
					id={ `toolbar-${ clientId }` }
					className="block-library-classic__toolbar"
					onClick={ focus }
					data-placeholder={ __( 'Classic', 'kubio' ) }
					onKeyDown={ onToolbarKeyDown }
				/>
				<div
					key="editor"
					id={ `editor-${ clientId }` }
					className="wp-block-freeform block-library-rich-text__tinymce"
					onBlur={ blur }
				/>
			</div>
		</BaseControl>
	);
};

export { TinyMCEControl };
