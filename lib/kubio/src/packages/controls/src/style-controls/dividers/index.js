import { Separator } from '@kubio/core';
import { separatorConfig } from '@kubio/style-manager';
import { ToggleControl, Tooltip } from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _, { get, merge, set } from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { RangeWithUnitControl, ToggleGroup } from '../../components';
import ColorIndicatorPopover from '../../components/color/color-indicator-popover';
import { PreviewBoxControl } from '../../components/preview-box-control';
import { ControlNotice } from '../../notices';
import { ProItem } from '@kubio/pro';
import { withComputedData } from '@kubio/core';

const selectOptions = [
	{ value: 'bottom', label: __('Bottom', 'kubio') },
	{ value: 'top', label: __('Top', 'kubio') },
];
const heightOptionsByUnit = {
	px: {
		min: 0,
		max: 300,
		step: 1,
	},
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};

const dividerDefaultBgColor = '#949494';

const SeparatorControl_ = (props) => {
	const {
		value: currentValue_ = {},
		onChange = _.noop,
		onReset = _.noop,
		position,
		styledComponent,
		dataHelper,
	} = props;

	const previewBoxControlRef = useRef();
	const closePopup = () => {
		try {
			previewBoxControlRef.current.close();
		} catch (e) {}
	};

	const separators = separatorConfig.separators;
	const defaultValue =
		props?.position === 'top'
			? separatorConfig.default
			: { ...separatorConfig.default, negative: true };

	const currentValue = merge({}, defaultValue, currentValue_);

	const { enabled, type, label, color, negative, height = {} } = currentValue;

	const onPropertyChange = (propName) => (propValue) => {
		const mergedPath = [position, propName].join('.');
		const newValue = set({}, mergedPath, propValue);

		if (propName === 'color') {
			onChange(newValue, null, { media: 'desktop' });
		} else {
			onChange(newValue);
		}
	};

	const onPropertyReset = (propName) => () => {
		const mergedPath = [position, propName].join('.');
		if ('height' === propName) {
			onChange(
				set({}, mergedPath, {
					value: separators[type].defaultSize,
					unit: 'px',
				})
			);
		} else if ('color' === propName) {
			onReset(mergedPath, { media: 'desktop' });
		} else {
			onReset(mergedPath);
		}
	};

	const onDividerChange = (divider) => {
		closePopup();
		const currentSeparatorConfig = get(separators, divider.value);
		const currentSeparatorDefaultSize = get(
			currentSeparatorConfig,
			'defaultSize'
		);

		dataHelper.setStyle(
			'separators',
			{
				[position]: {
					type: divider.value,
					negative: divider.negative,
					label: divider.label,
					height: {
						unit: 'px',
						value: currentSeparatorDefaultSize,
					},
				},
			},
			{ styledComponent: styledComponent, media: 'desktop' }
		);
	};

	const popupContent = (
		<>
			<PerfectScrollbar className={'kubio-divider-list'}>
				{separatorConfig.typeOptions.map((divider, index) => {
					return (
						<Tooltip
							text={divider.label}
							key={divider.value + '-' + index}
						>
							<ProItem
								tag={'div'}
								item={divider}
								role={'button'}
								tabIndex={0}
								key={divider.value + divider?.negative}
								className={
									divider.value === type &&
									divider.negative === negative
										? 'kubio-divider-item selected'
										: 'kubio-divider-item'
								}
								onClick={() => {
									onDividerChange(divider);
								}}
								urlArgs={{
									source: 'style-divider',
									content: divider.value,
								}}
							>
								<Separator
									enabled={true}
									negative={divider.negative}
									type={divider.value}
									position={position}
									height={'40px'}
									color={dividerDefaultBgColor}
									enabledByMedia={{ desktop: true }}
								/>
							</ProItem>
						</Tooltip>
					);
				})}
			</PerfectScrollbar>
		</>
	);

	const labelWithDefault = label ? label : type.replace('-', ' ');

	const previewBoxContent = (
		<>
			<div className="kubio-divider-svg">
				<Separator
					enabled={true}
					type={type}
					negative={negative}
					height={'40px'}
					position={position}
					color={dividerDefaultBgColor}
					enabledByMedia={{ desktop: true }}
				/>
			</div>
		</>
	);

	return (
		<div className={'kubio-divider-container'}>
			<ToggleControl
				className={'kubio-toggle-control'}
				checked={enabled}
				label={__('Enabled', 'kubio')}
				onChange={onPropertyChange('enabled')}
			/>

			{enabled && (
				<div>
					<PreviewBoxControl
						ref={previewBoxControlRef}
						popoverContent={popupContent}
						previewContent={previewBoxContent}
						label={labelWithDefault}
					/>

					<ColorIndicatorPopover
						label={__('Dividers color', 'kubio')}
						value={color}
						onChange={onPropertyChange('color')}
						showReset={true}
						onReset={onPropertyReset('color')}
					/>

					<RangeWithUnitControl
						label={__('Dividers height', 'kubio')}
						value={height}
						capMin={true}
						units={['px', '%']}
						optionsByUnit={heightOptionsByUnit}
						onChange={onPropertyChange('height')}
						onReset={onPropertyReset('height')}
					/>
				</div>
			)}
		</div>
	);
};

const computed = (dataHelper) => {
	return { dataHelper };
};

const SeparatorControl = withComputedData(computed)(SeparatorControl_);

const SeparatorsControl = (props) => {
	const {
		onChange = _.noop,
		onReset = _.noop,
		value: currentValue = {},
		state = '',
		styledComponent,
	} = props;
	const [position, setPosition] = useState('bottom');
	const isNormalState = state === '' || state === 'normal';
	const currentPositionValue = _.get(currentValue, position);

	const onDividerChange = (event) => {
		setPosition(event);
	};

	return (
		<>
			<ToggleGroup
				options={selectOptions}
				value={position}
				onChange={onDividerChange}
			/>

			{isNormalState && (
				<SeparatorControl
					position={position}
					value={currentPositionValue}
					state={state}
					onChange={onChange}
					onReset={onReset}
					styledCompoenent={styledComponent}
				/>
			)}

			{!isNormalState && (
				<ControlNotice
					content={__(
						'The divider can be configured only for the normal state.',
						'kubio'
					)}
				/>
			)}
		</>
	);
};

export { SeparatorsControl };
