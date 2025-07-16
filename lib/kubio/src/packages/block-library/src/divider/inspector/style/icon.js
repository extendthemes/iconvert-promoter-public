import { __ } from '@wordpress/i18n';
import {
	ColorWithPath,
	RangeWithUnitWithPath,
	RangeWithUnitControl,
	KubioPanelBody,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../elements';
import { dividerTypes } from '../../config';

const commonStoreOptions = {
	styledComponent: ElementsEnum.INNER,
};

const Panel = ({ computed }) => {
	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.INNER,
	};
	
	const { iconSpacing, dividerType } = computed;
	return (
		dividerType === dividerTypes.ICON && (
			<KubioPanelBody title={__('Icon', 'kubio')} initialOpen={false}>
				<ColorWithPath
					label={__('Icon color', 'kubio')}
					path={'fill'}
					{...commonOptions}
				/>
				<RangeWithUnitWithPath
					label={__('Icon size', 'kubio')}
					max={100}
					path={'size'}					
					defaultSliderValue={40}
					resetValue={40}
					{...commonOptions}
				/>
				<RangeWithUnitControl
					label={__('Icon spacing', 'kubio')}
					max={50}
					{...iconSpacing}
				/>
			</KubioPanelBody>
		)
	);
};

const useComputed = (dataHelper) => {
	const iconSpacing = {
		value: dataHelper.getStyle('margin.left', {}, commonStoreOptions),
		onChange: (event) => {
			dataHelper.setStyle('margin.left', event, commonStoreOptions);
			dataHelper.setStyle('margin.right', event, commonStoreOptions);
		},
	};
	return {
		iconSpacing,
		dividerType: dataHelper.getProp('type'),
	};
};
const Component = withComputedData(useComputed)(Panel);
export default Component;
