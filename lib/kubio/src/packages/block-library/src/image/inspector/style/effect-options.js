import { __ } from '@wordpress/i18n';
import FrameOptions from './effect-options/frame-options';
import Overlay from './effect-options/overlay';
import { AvailableInPro } from '@kubio/pro';
import { KubioPanelBody } from '@kubio/controls';

const urlArgs = {
	source: 'image',
	content: 'effects',
};

const Panel = () => {
	return (
		<KubioPanelBody title={__('Effect options', 'kubio')} initialOpen={false}>
			<FrameOptions />
			{
			}
			<AvailableInPro displayModal={false} urlArgs={urlArgs} />
		</KubioPanelBody>
	);
};

export default Panel;
