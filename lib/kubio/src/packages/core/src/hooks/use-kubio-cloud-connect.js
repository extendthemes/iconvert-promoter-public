import { useGlobalSessionProp } from '@kubio/editor-data';
import { getBackendData } from '@kubio/utils';
import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect } from '@wordpress/element';
import { first } from 'lodash';
let isPending = false;
const useKubioCloudConnect = () => {
	const [ apiData, setApiData ] = useGlobalSessionProp( 'kubioApiCloudData', {
		email: null,
		name: null,
		status: null,
		role: 'user',
	} );

	useEffect( () => {
		if ( apiData.status !== null || isPending ) {
			return;
		}
		isPending = true;

		apiFetch( {
			path: '/kubio/v1/kubio-api-key',
			method: 'GET',
		} )
			.then( ( res ) => {
				if ( res?.success ) {
					setApiData( {
						status: 'connected',
						email: res?.data?.email,
						name: res?.data?.name,
						role: res?.data?.role,
					} );
				} else {
					setApiData( {
						status: 'bad_key',
					} );
				}
			} )
			.catch( () => {
				setApiData( {
					status: 'bad_key',
				} );
			} )
			.finally( () => {
				isPending = false;
			} );
	}, [ apiData, setApiData ] );

	const baseURL = first(
		getBackendData( 'kubioCloudUrl' ).split( '?' )
	).replace( /\/+$/, '' );
	const { screen } = window;

	const connectToKubioCloud = useCallback( () => {
		const winWidth = 500;
		const winHeight = 600;

		const options = [
			'popup',
			`innerWidth=${ winWidth }`,
			`innerHeight=${ winHeight }`,
			`left=${ ( screen.width - winWidth ) / 2 }`,
			`top=${ ( ( screen.height - winHeight ) / 2 ) * 0.8 }`,
		];

		const win = window.open(
			`${ baseURL }/ui-route/connect`,
			'kubioCloudConnect',
			options.join( ',' )
		);

		window.addEventListener( 'message', ( event ) => {
			const {
				action = null,
				value = null,
				error = null,
			} = event.data || {};

			if ( action !== 'cloud_api_key' ) {
				return;
			}

			win.close();

			if ( error ) {
				console.error( error );
				return;
			}

			const { key, email } = value;

			apiFetch( {
				path: '/kubio/v1/kubio-api-key',
				method: 'POST',
				data: {
					key,
				},
			} ).then( ( response ) => {
				if ( response?.success ) {
					setApiData( {
						email,
						status: 'connected',
					} );
				}
			} );
		} );
	}, [ baseURL, screen.height, screen.width, setApiData ] );

	const disconnectFromKubioCloud = useCallback( () => {
		apiFetch( {
			path: '/kubio/v1/kubio-api-key',
			method: 'POST',
			data: {
				key: false,
			},
		} ).then( ( response ) => {
			if ( response?.success ) {
				setApiData( {
					status: 'disconnected',
				} );
			}
		} );
	}, [ setApiData ] );

	return [ apiData, connectToKubioCloud, disconnectFromKubioCloud ];
};

export { useKubioCloudConnect };
