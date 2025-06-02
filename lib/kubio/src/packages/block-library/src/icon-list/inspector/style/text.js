import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../blocks/icon-list/elements';
import { WithDataPathTypes } from '@kubio/core';
import {
	ColorWithPath,
	RangeWithUnitWithPath,
	TypographyControlPopupWithPath,
	KubioPanelBody,
} from '@kubio/controls';

const TextPanel = () => {
	return (
		<KubioPanelBody title={__('Text', 'kubio')} initialOpen={false}>
			<TypographyControlPopupWithPath
				path={'typography'}
				type={WithDataPathTypes.STYLE}
				style={ElementsEnum.TEXT}
			/>

			<ColorWithPath
				label={__('Text color', 'kubio')}
				path={'color'}
				type={WithDataPathTypes.STYLE}
				style={ElementsEnum.TEXT}
			/>

			<RangeWithUnitWithPath
				label={__('Text indent', 'kubio')}
				max={100}
				path={'margin.left'}
				style={ElementsEnum.TEXT}
				type={WithDataPathTypes.STYLE}
			/>

			<ColorWithPath
				label={__('Link hover color', 'kubio')}
				path={'typography.color'}
				type={WithDataPathTypes.STYLE}
				style={ElementsEnum.LINK}
				state={'hover'}
			/>
		</KubioPanelBody>
	);
};

export { TextPanel };
