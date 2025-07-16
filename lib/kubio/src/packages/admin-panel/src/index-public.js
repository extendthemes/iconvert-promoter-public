import { Log } from '@kubio/log';
import _ from 'lodash';
import { ContentMetas as Metas } from './store/constants';

const initAdmin = () => {
	Log.warn('The initAdmin method is used for Kubio internal developing');
};
const convertNodeToTemplate = () => {
	Log.warn(
		'The convertNodeToTemplate method is used for Kubio internal developing'
	);
};

const { kubioRemoteContentFile } = window.kubioUtilsData;

const getContentByType = (content) => {
	const sections = _.filter(content, {
		type: 'template',
		component: 'kubio/section',
	});
	const headers = _.filter(content, {
		type: 'template',
		component: 'kubio/header',
	});
	const footers = _.filter(content, {
		type: 'template',
		component: 'kubio/footer',
	});
	const presets = _.filter(content, (item) => {
		if (item.type === 'preset') {
			return true;
		}
		if (item.type === 'template') {
			const nodeMetas = _.get(item, 'meta', []);
			if (
				nodeMetas.includes(Metas.IS_PRESET) &&
				nodeMetas.includes(Metas.IS_DEFAULT_PRESET)
			) {
				return true;
			}
		}
	});
	return {
		sections,
		headers,
		footers,
		presets,
	};
};

const getColibriContent = () =>
	new Promise((resolve) => {
		window.fetch(kubioRemoteContentFile).then((response) => {
			response.json().then((reducedColibriData) => {
				resolve(getContentByType(reducedColibriData));
			});
		});
	});

const initAdminStore = (callback) => {
	getColibriContent().then((content) => {
		callback(content);
	});
};

export {
	initAdmin,
	convertNodeToTemplate,
	initAdminStore,
	Metas as ContentMetas,
};
