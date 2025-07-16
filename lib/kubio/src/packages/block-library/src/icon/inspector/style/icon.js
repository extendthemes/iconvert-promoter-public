import { __ } from '@wordpress/i18n';
import {
	ColorWithPath,
	SeparatorHorizontalLine,
	RangeWithUnitControl,
	KubioPanelBody,
} from '@kubio/controls';
import {
	useTransformStyle,
	withComputedData,
	WithDataPathTypes,
} from '@kubio/core';

// the styledElement prop was added to allow the panel to be used in other contexts e.g. Offscreen panel

const Panel_ = ({ computed, styledElement }) => {
	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: styledElement,
	};

	const { rotateZ, size } = computed;
	return (
		<KubioPanelBody title={__('Icon', 'kubio')}>
			<ColorWithPath
				label={__('Icon color', 'kubio')}
				path={'fill'}
				{...commonOptions}
			/>

			<ColorWithPath
				label={__('Icon hover color', 'kubio')}
				path={'fill'}
				state={'hover'}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine />

			<RangeWithUnitControl
				label={__('Icon size', 'kubio')}
				max={300}
				min={0}
				capMin={true}
				{...size}
			/>

			<RangeWithUnitControl
				label={__('Icon rotate', 'kubio')}
				max={180}
				min={-180}
				capMax={true}
				capMin={true}
				defaultUnit={'deg'}
				{...rotateZ}
			/>
		</KubioPanelBody>
	);
};

const computed = (dataHelper, ownProps) => {
	const { styledElement: styledComponent } = ownProps;
	const size = {
		value: dataHelper.getStyle('width', '', { styledComponent }),
		onChange: (newValue) => {
			dataHelper.setStyle('width', newValue, { styledComponent });
			dataHelper.setStyle('height', newValue, { styledComponent });
		},
	};

	const transformDataHelper = useTransformStyle(dataHelper);

	//rotateZ is rotate 2d
	const rotateZ = transformDataHelper.useStylePath(
		'transform.rotate.z',
		{},
		{ value: 0, unit: 'deg' }
	);

	return {
		rotateZ,
		size,
	};
};
const Panel = withComputedData(computed)(Panel_);
export default Panel;
