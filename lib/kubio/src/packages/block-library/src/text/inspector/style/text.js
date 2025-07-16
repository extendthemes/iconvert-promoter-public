import { __ } from '@wordpress/i18n';

import {
	ColorWithPath,
	KubioPanelBody,
	TextShadowControlPopupWithPath,
	TypographyControlPopupWithPath,
} from '@kubio/controls';
import { useKubioBlockContext, WithDataPathTypes } from '@kubio/core';
import { useInheritedTypographyValue } from '@kubio/global-data';

const Panel = (props) => {
	const { withTextShadow = true, styleTitle = __('Text', 'kubio') } = props;
	const { dataHelper } = useKubioBlockContext();
	const elementStyle = dataHelper.getProp('isLead') ? 'lead' : 'p';

	return (
		<KubioPanelBody title={styleTitle}>
			<ColorWithPath
				label={__('Text color', 'kubio')}
				path={'typography.color'}
				type={WithDataPathTypes.STYLE}
				defaultValue={useInheritedTypographyValue(
					elementStyle,
					'color'
				)}
			/>
			<TypographyControlPopupWithPath
				path={'typography'}
				type={WithDataPathTypes.STYLE}
				nodeType={elementStyle}
			/>

			{withTextShadow && (
				<TextShadowControlPopupWithPath
					path={'textShadow'}
					type={WithDataPathTypes.STYLE}
				/>
			)}
		</KubioPanelBody>
	);
};

export default Panel;
