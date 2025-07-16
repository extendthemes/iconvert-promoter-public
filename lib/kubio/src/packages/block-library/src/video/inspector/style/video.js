import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BoxShadowWithPath, SelectControlWithPath } from '@kubio/controls';
import { WithDataPathTypes } from '@kubio/core';
import { properties } from '../../config';
import { ElementsEnum } from '../../elements';
const Panel = () => {
	return (
		<PanelBody title={ __( 'Video', 'kubio' ) }>
			<SelectControlWithPath
				label={ __( 'Aspect ratio', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				options={ properties.aspectRatioOptions }
				path="aspectRatio"
			/>
			<BoxShadowWithPath
				label={ __( 'Box shadow', 'kubio' ) }
				style={ ElementsEnum.OUTER }
				type={ WithDataPathTypes.STYLE }
				path={ 'boxShadow' }
			/>
		</PanelBody>
	);
};

export default Panel;
