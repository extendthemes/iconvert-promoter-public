import { __ } from '@wordpress/i18n';
import {
	HorizontalAlignControlWithPath,
	KubioPanelBody,
	SeparatorHorizontalLine,
	SpacingWithPath,
	VerticalAlignControlWithPath,
} from '@kubio/controls';
import { withComputedData } from '@kubio/core';

const SpacingSection_ = ({ computed, supportsHorizontalPosition = true }) => {
	const { equalHeight } = computed;
	return (
		<KubioPanelBody
			initialOpen={false}
			title={__('Spacing and alignment', 'kubio')}
		>
			<SpacingWithPath
				path="layout.horizontalGap"
				type="prop"
				media="current"
				label={__('Horizontal Spacing', 'kubio')}
			/>

			<SpacingWithPath
				path="layout.verticalGap"
				type="prop"
				media="current"
				label={__('Vertical Spacing', 'kubio')}
			/>

			<SpacingWithPath
				path="layout.horizontalInnerGap"
				type="prop"
				media="current"
				label={__('Horizontal Inner Spacing', 'kubio')}
			/>

			<SpacingWithPath
				path="layout.verticalInnerGap"
				type="prop"
				media="current"
				label={__('Vertical Inner Spacing', 'kubio')}
			/>

			<SeparatorHorizontalLine />

			{!equalHeight && (
				<VerticalAlignControlWithPath
					path="layout.verticalAlign"
					type="prop"
					media="current"
					label={__('Columns vertical position', 'kubio')}
				/>
			)}

			{supportsHorizontalPosition && (
				<HorizontalAlignControlWithPath
					path="layout.horizontalAlign"
					type="prop"
					media="current"
					label={__('Columns horizontal position', 'kubio')}
				/>
			)}
		</KubioPanelBody>
	);
};
const SpacingSection = withComputedData((dataHelper) => {
	return {
		equalHeight: dataHelper.getPropInMedia('layout.equalHeight'),
	};
})(SpacingSection_);
export { SpacingSection };
