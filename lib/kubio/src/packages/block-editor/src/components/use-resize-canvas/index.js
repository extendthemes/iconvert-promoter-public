/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Function to resize the editor window.
 *
 * @param {string} deviceType Used for determining the size of the container (e.g. Desktop, Tablet, Mobile)
 * @return {Object} Inline styles to be added to resizable container.
 */
export default function useResizeCanvas( deviceType ) {
	const [ actualWidth, updateActualWidth ] = useState( window.innerWidth );

	useEffect( () => {
		if ( deviceType === 'Desktop' ) {
			return;
		}

		const resizeListener = () => updateActualWidth( window.innerWidth );
		window.addEventListener( 'resize', resizeListener );

		return () => {
			window.removeEventListener( 'resize', resizeListener );
		};
	}, [ deviceType ] );

	const getCanvasWidth = useCallback(
		( device ) => {
			let deviceWidth;

			switch ( device ) {
				case 'Tablet':
					deviceWidth = 780;
					break;
				case 'Mobile':
					// deviceWidth = 412;
					deviceWidth = 360; // -> changed to 360px for better mobile view, especially that popups are over the content
					break;
				default:
					return null;
			}

			return deviceWidth < actualWidth ? deviceWidth : actualWidth;
		},
		[ actualWidth ]
	);

	return useMemo( () => {
		const height = `min( calc(100% - 30px), ${
			deviceType === 'Mobile' ? '768px' : '1200px'
		})`;
		switch ( deviceType ) {
			case 'Tablet':
			case 'Mobile':
				return {
					width: getCanvasWidth( deviceType ),
					flexGrow: 0,
					height,
					maxHeight: '100%',
					borderRadius: '4px',
				};
			default:
				return {
					width: '100%',
					flexGrow: 0,
					height: '100%',
					maxHeight: '100%',
					borderRadius: '0px',
				};
		}
	}, [ deviceType, getCanvasWidth ] );
}
