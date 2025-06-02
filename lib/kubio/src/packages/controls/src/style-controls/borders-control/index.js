import { types } from '@kubio/style-manager';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _, { each, get } from 'lodash';
import isEqual from 'react-fast-compare';
import BorderControl from '../../components/border-control';
import { BoxUnitValueControl } from '../../components/box-control-unit-value';

const RADIUS_UNITS = [
	{
		label: 'PX',
		value: 'px',
	},
	{
		label: '%',
		value: '%',
	},
];

const BordersAndRadiusControl = (props) => {
	const {
		value: initialValue = {},
		onChange: onValueChange = _.noop,
		onReset = _.noop,
	} = props;
	const [value, setValue] = useState(initialValue || {});
	const onChange = (nextValue) => {
		onValueChange(nextValue);
		setValue(_.merge({}, initialValue, nextValue));
	};
	useEffect(() => {
		if (!isEqual(initialValue, value)) {
			setValue(initialValue);
		}
	}, [initialValue]);

	const mergedValue = _.merge({}, types.props.border.default, value);

	const radiusMap = {
		top: 'top.radius.left',
		right: 'top.radius.right',
		bottom: 'bottom.radius.right',
		left: 'bottom.radius.left',
	};
	const borderRadius = {};
	each(radiusMap, (path, side) => {
		borderRadius[side] = get(mergedValue, path);
	});
	const onBorderRadiusChange = (nextValue) => {
		const changes = {};
		// eslint-disable-next-line no-shadow
		_.each(nextValue, (value, side) => {
			const path = _.get(radiusMap, side);
			_.set(changes, path, value);
		});

		onChange(changes);
	};
	const onBorderRadiusReset = () => {
		//some data will stil be present in the border after reset like top.radius = {}. But at publish refresh it gets
		//cleaned up
		each(radiusMap, (path, side) => {
			onReset(path);
		});
	};
	return (
		<>
			<BorderControl {...props} />
			<BoxUnitValueControl
				isRadius={true}
				label={__('Radius', 'kubio')}
				value={borderRadius}
				onChange={onBorderRadiusChange}
				onReset={onBorderRadiusReset}
				units={RADIUS_UNITS}
			/>
		</>
	);
};

export { BordersAndRadiusControl };
