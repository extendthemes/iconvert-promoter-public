import { StatesControl } from '@kubio/advanced-panel';
import { STORE_KEY } from '@kubio/constants';
import {
	ColorIndicatorPopover,
	ControlNotice,
	FontPicker,
	GutentagSelectControl,
	InlineLabeledControl,
	PopoverOptionsButton,
	RangeWithUnitControl,
	SeparatorHorizontalLine,
	ToggleGroup,
	TypeKitSetupInterface,
	TypographyConfig,
} from '@kubio/controls';
import { useGlobalDataFonts, useGlobalDataStyle } from '@kubio/global-data';
import {
	BaseControl,
	Flex,
	FlexBlock,
	FlexItem,
	PanelBody,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _, { omit } from 'lodash';
import SubSidebarArea from '../../subsidebar-area';
import { properties } from './config';
import { GoogleFontsSettings } from './google-fonts-settings';

const {
	weightOptions,
	sizeUnitsOptions,
	sizeUnitsConfig,
	styleOptions,
	transformOptions,
	decorationOptions,
} = TypographyConfig;

const useContainerTypographyElementGetterSetter = (
	colibriData,
	element,
	getStyleDefaultGlobalValue,
	getStyleInitialDefaultGlobalValue
) => {
	const baseOptions = {
		styledComponent: 'body',
	};
	const setTypography = (path, value, options = {}) => {
		const state = options.state ? `states.${options.state}` : null;
		options = omit(options, 'state');
		const combinedPaths = ['typography', 'holders', element, state, path]
			.filter(Boolean)
			.join('.');
		const mergedOptions = _.merge({}, baseOptions, options);
		colibriData.setStyle(combinedPaths, value, mergedOptions);
	};
	const getTypography = (path, fallback = '', options = {}) => {
		const state = options.state ? `states.${options.state}` : null;
		options = omit(options, 'state');
		const combinedPaths = ['typography', 'holders', element, state, path]
			.filter(Boolean)
			.join('.');
		const mergedOptions = _.merge({}, baseOptions, options);
		return colibriData.getStyle(combinedPaths, fallback, mergedOptions);
	};
	const unsetTypography = (path, options = {}) => {
		const state = options.state ? `states.${options.state}` : null;
		options = omit(options, 'state');
		const combinedPaths = ['typography', 'holders', element, state, path]
			.filter(Boolean)
			.join('.');
		const mergedOptions = _.merge({}, baseOptions, options);

		const defaultValue = getStyleInitialDefaultGlobalValue(
			combinedPaths,
			mergedOptions
		);
		colibriData.setStyle(combinedPaths, defaultValue, mergedOptions);
	};

	return {
		setTypography,
		getTypography,
		unsetTypography,
	};
};

const useGlobalTypoGetterSetter = (element) => {
	const {
		globalStyle,
		getStyleDefaultGlobalValue,
		getStyleInitialDefaultGlobalValue,
	} = useGlobalDataStyle();
	return useContainerTypographyElementGetterSetter(
		globalStyle,
		element,
		getStyleDefaultGlobalValue,
		getStyleInitialDefaultGlobalValue
	);
};

const ElementStyleAdvanced = ({
	getTypography,
	setTypography,
	unsetTypography,
	showTransform = false,
	showDecoration = true,
}) => {
	return (
		<PopoverOptionsButton
			label={__('Advanced', 'kubio')}
			popoverWidth={250}
			popupContent={
				<>
					{showTransform && (
						<GutentagSelectControl
							label={__('Transform', 'kubio')}
							options={transformOptions}
							value={getTypography('transform')}
							onChange={(value) =>
								setTypography('transform', value)
							}
						/>
					)}

					{showDecoration && (
						<GutentagSelectControl
							label={__('Decoration', 'kubio')}
							options={decorationOptions}
							value={getTypography('decoration', '')}
							onChange={(value) =>
								setTypography('decoration', value)
							}
						/>
					)}

					<GutentagSelectControl
						label={__('Style', 'kubio')}
						options={styleOptions}
						value={getTypography('style')}
						onChange={(value) => setTypography('style', value)}
					/>

					<SeparatorHorizontalLine fit={true} />

					<RangeWithUnitControl
						label={__('Line Height', 'kubio')}
						value={getTypography('lineHeight')}
						onChange={(value) => setTypography('lineHeight', value)}
						onReset={() => unsetTypography('lineHeight')}
						defaultUnit={''}
						min={0}
						max={10}
						step={0.1}
					/>

					<RangeWithUnitControl
						label={__('Letter Spacing', 'kubio')}
						value={getTypography('letterSpacing', {
							value: '',
							unit: 'px',
						})}
						onChange={(value) =>
							setTypography('letterSpacing', value)
						}
						onReset={() => unsetTypography('letterSpacing')}
						min={0}
						max={10}
						step={0.1}
						units={sizeUnitsOptions}
					/>
				</>
			}
		/>
	);
};

const ElementStyle = ({ element = 'h1' }) => {
	const {
		getTypography,
		setTypography,
		unsetTypography,
	} = useGlobalTypoGetterSetter(element);
	const { getFontWeights } = useGlobalDataFonts();

	const fontWeights = getFontWeights(getTypography('family'));
	const currentWeights = weightOptions.filter(
		(weight) => fontWeights.indexOf(weight.value) !== -1
	);

	// Set font weight to a existing one if current not found.
	// const currentWeight = parseInt(getTypography('weight'));
	// const currentWeightFound = _.find(currentWeights, function (o) {
	// 	return o.value === currentWeight;
	// });
	// if (undefined === currentWeightFound) {
	// 	setTypography(
	// 		'weight',
	// 		currentWeights.length > 0 ? currentWeights[0].value : 400
	// 	);
	// }

	return (
		<BaseControl>
			{/*<InlineLabeledControl label={ __( 'Font Family', 'kubio' ) }>*/}

			<Flex className="kubio-font-family-container general-typography">
				<FlexBlock>
					<span className={'kubio-font-family-label'}>
						{__('Font family', 'kubio')}
					</span>
				</FlexBlock>
				<FlexBlock className="kubio-font-family-container__select">
					<FontPicker
						value={getTypography('family')}
						onChange={(value) => setTypography('family', value)}
					/>
				</FlexBlock>
			</Flex>
			{/*</InlineLabeledControl>*/}

			<GutentagSelectControl
				className={'kubio-select-control-container'}
				label={__('Font weight', 'kubio')}
				options={currentWeights}
				value={parseInt(getTypography('weight'))}
				onChange={(value) => setTypography('weight', value)}
			/>

			<InlineLabeledControl label={__('Color', 'kubio')}>
				<ColorIndicatorPopover
					color={getTypography('color')}
					onChange={(value) => setTypography('color', value)}
					onReset={() => unsetTypography('color')}
					showReset
				/>
			</InlineLabeledControl>

			<RangeWithUnitControl
				label={__('Size', 'kubio')}
				units={sizeUnitsOptions}
				optionsByUnit={sizeUnitsConfig}
				onChange={(value) => setTypography('size', value)}
				value={getTypography('size')}
				onReset={() => unsetTypography('size')}
			/>

			<ElementStyleAdvanced
				getTypography={getTypography}
				setTypography={setTypography}
				unsetTypography={unsetTypography}
				showTransform={true}
			/>
		</BaseControl>
	);
};

const LinkStyle = () => {
	const availableStates = ['normal', 'hover', 'visited'];
	const [state, setState] = useState('');
	const element = 'a';

	const {
		getTypography,
		setTypography,
		unsetTypography,
	} = useGlobalTypoGetterSetter(element);

	return (
		<>
			<BaseControl>
				<Flex className="kubio-font-family-container">
					<FlexBlock>
						<span className={'kubio-font-family-label'}>
							{__('Font family', 'kubio')}
						</span>
					</FlexBlock>
					<FlexItem>
						<FontPicker
							label={__('Font family', 'kubio')}
							value={getTypography('family')}
							onChange={(value) => setTypography('family', value)}
						/>
					</FlexItem>
				</Flex>

				<GutentagSelectControl
					label={__('Font Weight', 'kubio')}
					options={weightOptions}
					value={parseInt(getTypography('weight'))}
					onChange={(value) => setTypography('weight', value)}
				/>

				<RangeWithUnitControl
					label={__('Size', 'kubio')}
					units={sizeUnitsOptions}
					value={getTypography('size')}
					onChange={(value) => setTypography('size', value)}
					onReset={() => unsetTypography('size')}
				/>

				{/* eslint-disable-next-line @wordpress/no-base-control-with-label-without-id */}
				<BaseControl label={__('State', 'kubio')}>
					<StatesControl
						activeState={state}
						setActiveState={setState}
						availableStates={availableStates}
					/>
				</BaseControl>

				<InlineLabeledControl label={__('Color', 'kubio')}>
					<ColorIndicatorPopover
						color={getTypography('color', '', { state })}
						onChange={(value) =>
							setTypography('color', value, { state })
						}
						onReset={() => {
							unsetTypography('color', { state });
						}}
						showReset
					/>
				</InlineLabeledControl>

				<GutentagSelectControl
					label={__('Decoration', 'kubio')}
					options={decorationOptions}
					value={getTypography('decoration', '', { state })}
					onChange={(value) =>
						setTypography('decoration', value, { state })
					}
				/>

				<SeparatorHorizontalLine />

				<ElementStyleAdvanced
					getTypography={getTypography}
					setTypography={setTypography}
					unsetTypography={unsetTypography}
					showTransform={true}
					showDecoration={false}
				/>
			</BaseControl>
		</>
	);
};

const GlobalTypographyPanel = () => {
	const [currentHeading, setCurrentHeading] = useState('h1');

	const isKubioTheme = useSelect((select) => {
		return select('kubio/edit-site')?.getSettings()?.isKubioTheme || null;
	});

	return (
		<>
			<PanelBody initialOpen={false} title={__('Headings', 'kubio')}>
				<ToggleGroup
					label={__('Heading Type', 'kubio')}
					options={properties.headingType.options}
					value={currentHeading}
					onChange={setCurrentHeading}
				/>
				<ElementStyle element={currentHeading} />
			</PanelBody>

			<PanelBody initialOpen={false} title={__('Texts', 'kubio')}>
				<ElementStyle element="p" />
			</PanelBody>

			<PanelBody initialOpen={false} title={__('Lead text', 'kubio')}>
				<ElementStyle element="lead" />
			</PanelBody>

			<PanelBody initialOpen={false} title={__('Links', 'kubio')}>
				<LinkStyle />
			</PanelBody>

			<PanelBody initialOpen={false} title={__('Adobe TypeKit', 'kubio')}>
				<TypeKitSetupInterface showNotice={true} />
			</PanelBody>

			<PanelBody
				initialOpen={false}
				title={__('Google Fonts Settings', 'kubio')}
			>
				<GoogleFontsSettings showNotice={true} />
			</PanelBody>

			{!isKubioTheme && (
				<ControlNotice
					className={'notice-general-settings'}
					content={__(
						'These settings are applied to Kubio blocks and the blocks within.',
						'kubio'
					)}
				/>
			)}
		</>
	);
};

const GlobalTypographyPanelWrapper = ({ areaIdentifier }) => {
	const isOpened = useSelect((select) => {
		return select(STORE_KEY).isEditorSidebarOpened(areaIdentifier);
	}, []);

	if (!isOpened) {
		return <></>;
	}

	return <GlobalTypographyPanel />;
};

const GlobalTypography = ({ parentAreaIdentifier }) => {
	return (
		<SubSidebarArea
			title={__('Typography', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/typography`}
		>
			<GlobalTypographyPanelWrapper
				areaIdentifier={`${parentAreaIdentifier}/typography`}
			/>
		</SubSidebarArea>
	);
};
export default GlobalTypography;

export { useContainerTypographyElementGetterSetter, ElementStyleAdvanced };
