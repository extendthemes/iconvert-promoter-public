import { useCustomSize } from '@kubio/controls';
import { ElementsEnum } from '../../../elements';
import { withColibriDataAutoSave } from '@kubio/core';

const computed = (dataHelper) => {
	const onChangeUseCustomSize = (event) => {
		dataHelper.setProp('useCustomDimensions', event);

		const styleStoreOptions = {
			styledComponent: 'image',
			unset: true,
		};
		dataHelper.setStyle('height', null, styleStoreOptions);
		dataHelper.setStyle('width', null, styleStoreOptions);
	};
	return {
		onChangeUseCustomSize,
		useCustomDimensions: dataHelper.getProp('useCustomDimensions'),
		styledComponent: ElementsEnum.IMAGE,
	};
};

const CustomSizeWithColibriData = withColibriDataAutoSave(computed)(
	useCustomSize
);

export { CustomSizeWithColibriData };
