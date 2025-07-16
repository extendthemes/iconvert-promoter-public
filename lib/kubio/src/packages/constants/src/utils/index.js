import { rootNamespace } from './kubio-namespace';

const getKubioUrlWithRestPrefix = (urlPart = '') => {
	if (rootNamespace === 'Kubio') {
		return urlPart;
	}

	const prefix = rootNamespace;

	if (urlPart?.startsWith('/')) {
		//we remove the original "/" from the url to add the prefix between the / and the rest of the url
		return `/${prefix}-${urlPart.substring(1)}`;
	}
	return `${prefix}-${urlPart}`;
};

export { getKubioUrlWithRestPrefix };
