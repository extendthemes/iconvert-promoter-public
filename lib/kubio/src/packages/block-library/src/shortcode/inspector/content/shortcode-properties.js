import { __ } from '@wordpress/i18n';
import { KubioPanelBody, TextareaControlWithPath } from '@kubio/controls';
import { WithDataPathTypes } from '@kubio/core';
const Panel = () => {
	return (
		<KubioPanelBody title={__('Shortcode Properties', 'kubio')}>
			<TextareaControlWithPath
				path={'shortcode'}
				type={WithDataPathTypes.ATTRIBUTE}
			/>
		</KubioPanelBody>
	);
};
export default Panel;
