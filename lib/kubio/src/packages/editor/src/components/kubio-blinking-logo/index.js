import { reactRender } from '@kubio/core';
import { KubioLoader } from '@kubio/icons';
import { Icon } from '@wordpress/components';
import { memo, useEffect, useRef } from '@wordpress/element';
import iframeContent from './iframe-content.html';
import { useRefEffect } from '@wordpress/compose/build-types';

const KubioBlinkingLogo = () => {
	return (
		<div className="kubio-loading-logo">
			<Icon icon={KubioLoader} />
		</div>
	);
};

const KubioBlinkingLogoIframe = memo(() => {
	const ref = useRefEffect((iframe) => {
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write(iframeContent);
		iframe.contentWindow.document.close();

		const iframeDocument =
			iframe.contentDocument || iframe.contentWindow.document;
		const contentNode = iframeDocument?.querySelector('#content');
		if (!contentNode) {
			return;
		}
		reactRender(<KubioBlinkingLogo />, contentNode);
	}, []);

	return (
		<iframe
			title="kubio-loader"
			ref={ref}
			className="kubio-loading-logo-iframe"
		/>
	);
});

export { KubioBlinkingLogo, KubioBlinkingLogoIframe };
