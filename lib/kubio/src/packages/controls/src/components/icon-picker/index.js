import { svgIcons } from '@kubio/constants';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { CanvasIcon } from '../canvas-icon';
import { PreviewBoxControl } from '../preview-box-control';
import { IconsList } from './icons/icons-list';

const IconPickerList = (props) => {
	const { value, label = __('Icon', 'kubio') } = props;
	const ref = useRef();

	const [iconName, setIconName] = useState(value || 'font-awesome/star');
	const previewBoxControlRef = useRef();
	const closePopup = () => {
		try {
			previewBoxControlRef.current.close();
		} catch (e) {}
	};
	useEffect(() => {
		if (iconName !== value) {
			setIconName(value);
		}
	}, [value]);

	const onIconChange = (icon) => {
		setIconName(icon);
		closePopup();
		if (props.onChange) {
			props.onChange(icon);
		}
	};

	const packAndIcon = iconName.split('/');
	const popupContent = (
		<IconsList
			list={props.list}
			onChange={onIconChange}
			value={props.value}
		/>
	);

	const previewBoxContent = (
		<CanvasIcon className={'icon-picker__icon-preview'} name={iconName} />
	);
	const pickerLabel =
		packAndIcon[0].replace('-', ' ') + ' / ' + packAndIcon[1];
	return (
		<div ref={ref} className={classNames('icon-preview', 'kubio-control')}>
			<div className={'icon-preview-header title'}>{label}</div>
			<PreviewBoxControl
				ref={previewBoxControlRef}
				popoverContent={popupContent}
				previewContent={previewBoxContent}
				label={pickerLabel}
			/>
		</div>
	);
};

const IconPicker = ({ value, onChange, ...otherProps }) => {
	const { afterIconChange } = otherProps;
	value = value || 'font-awesome/star';
	const onIconChange = (icon) => {
		if (onChange) {
			onChange(icon);

			if (afterIconChange) {
				afterIconChange(icon);
			}
		}
	};

	return (
		<IconPickerList
			list={svgIcons}
			onChange={onIconChange}
			value={value}
			{...otherProps}
		/>
	);
};

export { IconPicker };
