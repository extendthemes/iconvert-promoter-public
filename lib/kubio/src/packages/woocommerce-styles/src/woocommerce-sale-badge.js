import {
	BordersAndRadiusWithPath,
	BoxShadowWithPath,
	BoxUnitValueControlWithPath,
	ColorWithPath,
	GradientColorPickerWithPath,
	SeparatorHorizontalLine,
	TypographyControlPopupWithPath,
} from '@kubio/controls';
import { KubioBlockContext, WithDataPathTypes } from '@kubio/core';
import { useGlobalDataStyle } from '@kubio/global-data';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const WooCommerceOnSaleBadge = ({}) => {
	const styledElement = 'wc-on-sale';
	const title = __('On sale badge', 'kubio');

	const { globalStyle } = useGlobalDataStyle();

	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: styledElement,
		dataHelper: globalStyle,
	};

	return (
		<PanelBody initialOpen={false} title={title}>
			<GradientColorPickerWithPath
				label={__('Background', 'kubio')}
				path={'background'}
				{...commonOptions}
			/>

			<ColorWithPath
				label={__('Text color', 'kubio')}
				path={'typography.color'}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine />

			<TypographyControlPopupWithPath
				path={'typography'}
				{...commonOptions}
			/>
			<SeparatorHorizontalLine />

			<BoxUnitValueControlWithPath
				label={__('Padding', 'kubio')}
				path={'padding'}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine />

			<ColorWithPath
				label={__('Border color', 'kubio')}
				path={[
					'border.top.color',
					'border.bottom.color',
					'border.left.color',
					'border.right.color',
				]}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine />

			<BoxShadowWithPath path={'boxShadow'} {...commonOptions} />
		</PanelBody>
	);
};

export { WooCommerceOnSaleBadge };
