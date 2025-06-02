import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	HorizontalTextAlignControlWithPath,
	IconPickerWithPath,
	InlineLabeledControl,
	ToggleControl,
	KubioPanelBody,
} from '@kubio/controls';
import { ElementsEnum } from '../../elements';
import { withColibriDataAutoSave, WithDataPathTypes } from '@kubio/core';
import { dividerTypes } from '../../config';

const Panel = ({ computed, ...rest }) => {
	const { dividerType, setDividerType } = computed;

	const [withIcon, setWithIcon] = useState(dividerType === dividerTypes.ICON);

	const IconPicker = (props) => {
		if (props.dividerType === dividerTypes.ICON) {
			return (
				<IconPickerWithPath
					path="iconName"
					type={WithDataPathTypes.ATTRIBUTE}
				/>
			);
		}
		return '';
	};

	const handleIconToggle = (value) => {
		setWithIcon(value);
		setDividerType(value ? dividerTypes.ICON : dividerTypes.LINE);
	};

	return (
		<KubioPanelBody title={__('Divider Properties', 'kubio')}>
			<InlineLabeledControl label={__('With icon', 'kubio')}>
				<ToggleControl value={withIcon} onChange={handleIconToggle} />
			</InlineLabeledControl>
			<IconPicker dividerType={dividerType} />
			<HorizontalTextAlignControlWithPath
				path="textAlign"
				type={WithDataPathTypes.STYLE}
				style={ElementsEnum.OUTER}
			/>
		</KubioPanelBody>
	);
};

const computed = (dataHelper) => {
	return {
		dividerType: dataHelper.getProp('type'),
		setDividerType: (value) => dataHelper.setProp('type', value),
	};
};

const PanelWithData = withColibriDataAutoSave(computed)(Panel);

export default PanelWithData;
