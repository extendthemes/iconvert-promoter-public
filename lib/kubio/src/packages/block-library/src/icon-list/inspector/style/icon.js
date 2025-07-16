import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../blocks/icon-list/elements';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import {
	ColorWithPath,
	RangeWithUnitControl,
	RangeWithUnitWithPath,
	KubioPanelBody,
} from '@kubio/controls';
import { compose } from '@wordpress/compose';

const IconPanel_ = ({ computed }) => {
	const { size } = computed;

	return (
		<KubioPanelBody title={__('Icon', 'kubio')} initialOpen={false}>
			<ColorWithPath
				label={__('Icon color', 'kubio')}
				path={'fill'}
				style={ElementsEnum.ICON}
				type={WithDataPathTypes.STYLE}
			/>

			<ColorWithPath
				label={__('Icon hover color', 'kubio')}
				path={'fill'}
				state={'hover'}
				style={ElementsEnum.ICON}
				type={WithDataPathTypes.STYLE}
			/>

			<RangeWithUnitControl
				label={__('Icon size', 'kubio')}
				max={100}
				{...size}
			/>

			<RangeWithUnitWithPath
				label={__('Icon indent', 'kubio')}
				max={100}
				default={20}
				path={'padding.left'}
				style={ElementsEnum.ICON}
				type={WithDataPathTypes.STYLE}
			/>
		</KubioPanelBody>
	);
};

const useComputed = (dataHelper) => {
	const getSize = () => {
		const storeOptions = {
			styledComponent: ElementsEnum.ICON,
		};
		return {
			value: dataHelper.getStyle('width', null, storeOptions),
			onChange: (newData) => {
				dataHelper.setStyle('width', newData, storeOptions);
				dataHelper.setStyle('height', newData, storeOptions);
			},
			onReset: () => {
				const resetOptions = {
					...storeOptions,
					unset: true,
				};
				dataHelper.setStyle('width', null, resetOptions);
				dataHelper.setStyle('height', null, resetOptions);
			},
		};
	};
	const size = getSize();

	return {
		size,
	};
};

const IconPanel = compose(withComputedData(useComputed))(IconPanel_);

export { IconPanel };
