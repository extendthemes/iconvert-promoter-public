import { ProItem } from '@kubio/pro';
import { BaseControl, Button, Tooltip } from '@wordpress/components';
import classnames from 'classnames';
import { isArray } from 'lodash';
const getIcon = (item) => {
	const { icon, value } = item;
	if (icon) {
		try {
			icon.key = icon.key || `${value}-icon`;
			if (isArray(icon.props.children)) {
				icon.props.children.forEach(
					(child, index) =>
						(child.key =
							child.key || `${value}-icon-child-${index}`)
				);
			}
		} catch (e) {}
	}
	return icon;
};
const ItemComponent = ({ item, onChange, value, utmSource = 'option' }) => {
	return (
		<Tooltip key={item.value} text={item.label} position={'top center'}>
			<ProItem
				tag={Button}
				item={item}
				className={classnames('h-select-with-icon__item', {
					'h-select-with-icon__item--active': item.value === value,
					'h-select-with-icon__item--dummy': item.isDummy,
				})}
				urlArgs={{ source: utmSource, content: item.value }}
				key={item.value}
				icon={getIcon(item)}
				onClick={() => {
					if (!item.isDummy && item.value !== value) {
						onChange(item.value);
					}
				}}
			/>
		</Tooltip>
	);
};
const SelectWithIconControl = (props) => {
	const { label = '', value, options = [], onChange, utmSource } = props;

	return (
		<BaseControl className="kubio-control">
			<BaseControl.VisualLabel>{label} </BaseControl.VisualLabel>
			<div className="h-select-with-icon">
				{options.map((item) => (
					<ItemComponent
						key={item.value}
						item={item}
						value={value}
						onChange={onChange}
						utmSource={utmSource}
					/>
				))}
			</div>
		</BaseControl>
	);
};
const IconButton = ({ item, value, onChange }) => {
	return (
		<Button
			className={classnames('h-select-with-icon__item', {
				'h-select-with-icon__item--active': item.value === value,
			})}
			icon={() => item.icon}
			onClick={() => {
				onChange(item.value);
			}}
		/>
	);
};
export { SelectWithIconControl };
