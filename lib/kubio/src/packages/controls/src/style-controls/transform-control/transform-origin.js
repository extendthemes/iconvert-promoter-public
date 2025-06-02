import { GutentagSelectControl, RangeWithUnitControl } from '../../components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import _ from 'lodash';

const xOptionsValues = {
	LEFT: 'left',
	CENTER: 'center',
	RIGHT: 'right',
	CUSTOM: 'custom',
};
const yOptionsValues = {
	TOP: 'top',
	CENTER: 'center',
	BOTTOM: 'bottom',
	CUSTOM: 'custom',
};
const xOptions = [
	{ label: __('Left', 'kubio'), value: xOptionsValues.LEFT },
	{ label: __('Center', 'kubio'), value: xOptionsValues.CENTER },
	{ label: __('Right', 'kubio'), value: xOptionsValues.RIGHT },
	{ label: __('Custom', 'kubio'), value: xOptionsValues.CUSTOM },
];
const yOptions = [
	{ label: __('Top', 'kubio'), value: yOptionsValues.TOP },
	{ label: __('Center', 'kubio'), value: yOptionsValues.CENTER },
	{ label: __('Bottom', 'kubio'), value: yOptionsValues.BOTTOM },
	{ label: __('Custom', 'kubio'), value: yOptionsValues.CUSTOM },
];

const units = ['px', 'em', 'rem'];

const TransformOriginControl = (props) => {
	const { value: _currentValue, onChange, onReset } = props;

	const getValue = (path) => {
		return _.get(_currentValue, path);
	};

	const handleChange = (path) => (value) => {
		onChange(path, value);
	};

	return (
		<div className={'kubio-transform-origin-popover'}>
			<GutentagSelectControl
				label={__('X - axis', 'kubio')}
				value={getValue('x.value')}
				onChange={handleChange('x.value')}
				options={xOptions}
			/>
			{getValue('x.value') === xOptionsValues.CUSTOM && (
				<RangeWithUnitControl
					value={getValue('x.customValue')}
					onChange={handleChange('x.customValue')}
					onReset={onReset('x.customValue')}
					units={units}
					capMin={false}
				/>
			)}
			<GutentagSelectControl
				label={__('Y - axis', 'kubio')}
				options={yOptions}
				value={getValue('y.value')}
				onChange={handleChange('y.value')}
			/>
			{getValue('y.value') === xOptionsValues.CUSTOM && (
				<RangeWithUnitControl
					value={getValue('y.customValue')}
					onChange={handleChange('y.customValue')}
					onReset={onReset('y.customValue')}
					units={units}
					capMin={false}
				/>
			)}
			<RangeWithUnitControl
				value={getValue('z.customValue')}
				onChange={handleChange('z.customValue')}
				onReset={onReset('z.customValue')}
				label={__('Z - axis', 'kubio')}
				units={units}
				capMin={false}
			/>
		</div>
	);
};

export { TransformOriginControl };
