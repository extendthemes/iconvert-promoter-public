import { useOnClickOutside } from '@kubio/utils';
import { Popover } from '@wordpress/components';
import {
	createContext,
	createPortal,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import _ from 'lodash';
import { getStringValueWithId } from './strings-by-id';
import { UpgradeToPro } from './upgrade-to-pro';
import { useInstanceId } from '@wordpress/compose';
import { wpVersionCompare } from '@kubio/utils';

const ProModalTextContext = createContext(
	getStringValueWithId( 'pro.popup.option' )
);

const useProModal_ = () => {
	const [ show, setShow ] = useState( {
		default: false,
	} );
	const setShowProModal = ( value, id = 'default' ) => {
		setShow( {
			...show,
			[ id ]: value,
		} );
	};
	const ModalInstance = useCallback(
		( props ) => {
			const { id = 'default' } = props;
			return show?.[ id ] ? (
				<ProModal
					onClose={ () => {
						setShowProModal( false, id );
					} }
					{ ...props }
				/>
			) : (
				false
			);
		},
		[ show ]
	);
	return [ ModalInstance, setShowProModal ];
};

const useProModal = () => {
	return useProModal_();
};
const isBelowWp6_3 = wpVersionCompare( '6.3.1', '<' );
const preventDefault = ( event ) => {
	// this prevents the popop from closing when other components as block patterns list listen to outside clicks
	event.preventDefault();
	event.stopPropagation();
	event?.nativeEvent?.stopImmediatePropagation?.();
};
const triggerProModalOpened = ( modalEl ) => {
	const event = new modalEl.ownerDocument.defaultView.CustomEvent(
		'kubio-pro-modal-showed',
		{
			detail: {
				modalEl,
			},
		}
	);
	modalEl.ownerDocument.defaultView.dispatchEvent( event );
};

const ProModal = forwardRef( ( props = {} ) => {
	const {
		onClose = _.noop,
		anchorRef: anchorRefBase,
		urlArgs = {},
		className = '',
	} = props;

	const popoverID = useInstanceId( ProModal );

	const anchorRef = anchorRefBase?.current ?? anchorRefBase;

	const popperRef = useRef();
	const onClosePopover = useCallback(
		( event ) => {
			const target = event?.target;
			if (
				popperRef.current === target ||
				popperRef.current.contains( target )
			) {
				return;
			}
			onClose();
		},
		[ onClose ]
	);
	useOnClickOutside( popperRef, onClosePopover );

	const onProModalOpened = useCallback( ( event ) => {
		if ( ! event.detail.modalEl.isSameNode( popperRef.current ) ) {
			onClose();
		}
	}, [] );

	// this closes any other popup opened
	useEffect( () => {
		if ( popperRef.current ) {
			triggerProModalOpened( popperRef.current );
			const win = popperRef.current.ownerDocument.defaultView;
			win.addEventListener( 'kubio-pro-modal-showed', onProModalOpened );

			return () =>
				win.removeEventListener(
					'kubio-pro-modal-showed',
					onProModalOpened
				);
		}
	}, [ onProModalOpened, popperRef ] );

	const popoverAnchor = useMemo( () => {
		const selectedElement = anchorRef;
		if ( ! anchorRef ) {
			return;
		}
		const extraProps = {};

		// eslint-disable-next-line camelcase, prettier/prettier
		if (isBelowWp6_3) {
			extraProps.ownerDocument = selectedElement.ownerDocument;
		}
		return {
			getBoundingClientRect() {
				return selectedElement.getBoundingClientRect();
			},
			contextElement: selectedElement,
			...extraProps,
		};
	}, [ anchorRef ] );

	return (
		<>
			{ createPortal(
				<div className={ 'kubio-upgrade-to-pro-popup-slot' }>
					<Popover.Slot
						name={ `kubio-upgrade-to-pro-popup-${ popoverID }` }
					/>
				</div>,
				document.body
			) }
			<Popover
				position={ 'bottom center' }
				className={ `kubio-upgrade-to-pro-popup sidebar-popover-container ${ className }` }
				anchor={ anchorRef ? popoverAnchor : undefined }
				shift={ true }
				flip={ true }
				placement="bottom"
				__unstableSlotName={ `kubio-upgrade-to-pro-popup-${ popoverID }` }
				focusOnMount={ false }
			>
				<div
					ref={ popperRef }
					onClick={ preventDefault }
					onMouseDown={ preventDefault }
				>
					<ProModalContent urlArgs={ urlArgs } />
				</div>
			</Popover>
		</>
	);
} );

function ProModalContent( { urlArgs } = {} ) {
	const message = useContext( ProModalTextContext );

	return <UpgradeToPro urlArgs={ urlArgs } message={ message } />;
}
export { ProModal, ProModalTextContext, useProModal };
