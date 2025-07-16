import { useResizeObserver } from '@kubio/utils';
import { Icon, Popover } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import {
	createPortal,
	useCallback,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { chevronDown } from '@wordpress/icons';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import { isBoolean, noop } from 'lodash';
import { InputControl } from '..';

const filter = ( list, search, keys ) => {
	if ( ! search ) {
		return list;
	}

	const fuse = new Fuse( list, {
		threshold: 0.3,
		ignoreLocation: true,
		// location: 0,
		// distance: 1,
		keys,
	} );

	return fuse.search( search ).map( ( found ) => found.item );
};

export const SuggestionsInput = ( {
	label,
	options,
	optionRender,
	valueRender = null,
	filterKeys = [ 'value', 'label' ],
	onSuggestionClick,
	suggestionsToShow = 10,
	className = '',
	popoverClassName = '',

	//
	value,
	onChange,

	// other input props
	allowSettings,
	allowReset,
	onClick,
	onReset,
	inline = false,
	numeric = false,
	debounceDelay = 300,
	onEnter = noop,
	useDebounce = false,

	searchFilter = true,

	dropdownIcon = true,

	...rest
} ) => {
	const anchor = useRef();
	const popoverContentRef = useRef();
	const popoverID = useInstanceId( SuggestionsInput );
	const [ showSuggestions, setShowSuggestions ] = useState( false );
	const [ searchValue, setSearchValue ] = useState( '' );

	const keysRef = useRef( filterKeys );
	keysRef.current = filterKeys;

	const optionsRef = useRef( options );
	optionsRef.current = options;

	const availableOptions = useMemo( () => {
		const currentOptions = optionsRef.current;
		if ( ! searchValue || ! searchFilter ) {
			return currentOptions;
		}

		const filteredOptions = filter(
			currentOptions,
			searchValue,
			keysRef.current
		);

		return suggestionsToShow
			? filteredOptions.slice( 0, suggestionsToShow )
			: filteredOptions;
	}, [ searchValue, searchFilter, suggestionsToShow ] );

	const { width } = useResizeObserver( anchor.current );

	const onFocus = () => {
		setShowSuggestions( true );
	};

	const onBlur = useCallback( ( event ) => {
		const container = popoverContentRef.current;

		if (
			container &&
			( container.isSameNode( event.relatedTarget ) ||
				container.contains( event.relatedTarget ) )
		) {
			return;
		}

		setSearchValue( '' );
		setShowSuggestions( false );
	}, [] );

	const onFocusOutside = useCallback( ( event ) => {
		const container = popoverContentRef.current;
		const anchorEl = anchor.current;

		if (
			anchorEl &&
			( anchorEl.isSameNode( event.relatedTarget ) ||
				anchorEl.contains( event.relatedTarget ) )
		) {
			return;
		}

		if (
			container &&
			( container.isSameNode( event.relatedTarget ) ||
				container.contains( event.relatedTarget ) )
		) {
			return;
		}

		setSearchValue( '' );
		setShowSuggestions( false );
	}, [] );

	const onClickSuggestion = useCallback(
		( option ) => {
			onSuggestionClick( option, onChange );
			setShowSuggestions( false );
			setSearchValue( '' );
		},
		[ onChange, onSuggestionClick ]
	);

	const onInputChange = useCallback(
		( nextValue ) => {
			onChange( nextValue );
			setSearchValue( nextValue );
			setShowSuggestions( true );
		},
		[ onChange ]
	);

	dropdownIcon = isBoolean( dropdownIcon )
		? !! dropdownIcon && <Icon icon={ chevronDown } />
		: dropdownIcon;

	return (
		<div className="kubio-suggestion-input">
			<InputControl
				className={ classNames( className, {
					'kubio-suggestion-input-with-icon': !! dropdownIcon,
				} ) }
				value={ valueRender ? valueRender( options, value ) : value }
				onChange={ onInputChange }
				ref={ anchor }
				label={ label }
				allowSettings={ allowSettings }
				allowReset={ allowReset }
				onClick={ onClick }
				onReset={ onReset }
				inline={ inline }
				numeric={ numeric }
				debounceDelay={ debounceDelay }
				onEnter={ onEnter }
				useDebounce={ useDebounce }
				onFocus={ onFocus }
				onBlur={ onBlur }
				autoComplete={ 'off' }
				role="presentation"
				{ ...rest }
			/>
			{ dropdownIcon }
			{ createPortal(
				<div className={ 'kubio-input-suggestions-popover-slot' }>
					<Popover.Slot
						name={ `kubio-input-suggestions-popover-${ popoverID }` }
					/>
				</div>,
				document.body
			) }
			{ showSuggestions && !! availableOptions.length && (
				<>
					<Popover
						className={ `kubio-input-suggestions-popover ${ popoverClassName }` }
						__unstableSlotName={ `kubio-input-suggestions-popover-${ popoverID }` }
						anchor={ anchor.current }
						offset={ 10 }
						focusOnMount={ false }
						onFocusOutside={ onFocusOutside }
						ref={ popoverContentRef }
					>
						<div
							className={ `kubio-input-suggestions-wrapper` }
							style={ { width: `${ width - 10 }px` } }
						>
							{ availableOptions.map( ( option, key ) => (
								// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
								<div
									key={ key }
									className={ `kubio-input-suggestions-option` }
									onClick={ () =>
										onClickSuggestion( option )
									}
									tabIndex={ 0 }
									role={ 'button' }
								>
									{ optionRender( option, value ) }
								</div>
							) ) }
						</div>
					</Popover>
				</>
			) }
		</div>
	);
};
