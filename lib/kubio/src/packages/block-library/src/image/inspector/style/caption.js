import { __ } from '@wordpress/i18n';

import { withComputedData, WithDataPathTypes } from '@kubio/core';
import {
	ColorWithPath,
	HorizontalTextAlignControlWithPath,
	KubioPanelBody,
	RangeWithUnitWithPath,
	SeparatorHorizontalLine,
	TypographyControlPopupWithPath,
} from '@kubio/controls';
import { ElementsEnum } from '../../elements';
import {
	useInheritedTextAlign,
	useInheritedTypographyValue,
} from '@kubio/global-data';

const Component = ({ computed }) => {
	const { captionEnabled, defaultTextAlign } = computed;

	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.CAPTION,
	};
	const textColorDefault = useInheritedTypographyValue('p', 'color');

	return (
		captionEnabled && (
			<KubioPanelBody title={__('Caption', 'kubio')} initialOpen={false}>
				<HorizontalTextAlignControlWithPath
					path="textAlign"
					label={__('Text align', 'kubio')}
					useContentAlignIcons={false}
					defaultValue={defaultTextAlign}
					{...commonOptions}
				/>
				<SeparatorHorizontalLine />

				<ColorWithPath
					label={__('Text color', 'kubio')}
					path={'typography.color'}
					defaultValue={textColorDefault}
					{...commonOptions}
				/>
				<TypographyControlPopupWithPath
					path={'typography'}
					{...commonOptions}
				/>

				<SeparatorHorizontalLine />

				<RangeWithUnitWithPath
					label={__('Space', 'kubio')}
					path={'margin.top'}
					capMax={false}
					min={0}
					max={50}
					{...commonOptions}
				/>
			</KubioPanelBody>
		)
	);
};

const useComputed = (dataHelper) => {
	const parentTextAlign = useInheritedTextAlign();
	const defaultTextAlign = dataHelper.getStyle('textAlign', parentTextAlign, {
		styledElement: ElementsEnum.OUTER,
	});
	return {
		defaultTextAlign,
		captionEnabled: dataHelper.getAttribute('captionEnabled'),
	};
};

const PanelWithData = withComputedData(useComputed)(Component);

export default PanelWithData;
