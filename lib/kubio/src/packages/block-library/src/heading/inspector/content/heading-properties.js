import {
	HorizontalTextAlignControlWithPath,
	KubioPanelBody,
	LinkControlWithData,
	ToggleGroupWithPath,
} from '@kubio/controls';
import { WithDataPathTypes } from '@kubio/core';
import { useInheritedTextAlign } from '@kubio/global-data';
import { __ } from '@wordpress/i18n';
import { properties } from '../../config';
import { ElementsEnum } from '../../elements';

const HeadingProperties = () => {
	const defaultTextAlign = useInheritedTextAlign();
	return (
		<KubioPanelBody title={__('Heading Properties', 'kubio')}>
			<ToggleGroupWithPath
				path="level"
				options={properties.headingType.options}
				type={WithDataPathTypes.PROP}
				label={__('Heading type', 'kubio')}
			/>
			<HorizontalTextAlignControlWithPath
				label={__('Heading align', 'kubio')}
				path="textAlign"
				defaultValue={defaultTextAlign}
				useContentAlignIcons={false}
				type={WithDataPathTypes.STYLE}
				style={ElementsEnum.TEXT}
			/>

			<LinkControlWithData />
		</KubioPanelBody>
	);
};

export { HeadingProperties };
