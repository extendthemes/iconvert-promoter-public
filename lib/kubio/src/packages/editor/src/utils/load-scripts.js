import { subscribe } from '@wordpress/data';
import { debounce, noop } from 'lodash';

const loadScript = async (parentNode, src) =>
	new Promise((resolve) => {
		const scripts = Array.from(
			parentNode.ownerDocument.querySelectorAll('script[src]')
		).map((el) => el.src);

		if (scripts.indexOf(src) !== -1) {
			return;
		}

		const script = parentNode.ownerDocument.createElement('script');
		script.async = true;

		script.src = src;
		parentNode.appendChild(script);
		script.addEventListener('load', resolve);
	});

const handleLoadScript = debounce(async (parentNode, scripts, unsub = noop) => {
	unsub();
	scripts = window.structuredClone(scripts);
	while (scripts.length) {
		const src = scripts.shift();
		await loadScript(parentNode, src);
	}
}, 1000);

const loadEditorIframeScripts = (parentNode, scripts) => {
	let unsub = null;
	unsub = subscribe(() => handleLoadScript(parentNode, scripts, unsub));
};

export { loadEditorIframeScripts, handleLoadScript };
