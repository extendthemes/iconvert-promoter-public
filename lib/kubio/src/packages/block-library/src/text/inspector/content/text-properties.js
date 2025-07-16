import {
	HorizontalTextAlignControlWithPath,
	KubioPanelBody,
	ToggleControl,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { useInheritedTextAlign } from '@kubio/global-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../elements';

const TextProperties_ = ({
	showLead,
	showDropCap = false,
	atEndOfTextProperties,
	title,
	computed,
}) => {
	const defaultTextAlign = useInheritedTextAlign();
	const { handleLeadToggle, handleDropCapToggle, isLead, dropCap } = computed;

	const hasMultiSelection = useSelect((select) => {
		// eslint-disable-next-line no-shadow
		const { hasMultiSelection } = select('core/block-editor');

		return hasMultiSelection;
	}, []);

	const isMultipleSelected = hasMultiSelection();

	return (
		<KubioPanelBody title={title}>
			{!isMultipleSelected && (
				<>
					<HorizontalTextAlignControlWithPath
						label={__('Text align', 'kubio')}
						path="textAlign"
						useContentAlignIcons={false}
						defaultValue={defaultTextAlign}
						type={WithDataPathTypes.STYLE}
						style={ElementsEnum.TEXT}
					/>

					{showLead && (
						<ToggleControl
							label={__('Lead', 'kubio')}
							onChange={handleLeadToggle}
							value={isLead}
						/>
					)}

					{showDropCap && (
						<ToggleControl
							label={__('Drop cap', 'kubio')}
							onChange={handleDropCapToggle}
							value={dropCap}
						/>
					)}
				</>
			)}
			{atEndOfTextProperties}
		</KubioPanelBody>
	);
};

const TextProperties = withComputedData((dataHelper) => {
	return {
		handleLeadToggle: (value) => {
			if (value === true) {
				dataHelper.setStyle('typography', {});
			}
			dataHelper.setProp('isLead', value);
		},
		handleDropCapToggle: (value) => {
			dataHelper.setProp('dropCap', value);
		},
		isLead: dataHelper.getProp('isLead', false),
		dropCap: dataHelper.getProp('dropCap'),
	};
})(TextProperties_);

export { TextProperties };
