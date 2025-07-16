import { StatesControl } from '@kubio/advanced-panel';
import {
	BordersAndRadiusWithPath,
	BoxShadowWithPath,
	ColorWithPath,
	GradientColorPickerWithPath,
	SeparatorHorizontalLine,
	TypographyControlPopupWithPath,
} from '@kubio/controls';
import { WithDataPathTypes } from '@kubio/core';
import { useGlobalDataStyle } from '@kubio/global-data';
import { BaseControl, PanelBody } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const WooCommerceButton = ({
	styledElement = 'wc-button',
	title = __('Primary button', 'kubio'),
}) => {
	const availableStates = ['normal', 'hover', 'disabled'];
	const [state, setState] = useState('');
	const { globalStyle } = useGlobalDataStyle();

	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: styledElement,
		dataHelper: globalStyle,
	};

	return (
		<PanelBody initialOpen={false} title={title}>
			{/* eslint-disable-next-line @wordpress/no-base-control-with-label-without-id */}
			<BaseControl label={__('State', 'kubio')}>
				<StatesControl
					activeState={state}
					setActiveState={setState}
					availableStates={availableStates}
				/>
				<GradientColorPickerWithPath
					label={__('Background', 'kubio')}
					path={'background'}
					state={state}
					{...commonOptions}
				/>

				<ColorWithPath
					label={__('Text color', 'kubio')}
					path={'typography.color'}
					state={state}
					{...commonOptions}
				/>

				<ColorWithPath
					label={__('Border color', 'kubio')}
					path={[
						'border.top.color',
						'border.bottom.color',
						'border.left.color',
						'border.right.color',
					]}
					state={state}
					{...commonOptions}
				/>

				<SeparatorHorizontalLine />

				<TypographyControlPopupWithPath
					path={'typography'}
					{...commonOptions}
				/>
				<SeparatorHorizontalLine />

				<BordersAndRadiusWithPath
					path={'border'}
					{...commonOptions}
					withColor={false}
				/>

				<SeparatorHorizontalLine />

				<BoxShadowWithPath path={'boxShadow'} {...commonOptions} />
			</BaseControl>
		</PanelBody>
	);
};

export { WooCommerceButton };
