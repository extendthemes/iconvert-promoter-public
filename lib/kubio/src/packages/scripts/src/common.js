(function ($, Colibri) {
	function isEdge() {
		return window.navigator.userAgent.indexOf('Edge') > -1;
	}
	$(function () {
		const body = document.querySelector('body');
		if (Colibri.isCustomizerPreview()) {
			body.classList.add('kubio-in-customizer');
			window.wp.customize.bind('kubio-editor-preview-ready', () => {
				body.classList.add('kubio-in-customizer--loaded');
			});
		}
		if (isEdge()) {
			body.classList.add('kubio--edge');
		}
	});
})(jQuery, CSPROMO);
