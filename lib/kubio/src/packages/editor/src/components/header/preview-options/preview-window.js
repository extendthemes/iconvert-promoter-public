import { __ } from '@wordpress/i18n';
import { renderToString } from '@wordpress/element';
import { KubioLoader } from '@kubio/icons';
import loaderTemplate from './loader.html';

let previewWindow = null;

//we need a random id in case a user uses the kubio editor for a page that was previewed. So when the user uses preview
//for this new page it won't preview in the editor window.
let windowId = Math.random();
function writeInterstitialMessage(targetDocument) {
	const { previewBlinkingLogoHtml } = window.kubioUtilsData;
	const previewLogo = previewBlinkingLogoHtml ?? renderToString(KubioLoader)
	let markup = loaderTemplate.replace(
		'{message}',
		__('Generating preview…', 'kubio')
	);
	markup = markup.replace('{svg_image}', previewLogo);
	targetDocument.write(markup);
	targetDocument.title = __('Generating preview…', 'kubio');
	targetDocument.close();
}
function initPreviewWindow() {
	//when opening a new window, the name is used as a id. If a window is already opened with that id that one will be used
	//this could lead to some problems. if no id is used here are the problems:
	//1) If the current page is in kubio editor and we press the preview the current page will be used to preview which is not ok
	//2) If you preview a page then use a link to a different page, the second time you use preview the editor domain will
	//be different than the preview domain because the same window will be used. This will throw a error.
	previewWindow = window.open(
		'',
		__('Generating preview…', 'kubio') + windowId++
	);
}
const openPreviewWindow = () => {
	if (!previewWindow || previewWindow.closed) {
		initPreviewWindow();
	}
	try {
		//if the client navigates in the preview window to a different domain you won't be able to access the document
		//and a exception will be thrown
		writeInterstitialMessage(previewWindow.document);
	} catch (e) {
		initPreviewWindow();
		writeInterstitialMessage(previewWindow.document);
	}

	setTimeout(function () {
		previewWindow.focus();
	}, 100);
	return previewWindow;
};

export { openPreviewWindow };
