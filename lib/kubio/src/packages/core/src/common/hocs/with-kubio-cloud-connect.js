import { useGlobalSessionProp } from '@kubio/editor-data';
import apiFetch from '@wordpress/api-fetch';
import { useEffect } from '@wordpress/element';

const useKubioCloudConnect = () => {
	const [apiData, setApiData] = useGlobalSessionProp('kubioApiCloudData', {
		email: null,
		name: null,
		status: null,
	});

	useEffect(() => {
		if (apiData.status !== null) {
			return;
		}

		apiFetch({
			path: '/kubio/v1/kubio-api-key',
			method: 'GET',
		}).then((res) => {
			if (res.success !== true) {
				setApiData({
					status: 'bad_key',
				});
				return;
			}

			if (res.data.isValid) {
				setApiData({
					status: 'connected',
					email: res.data.email,
					name: res.data.name,
				});
				return;
			}

			setApiData({
				status: 'bad_key',
			});
		});
	}, [apiData]);

	const connectToKubioCloud = () => {
		const { kubioCloudUrl } = window?.kubioEditSiteSettings;

		window.open(kubioCloudUrl + '/#/connect', '_blank');

		window.addEventListener('message', (event) => {
			if (event.origin !== window?.kubioEditSiteSettings?.kubioCloudUrl) {
				return;
			}

			const message = JSON.parse(event.data);

			apiFetch({
				path: '/kubio/v1/kubio-api-key',
				method: 'POST',
				data: {
					key: message.key,
				},
			}).then((response) => {
				if (response.success === true) {
					setApiData({
						email: message.email,
						status: 'connected',
					});
				}
			});
		});
	};

	const disconnectFromKubioCloud = () => {
		apiFetch({
			path: '/kubio/v1/kubio-api-key',
			method: 'POST',
			data: {
				key: false,
			},
		});

		setApiData({
			status: 'disconnected',
		});
	};

	return [apiData, connectToKubioCloud, disconnectFromKubioCloud];
};

export { useKubioCloudConnect };
