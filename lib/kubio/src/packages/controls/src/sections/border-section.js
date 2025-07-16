import { __ } from '@wordpress/i18n';
import { WithDataPathTypes } from '@kubio/core';
import BordersAndRadiusWithPath from '../style-controls/wrappers/border-and-radiuses-wrapper';
import { KubioPanelBody } from '../components';

const BordersAndRadiusSection = () => {
	return (
		<KubioPanelBody title={ __( 'Border', 'kubio' ) } initialOpen={ false }>
			<BordersAndRadiusWithPath
				type={ WithDataPathTypes.STYLE }
				path={ 'border' }
			/>
		</KubioPanelBody>
	);
};

export { BordersAndRadiusSection };
