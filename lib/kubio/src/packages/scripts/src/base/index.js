import Colibri from './colibri';
import ColibriFrontComponent from './colibri-kube-component';

Colibri.registerPlugin = function (name, plugin, autoload) {
	if (typeof name.componentName === 'function') {
		autoload = plugin;
		plugin = name;
		name = plugin.componentName();
	}

	Colibri[name] = plugin;
	// Colibri[name].inherits(Colibri);
	Colibri.Plugin.create(name);

	if (autoload !== false) {
		Colibri.Plugin.autoload(name);
	}
};

export { Colibri as ColibriFrontend, ColibriFrontComponent };
