import { useEffect } from '@wordpress/element';
import { useBlocksOwnerDocument } from '@kubio/editor-data';

function useOnClickOutsidePerDocument(
	ref,
	handler,
	ownerDocument = document
) {
	useEffect(
		() => {
			const listener = ( event ) => {
				// Do nothing if clicking ref's element or descendent elements
				if ( ! ref.current || ref.current.contains( event.target ) ) {
					return;
				}

				handler( event );
			};
			ownerDocument?.addEventListener( 'mousedown', listener );
			ownerDocument?.addEventListener( 'touchstart', listener );

			return () => {
				ownerDocument?.removeEventListener( 'mousedown', listener );
				ownerDocument?.removeEventListener( 'touchstart', listener );
			};
		},
		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
		[ ref?.current, handler, ownerDocument ]
	);
}
const useOnClickOutside = ( ref, handler ) => {
	const ownerDocument = useBlocksOwnerDocument();
	useOnClickOutsidePerDocument( ref, handler, document );
	useOnClickOutsidePerDocument( ref, handler, ownerDocument );
};
export { useOnClickOutside };
