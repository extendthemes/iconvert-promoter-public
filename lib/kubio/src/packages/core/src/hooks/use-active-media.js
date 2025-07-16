import { STORE_KEY } from '@kubio/constants';
import { deviceToMedia } from '@kubio/utils';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from '@wordpress/element';
import { noop } from 'lodash';

const getActiveMediaFromRegistry = ( registrySelect ) => {
	// use the appropriate store depending where the page is opened
	const store =
		registrySelect( STORE_KEY ) ||
		registrySelect( 'core/edit-post' ) ||
		registrySelect( 'core/edit-site' );
	return deviceToMedia(
		store?.__experimentalGetPreviewDeviceType() || 'desktop'
	);
};

const useActiveMedia = () => {
	return useSelect( ( select ) => {
		return getActiveMediaFromRegistry( select );
	}, [] );
};

const useMediaEffect = ( callback = noop, deps = [] ) => {
	const currentMedia = useActiveMedia();
	const [ media, setMedia ] = useState( currentMedia );

	const effectFunction = useCallback( () => {
		if ( media !== currentMedia ) {
			return callback( currentMedia );
		}
	}, [ media, setMedia, currentMedia ] );

	useEffect( effectFunction, [ ...deps ] );
};

const useMediaLayoutEffect = ( callback = noop, deps = [] ) => {
	const currentMedia = useActiveMedia();
	const [ media, setMedia ] = useState( currentMedia );

	const effectFunction = useCallback( () => {
		if ( media !== currentMedia ) {
			return callback( currentMedia );
		}
	}, [ media, setMedia, currentMedia ] );

	useLayoutEffect( effectFunction, [ ...deps ] );
};

const withActiveMedia = () =>
	createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const activeMedia = useActiveMedia();
			return (
				<WrappedComponent { ...ownProps } activeMedia={ activeMedia } />
			);
		},
		'withActiveMedia'
	);

export {
	useActiveMedia,
	useMediaEffect,
	useMediaLayoutEffect,
	withActiveMedia,
	getActiveMediaFromRegistry,
};
