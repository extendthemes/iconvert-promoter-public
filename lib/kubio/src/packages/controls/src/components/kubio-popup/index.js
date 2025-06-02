import { Popover } from '@wordpress/components';
import {
	useCallback,
	useRef,
	useState,
	useEffect,
	useImperativeHandle,
	forwardRef,
} from '@wordpress/element';
import { useOnClickOutside } from '@kubio/utils';
import _ from 'lodash';
import { useInstanceId } from '@wordpress/compose';
import classnames from 'classnames';
import {
	PopupNestingContextProvider,
	usePopupNestingContext,
} from '@kubio/core';

function KubioPopup_(
	{
		children,
		buttonRef,
		onClose: afterClose = _.noop,
		onOpen: afterOpen = _.noop,
		selectorToIgnoreOnClickOutside = null,
		anchorRef = null,
		className,
		...props
	},
	ref
) {
	const [ isVisible, toggleVisibility ] = useState( false );
	const popupAnchorRef = anchorRef?.current;
	const popperRef = useRef();
	const instanceIdClass = useInstanceId( KubioPopup_, 'kubio-popup' );

	const classes = classnames( className, instanceIdClass, 'kubio-popup' );

	const { instanceClassesWithChildrenSelector, contextProvider } =
		usePopupNestingContext( instanceIdClass );

	const onOpen = useCallback( () => {
		toggleVisibility( true );
	}, [ toggleVisibility ] );

	useImperativeHandle( ref, () => ( {
		close: () => {
			toggleVisibility( false );
		},
		toggle: ( newValue ) => {
			toggleVisibility( newValue );
		},
	} ) );

	const onClose = useCallback(
		( event ) => {
			const target = event?.target;

			//if the user clicked on the button ref let the button onClick handle the open/close logic so the popover
			//does not change visibility from two places. This can lead to unexpected behaviour like clicking on the button
			//only opening the popup.
			const clickedPopper =
				target && target.closest( instanceClassesWithChildrenSelector );

			if (
				buttonRef?.current &&
				target &&
				( buttonRef.current.contains( target ) || clickedPopper )
			) {
				return;
			}
			if (
				selectorToIgnoreOnClickOutside &&
				target?.closest( selectorToIgnoreOnClickOutside )
			) {
				return;
			}
			toggleVisibility( false );
		},
		[
			toggleVisibility,
			buttonRef?.current,
			afterClose,
			instanceClassesWithChildrenSelector,
		]
	);

	useOnClickOutside( popperRef, onClose );

	const handleButtonClick = useCallback( () => {
		if ( isVisible ) {
			onClose();
		} else {
			onOpen();
		}
	}, [ isVisible, onOpen, onClose ] );

	//callback to tell parent the state of popup visibility
	useEffect( () => {
		if ( isVisible ) {
			afterOpen();
		} else {
			afterClose();
		}
	}, [ isVisible ] );
	useEffect( () => {
		const node = buttonRef?.current;
		if ( node ) {
			node.addEventListener( 'click', handleButtonClick );
		}

		return () => {
			const node = buttonRef?.current;
			if ( node ) {
				node.removeEventListener( 'click', handleButtonClick );
			}
		};
	}, [ buttonRef?.current, handleButtonClick ] );

	return (
		<>
			{ isVisible && (
				<Popover
					{ ...props }
					anchorRef={ popupAnchorRef }
					className={ classes }
					offset={ props.offset ? props.offset : 6 }
					shift={ true }
					flip={ true }
				>
					<PopupNestingContextProvider value={ contextProvider }>
						<div ref={ popperRef }>{ children }</div>
					</PopupNestingContextProvider>
				</Popover>
			) }
		</>
	);
}
const KubioPopup = forwardRef( KubioPopup_ );
export { KubioPopup };
