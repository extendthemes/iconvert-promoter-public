import { useEffect } from '@wordpress/element';

const usePopupInsideModal = ( show ) => {
	useEffect( () => {
		document.body.classList.toggle( 'kubio-popup-inside-modal', show );
	}, [ show ] );
};

export { usePopupInsideModal };
