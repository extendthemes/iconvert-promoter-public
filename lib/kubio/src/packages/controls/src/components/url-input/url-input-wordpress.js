import classnames from 'classnames';
import scrollIntoView from 'dom-scroll-into-view';
import { debounce, isFunction, throttle } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	BaseControl,
	Button,
	Popover,
	Spinner,
	withSpokenMessages,
} from '@wordpress/components';
import { compose, withInstanceId, withSafeTimeout } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import {
	Component,
	createRef,
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { DOWN, ENTER, TAB, UP } from '@wordpress/keycodes';
import { isURL } from '@wordpress/url';

// Since URLInput is rendered in the context of other inputs, but should be
// considered a separate modal node, prevent keyboard events from propagating
// as being considered from the input.
const stopEventPropagation = ( event ) => event.stopPropagation();

const Input = forwardRef( ( props, ref ) => {
	const { value, onChange, onFocus, ...rest } = props;

	const [ isFocused, setFocus ] = useState( false );
	const onChangeRef = useRef( onChange );
	const onFocusRef = useRef( onFocus );
	const [ localValue, setLocalValue ] = useState( value );

	useEffect( () => {
		if ( ! isFocused ) {
			setLocalValue( value );
		}
	}, [ isFocused, value ] );

	useEffect( () => {
		onChangeRef.current = debounce( onChange, 300 );
	}, [ onChange ] );

	const onValueChange = useCallback( ( event ) => {
		const nextValue = event.target.value;
		setLocalValue( nextValue );
		onChangeRef.current( nextValue );
	}, [] );

	const onFocusCallback = useCallback( () => {
		setFocus( true );
		onFocusRef.current();
	}, [] );

	const onBlur = useCallback( () => {
		setFocus( false );
	}, [] );

	return (
		<input
			value={ localValue }
			onChange={ onValueChange }
			onFocus={ onFocusCallback }
			onBlur={ onBlur }
			ref={ ref }
			{ ...rest }
		/>
	);
} );

/* eslint-disable jsx-a11y/no-autofocus */
class URLInput extends Component {
	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind( this );
		this.onFocus = this.onFocus.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.selectLink = this.selectLink.bind( this );
		this.handleOnClick = this.handleOnClick.bind( this );
		this.bindSuggestionNode = this.bindSuggestionNode.bind( this );
		this.autocompleteRef = props.autocompleteRef || createRef();
		this.inputRef = createRef();
		this.updateSuggestions = throttle(
			this.updateSuggestions.bind( this ),
			300
		);

		this.suggestionNodes = [];

		this.isUpdatingSuggestions = false;

		this.state = {
			suggestions: [],
			showSuggestions: false,
			selectedSuggestion: null,

			suggestionsListboxId: '',
			suggestionOptionIdPrefix: '',
		};
	}

	componentDidUpdate( prevProps ) {
		const { showSuggestions, selectedSuggestion } = this.state;
		const { value } = this.props;

		// only have to worry about scrolling selected suggestion into view
		// when already expanded
		if (
			showSuggestions &&
			selectedSuggestion !== null &&
			this.suggestionNodes[ selectedSuggestion ] &&
			! this.scrollingIntoView
		) {
			this.scrollingIntoView = true;
			scrollIntoView(
				this.suggestionNodes[ selectedSuggestion ],
				this.autocompleteRef.current,
				{
					onlyScrollIfNeeded: true,
				}
			);

			this.props.setTimeout( () => {
				this.scrollingIntoView = false;
			}, 100 );
		}

		// Only attempt an update on suggestions if the input value has actually changed.
		if (
			prevProps.value !== value &&
			this.shouldShowInitialSuggestions()
		) {
			this.updateSuggestions();
		}
	}

	componentDidMount() {
		if ( this.shouldShowInitialSuggestions() ) {
			this.updateSuggestions();
		}
	}

	componentWillUnmount() {
		delete this.suggestionsRequest;
	}

	bindSuggestionNode( index ) {
		return ( ref ) => {
			this.suggestionNodes[ index ] = ref;
		};
	}

	shouldShowInitialSuggestions() {
		const { suggestions } = this.state;
		const { __experimentalShowInitialSuggestions = false, value } =
			this.props;
		return (
			! this.isUpdatingSuggestions &&
			__experimentalShowInitialSuggestions &&
			! ( value && value.length ) &&
			! ( suggestions && suggestions.length )
		);
	}

	updateSuggestions( value = '' ) {
		const {
			__experimentalFetchLinkSuggestions: fetchLinkSuggestions,
			__experimentalHandleURLSuggestions: handleURLSuggestions,
		} = this.props;

		if ( ! fetchLinkSuggestions ) {
			return;
		}

		const isInitialSuggestions = ! ( value && value.length );

		// Allow a suggestions request if:
		// - the input is focused
		// - there are at least 2 characters in the search input (except manual searches where
		//   search input length is not required to trigger a fetch)
		// - this is a direct entry (eg: a URL)
		const isFocused =
			this.inputRef.current &&
			this.inputRef.current.ownerDocument.activeElement ===
				this.inputRef.current;
		if (
			! isFocused ||
			( ! isInitialSuggestions &&
				( value.length < 2 ||
					( ! handleURLSuggestions && isURL( value ) ) ) )
		) {
			this.closePopover();

			return;
		}

		this.isUpdatingSuggestions = true;

		this.setState( {
			selectedSuggestion: null,
			loading: true,
		} );

		const request = fetchLinkSuggestions( value, {
			isInitialSuggestions,
		} );

		request
			.then( ( suggestions ) => {
				// A fetch Promise doesn't have an abort option. It's mimicked by
				// comparing the request reference in on the instance, which is
				// reset or deleted on subsequent requests or unmounting.
				if ( this.suggestionsRequest !== request ) {
					return;
				}

				this.setState( {
					suggestions,
					loading: false,
					showSuggestions: !! suggestions.length,
				} );

				if ( ! suggestions.length ) {
					this.closePopover();
				}

				if ( !! suggestions.length ) {
					this.props.debouncedSpeak(
						sprintf(
							/* translators: %s: number of results. */
							_n(
								'%d result found, use up and down arrow keys to navigate.',
								'%d results found, use up and down arrow keys to navigate.',
								suggestions.length,
								'kubio'
							),
							suggestions.length
						),
						'assertive'
					);
				} else {
					this.props.debouncedSpeak(
						__( 'No results.', 'kubio' ),
						'assertive'
					);
				}
				this.isUpdatingSuggestions = false;
			} )
			.catch( () => {
				if ( this.suggestionsRequest === request ) {
					this.setState( {
						loading: false,
					} );
					this.isUpdatingSuggestions = false;
				}
			} );

		// Note that this assignment is handled *before* the async search request
		// as a Promise always resolves on the next tick of the event loop.
		this.suggestionsRequest = request;
	}

	onChange( inputValue ) {
		this.props.onChange( inputValue );
		if ( ! this.props.disableSuggestions ) {
			this.updateSuggestions( inputValue.trim() );
		}
	}

	onFocus() {
		const { suggestions } = this.state;
		const { disableSuggestions, value } = this.props;

		// When opening the link editor, if there's a value present, we want to load the suggestions pane with the results for this input search value
		// Don't re-run the suggestions on focus if there are already suggestions present (prevents searching again when tabbing between the input and buttons)
		if (
			value &&
			! disableSuggestions &&
			! this.isUpdatingSuggestions &&
			! ( suggestions && suggestions.length )
		) {
			// Ensure the suggestions are updated with the current input value
			this.updateSuggestions( value.trim() );
		}
	}

	onKeyDown( event ) {
		const { showSuggestions, selectedSuggestion, suggestions, loading } =
			this.state;

		// If the suggestions are not shown or loading, we shouldn't handle the arrow keys
		// We shouldn't preventDefault to allow block arrow keys navigation
		if ( ! showSuggestions || ! suggestions.length || loading ) {
			// In the Windows version of Firefox the up and down arrows don't move the caret
			// within an input field like they do for Mac Firefox/Chrome/Safari. This causes
			// a form of focus trapping that is disruptive to the user experience. This disruption
			// only happens if the caret is not in the first or last position in the text input.
			// See: https://github.com/WordPress/gutenberg/issues/5693#issuecomment-436684747
			switch ( event.keyCode ) {
				// When UP is pressed, if the caret is at the start of the text, move it to the 0
				// position.
				case UP: {
					if ( 0 !== event.target.selectionStart ) {
						event.stopPropagation();
						event.preventDefault();

						// Set the input caret to position 0
						event.target.setSelectionRange( 0, 0 );
					}
					break;
				}
				// When DOWN is pressed, if the caret is not at the end of the text, move it to the
				// last position.
				case DOWN: {
					if (
						this.props.value.length !== event.target.selectionStart
					) {
						event.stopPropagation();
						event.preventDefault();

						// Set the input caret to the last position
						event.target.setSelectionRange(
							this.props.value.length,
							this.props.value.length
						);
					}
					break;
				}
			}

			return;
		}

		const suggestion =
			this.state.suggestions[ this.state.selectedSuggestion ];

		switch ( event.keyCode ) {
			case UP: {
				event.stopPropagation();
				event.preventDefault();
				const previousIndex = ! selectedSuggestion
					? suggestions.length - 1
					: selectedSuggestion - 1;
				this.setState( {
					selectedSuggestion: previousIndex,
				} );
				break;
			}
			case DOWN: {
				event.stopPropagation();
				event.preventDefault();
				const nextIndex =
					selectedSuggestion === null ||
					selectedSuggestion === suggestions.length - 1
						? 0
						: selectedSuggestion + 1;
				this.setState( {
					selectedSuggestion: nextIndex,
				} );
				break;
			}
			case TAB: {
				if ( this.state.selectedSuggestion !== null ) {
					this.selectLink( suggestion );
					// Announce a link has been selected when tabbing away from the input field.
					this.props.speak( __( 'Link selected.', 'kubio' ) );
				}
				break;
			}
			case ENTER: {
				if ( this.state.selectedSuggestion !== null ) {
					event.stopPropagation();
					this.selectLink( suggestion );
				} else {
					this.closePopover();
				}
				break;
			}
		}
	}

	selectLink( suggestion ) {
		this.inputRef.current.value = suggestion.url;
		this.props.onChange( suggestion.url, suggestion );
		this.closePopover();
	}

	handleOnClick( suggestion ) {
		this.selectLink( suggestion );
	}

	static getDerivedStateFromProps(
		{
			value,
			instanceId,
			disableSuggestions,
			__experimentalShowInitialSuggestions = false,
		},
		{ showSuggestions }
	) {
		let shouldShowSuggestions = showSuggestions;

		const hasValue = value && value.length;

		if ( ! __experimentalShowInitialSuggestions && ! hasValue ) {
			shouldShowSuggestions = false;
		}

		if ( disableSuggestions === true ) {
			shouldShowSuggestions = false;
		}

		return {
			showSuggestions: shouldShowSuggestions,
			suggestionsListboxId: `block-editor-url-input-suggestions-${ instanceId }`,
			suggestionOptionIdPrefix: `block-editor-url-input-suggestion-${ instanceId }`,
		};
	}

	render() {
		return (
			<>
				{ this.renderControl() }
				{ this.renderSuggestions() }
			</>
		);
	}

	renderControl() {
		const {
			label,
			className,
			isFullWidth,
			instanceId,
			placeholder = __( 'Paste URL or type to search', 'kubio' ),
			__experimentalRenderControl: renderControl,
			value = '',
			autoFocus = true,
		} = this.props;

		const {
			loading,
			showSuggestions,
			selectedSuggestion,
			suggestionsListboxId,
			suggestionOptionIdPrefix,
		} = this.state;

		const controlProps = {
			id: `url-input-control-${ instanceId }`,
			label,
			className: classnames( 'block-editor-url-input', className, {
				'is-full-width': isFullWidth,
			} ),
		};

		const inputProps = {
			value,
			required: true,
			autoFocus,
			className: 'block-editor-url-input__input',
			type: 'text',
			onChange: this.onChange,
			onFocus: this.onFocus,
			onInput: stopEventPropagation,
			placeholder,
			onKeyDown: this.onKeyDown,
			role: 'combobox',
			'aria-label': __( 'URL', 'kubio' ),
			'aria-expanded': showSuggestions,
			'aria-autocomplete': 'list',
			'aria-owns': suggestionsListboxId,
			'aria-activedescendant':
				selectedSuggestion !== null
					? `${ suggestionOptionIdPrefix }-${ selectedSuggestion }`
					: undefined,
			ref: this.inputRef,
		};

		if ( renderControl ) {
			return renderControl( controlProps, inputProps, loading );
		}

		return (
			<BaseControl { ...controlProps }>
				<Input { ...inputProps } />
				{ loading && <Spinner /> }
			</BaseControl>
		);
	}

	closePopover = () => {
		this.setState( {
			showSuggestions: false,
			selectedSuggestion: null,
			loading: false,
		} );
	};

	renderSuggestions() {
		const {
			className,
			__experimentalRenderSuggestions: renderSuggestions,
			value = '',
			__experimentalShowInitialSuggestions = false,
		} = this.props;

		// skip suggestions if the value starts with a link protocol
		if ( /^([a-z]+:)?\/\//.test( value ) ) {
			return null;
		}

		const {
			showSuggestions,
			suggestions,
			selectedSuggestion,
			suggestionsListboxId,
			suggestionOptionIdPrefix,
			loading,
		} = this.state;

		const suggestionsListProps = {
			id: suggestionsListboxId,
			ref: this.autocompleteRef,
			role: 'listbox',
		};

		const buildSuggestionItemProps = ( suggestion, index ) => {
			return {
				role: 'option',
				tabIndex: '-1',
				id: `${ suggestionOptionIdPrefix }-${ index }`,
				ref: this.bindSuggestionNode( index ),
				'aria-selected': index === selectedSuggestion,
			};
		};

		if (
			isFunction( renderSuggestions ) &&
			showSuggestions &&
			!! suggestions.length
		) {
			return renderSuggestions( {
				suggestions,
				selectedSuggestion,
				closePopover: this.closePopover,
				suggestionsListProps,
				buildSuggestionItemProps,
				isLoading: loading,
				inputRef: this.inputRef,
				handleSuggestionClick: this.handleOnClick,
				isInitialSuggestions:
					__experimentalShowInitialSuggestions &&
					! ( value && value.length ),
			} );
		}

		if (
			! isFunction( renderSuggestions ) &&
			showSuggestions &&
			!! suggestions.length
		) {
			return (
				<Popover position="bottom" noArrow focusOnMount={ false }>
					<div
						{ ...suggestionsListProps }
						className={ classnames(
							'block-editor-url-input__suggestions',
							`${ className }__suggestions`
						) }
					>
						{ suggestions.map( ( suggestion, index ) => (
							<Button
								{ ...buildSuggestionItemProps(
									suggestion,
									index
								) }
								key={ suggestion.id }
								className={ classnames(
									'block-editor-url-input__suggestion',
									{
										'is-selected':
											index === selectedSuggestion,
									}
								) }
								onClick={ () =>
									this.handleOnClick( suggestion )
								}
							>
								{ suggestion.title }
							</Button>
						) ) }
					</div>
				</Popover>
			);
		}
		return null;
	}
}
/* eslint-enable jsx-a11y/no-autofocus */

/**
 * @see https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/url-input/README.md
 */
export default compose(
	withSafeTimeout,
	withSpokenMessages,
	withInstanceId,
	withSelect( ( select, props ) => {
		// If a link suggestions handler is already provided then
		// bail
		if ( isFunction( props.__experimentalFetchLinkSuggestions ) ) {
			return;
		}
		const { getSettings } = select( 'core/block-editor' );
		return {
			__experimentalFetchLinkSuggestions:
				getSettings().__experimentalFetchLinkSuggestions,
		};
	} )
)( URLInput );
