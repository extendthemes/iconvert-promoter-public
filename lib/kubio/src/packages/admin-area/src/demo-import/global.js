import { find } from 'lodash';

let data = {};
let selected = {};

const pluginsStates = {
	ACTIVE: 'ACTIVE',
	INSTALLED: 'INSTALLED',
	NOT_INSTALLED: 'NOT_INSTALLED',
};

const setDemosData = (nextData) => (data = nextData);
const getDemosData = () => data;

const setSelectedDemo = (nextSelected) => (selected = nextSelected);
const getSelectedDemo = () => selected;
const getSelectedDemoSlug = () => selected.slug || 0;
const getSelectedDemoName = () => selected.name;
const getSelectedDemoPlugins = () => selected?.plugins || [];
const getSelectedDemoThumb = () => selected.thumb;
const getSelectedDemoIsFree = () => !selected.is_pro;

const setSelectedDemoFromSlug = (slug) => {
	const demo = find(data.demos, { slug });
	setSelectedDemo(demo);
};

const getNonce = () => data.ajax_nonce;
const getAjaxURL = () => data.ajax_url;
const getText = (name) => data.texts?.[name] || '';

const getPluginState = (slug) =>
	data.plugins_states[slug] || pluginsStates.NOT_INSTALLED;

const getPluginStateLabel = (slug) =>
	data.texts.plugins_states[getPluginState(slug)];

const getPluginKubioProActiveState = () => data.kubio_pro_active;

export {
	setDemosData,
	getDemosData,
	setSelectedDemo,
	getSelectedDemo,
	getNonce,
	getAjaxURL,
	getSelectedDemoSlug,
	getText,
	getSelectedDemoThumb,
	getSelectedDemoName,
	setSelectedDemoFromSlug,
	getSelectedDemoPlugins,
	getPluginState,
	getPluginStateLabel,
	getSelectedDemoIsFree,
	getPluginKubioProActiveState,
	pluginsStates,
};
