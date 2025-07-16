import { StatesControl } from '@kubio/advanced-panel';
import {
	BordersAndRadiusWithPath,
	BoxUnitValueControlWithPath,
	ColorWithPath,
	SeparatorHorizontalLine,
	TypographyControlPopupWithPath,
} from '@kubio/controls';
import { WithDataPathTypes } from '@kubio/core';
import { useGlobalDataStyle } from '@kubio/global-data';
import { BaseControl, PanelBody } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const FormFields = () => {
	const availableStates = ['normal', 'hover', 'focus', 'disabled'];
	const [state, setState] = useState('');
	const { globalStyle, resetToInitialData } = useGlobalDataStyle();
	const styledElement = 'form-fields';

	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: styledElement,
		dataHelper: globalStyle,
	};

	return (
		<PanelBody initialOpen={false} title={__('Form fields', 'kubio')}>
			{/* eslint-disable-next-line @wordpress/no-base-control-with-label-without-id */}
			<BaseControl label={__('State', 'kubio')}>
				<StatesControl
					activeState={state}
					setActiveState={setState}
					availableStates={availableStates}
				/>

				<ColorWithPath
					label={__('Text color', 'kubio')}
					path={'typography.color'}
					state={state}
					{...commonOptions}
					onReset={resetToInitialData('typography.color', {
						styledComponent: styledElement,
						state,
					})}
				/>

				<ColorWithPath
					label={__('Background color', 'kubio')}
					state={state}
					path={'background.color'}
					showReset={true}
					{...commonOptions}
					onReset={resetToInitialData('background.color', {
						styledComponent: styledElement,
						state,
					})}
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
					onReset={resetToInitialData(
						[
							'border.top.color',
							'border.bottom.color',
							'border.left.color',
							'border.right.color',
						],
						{ styledComponent: styledElement, state }
					)}
				/>

				<SeparatorHorizontalLine />

				<TypographyControlPopupWithPath
					path={'typography'}
					{...commonOptions}
					onReset={resetToInitialData('typography', {
						styledComponent: styledElement,
					})}
				/>

				<SeparatorHorizontalLine />

				<BoxUnitValueControlWithPath
					label={__('Padding', 'kubio')}
					path={'padding'}
					{...commonOptions}
					onReset={resetToInitialData('padding', {
						styledComponent: styledElement,
					})}
				/>

				<BoxUnitValueControlWithPath
					label={__('Margin', 'kubio')}
					path={'margin'}
					{...commonOptions}
					onReset={resetToInitialData('margin', {
						styledComponent: styledElement,
					})}
				/>

				<SeparatorHorizontalLine />

				<BordersAndRadiusWithPath
					path={'border'}
					{...commonOptions}
					withColor={false}
					onReset={resetToInitialData('border', {
						styledComponent: styledElement,
					})}
				/>
			</BaseControl>
		</PanelBody>
	);
};

export { FormFields };
