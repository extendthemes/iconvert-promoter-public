import {
	getPluginState,
	getSelectedDemoPlugins,
	pluginsStates,
} from './global';
import { ajaxCall } from './ajax-call';
import {
	displayErrorMessageAndStopImport,
	installStatus,
	installSteps,
	setStepUIStatus,
} from './ui';
import { getKubioUrlWithRestPrefix } from '@kubio/constants';

const installPlugin = async (slug) =>
	await ajaxCall({
		action: getKubioUrlWithRestPrefix('kubio-demo-site-install-plugin'),
		slug,
	});

const activatePlugin = async (slug) =>
	await ajaxCall({
		action: getKubioUrlWithRestPrefix('kubio-demo-site-activate-plugin'),
		slug,
	});

const processPlugin = async (slug) => {
	const state = getPluginState(slug);

	try {
		switch (state) {
			case pluginsStates.ACTIVE:
				return true;
			case pluginsStates.INSTALLED:
				await activatePlugin(slug);
				break;
			case pluginsStates.NOT_INSTALLED:
				await installPlugin(slug);
				await activatePlugin(slug);
				break;
		}
	} catch (e) {
		throw e;
	}
};

const importPlugins = async () => {
	try {
		setStepUIStatus(installSteps.PLUGINS, installStatus.PROGRESS);

		const plugins = getSelectedDemoPlugins();

		for (let i = 0; i < plugins.length; i++) {
			const { slug } = plugins[i];
			await processPlugin(slug);
		}

		setStepUIStatus(installSteps.PLUGINS, installStatus.DONE);
	} catch (e) {
		displayErrorMessageAndStopImport(e);
	}
};

export { importPlugins };
