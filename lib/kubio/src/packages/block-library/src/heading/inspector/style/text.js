import { __ } from '@wordpress/i18n';

import { withComputedData, WithDataPathTypes } from '@kubio/core';
import {
	ColorWithPath,
	KubioPanelBody,
	TextShadowControlPopupWithPath,
	TypographyControlPopupWithPath,
} from '@kubio/controls';
import { useInheritedTypographyValue } from '@kubio/global-data';
import { getTagName } from '../../config';

const Panel_ = ({ computed }) => {
	return (
		<KubioPanelBody title={__('Text', 'kubio')}>
			<ColorWithPath
				label={__('Text color', 'kubio')}
				path={'typography.color'}
				type={WithDataPathTypes.STYLE}
				defaultValue={useInheritedTypographyValue(
					computed.holderName,
					'color'
				)}
			/>
			<TypographyControlPopupWithPath
				path={'typography'}
				inherit={'typography'}
				type={WithDataPathTypes.STYLE}
				nodeType={computed.holderName}
			/>
			<TextShadowControlPopupWithPath
				path={'textShadow'}
				type={WithDataPathTypes.STYLE}
			/>
		</KubioPanelBody>
	);
};

const computed = (dataHelper) => {
	const holderName = getTagName(dataHelper);
	return {
		holderName,
	};
};

const Panel = withComputedData(computed)(Panel_);
export default Panel;
