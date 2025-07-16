import { Dropdown } from '@wordpress/components';
import _ from 'lodash';
import {
	useRef,
	useEffect,
	useImperativeHandle,
	forwardRef,
	useMemo,
} from '@wordpress/element';
import classnames from 'classnames';
import { wpVersionCompare } from '@kubio/utils';

const preventDefault = ( e ) => {
	e.stopPropagation();
	e.preventDefault();
};

// eslint-disable-next-line camelcase
const isLessThan6_4 = wpVersionCompare( '6.4', '<' );

const DropdownWithHover = forwardRef(
	(
		{
			toggleElement,
			children,
			onToggle = _.noop,
			className,
			popoverProps = {},
		} = {},
		ref
	) => {
		const dropdownFunctionsRef = useRef();
		const toggleButtonRef = useRef();
		const closePopupTimeoutRef = useRef();
		const baseClass = 'kubio-dropdown-with-hover';

		//cleanup close popup timeout
		useEffect( () => {
			return () => {
				clearTimeout( closePopupTimeoutRef.current );
			};
		}, [] );

		// eslint-disable-next-line no-shadow
		const onMouseOver = ( { isOpen, onToggle } = {} ) => {
			clearTimeout( closePopupTimeoutRef.current );
			if ( ! isOpen ) {
				onToggle();
			}
		};

		const onClosePopup = () => {
			const onClose = _.get(
				dropdownFunctionsRef,
				[ 'current', 'onClose' ],
				_.noop
			);
			onClose();
		};

		useImperativeHandle( ref, () => ( {
			onClose: onClosePopup,
		} ) );

		const onMouseOut = () => {
			clearTimeout( closePopupTimeoutRef.current );
			closePopupTimeoutRef.current = setTimeout( () => {
				onClosePopup();
			}, 200 );
		};

		const mergedPopoverProps = useMemo(
			() => ( {
				position: 'bottom left',
				placement: 'bottom-end',
				shift: true,
				resize: false,
				anchor: {
					getBoundingClientRect() {
						return toggleButtonRef.current?.getBoundingClientRect?.();
					},
					// eslint-disable-next-line camelcase
					contextElement: isLessThan6_4
						? undefined
						: toggleButtonRef.current,
					// eslint-disable-next-line camelcase
					...( isLessThan6_4
						? {
								ownerDocument:
									toggleButtonRef.current?.ownerDocument,
						  }
						: { ownerDocument: top.document } ),
				},
				...popoverProps,
				className: classnames(
					`${ baseClass }__popover`,
					popoverProps?.className
				),
			} ),
			[ popoverProps ]
		);

		return (
			<div className={ classnames( baseClass, className ) }>
				<Dropdown
					focusOnMount={ false }
					popoverProps={ mergedPopoverProps }
					onToggle={ onToggle }
					renderToggle={ ( props ) => {
						return (
							<div
								className={ `${ baseClass }__toggle` }
								ref={ toggleButtonRef }
								onMouseEnter={ ( e ) => {
									preventDefault( e );
									onMouseOver( props );
								} }
								onMouseLeave={ onMouseOut }
							>
								{ toggleElement }
							</div>
						);
					} }
					renderContent={ ( props ) => {
						dropdownFunctionsRef.current = props;
						return (
							<div
								className={ `${ baseClass }__content` }
								onMouseEnter={ ( e ) => {
									preventDefault( e );
									onMouseOver( props );
								} }
								onMouseLeave={ onMouseOut }
							>
								{ children }
							</div>
						);
					} }
				/>
			</div>
		);
	}
);

export { DropdownWithHover };
