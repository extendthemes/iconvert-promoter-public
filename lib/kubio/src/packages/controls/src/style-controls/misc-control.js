import { WithDataPathTypes } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import { InputControlWithPath } from './wrappers/input-wrapper';
import { SelectControlWithPath } from './wrappers/select-control';
import { BaseControl, Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { STORE_KEY } from '@kubio/constants';
import { isFunction } from 'lodash';

const overflowValues = {
	VISIBLE: 'visible',
	HIDDEN: 'hidden',
	// HIDDEN_HORIZONTAL: 'hidden visible',
	// HIDDEN_VERTICAL: 'visible hidden',
};

const overflowOptions = [
	{ label: __('Visible', 'kubio'), value: overflowValues.VISIBLE },
	{ label: __('Hidden', 'kubio'), value: overflowValues.HIDDEN },
	// {
	// 	label: __('Hidden horizontal', 'kubio'),
	// 	value: overflowValues.HIDDEN_HORIZONTAL,
	// },
	// {
	// 	label: __('Hidden vertical', 'kubio'),
	// 	value: overflowValues.HIDDEN_VERTICAL,
	// },
];

const MiscControl = (props) => {
	const { openSidebar } = useDispatch(STORE_KEY) || {};
	const { clearSelectedBlock } = useDispatch('core/block-editor');

	const openCustomCssMenu = () => {
		clearSelectedBlock();
		setTimeout(() => {
			if (isFunction(openSidebar)) {
				openSidebar(`document/general-settings/additional-css`);
			}
		}, 500);
	};

	return (
		<>
			<InputControlWithPath
				numeric
				path="zIndex"
				label={__('Z Index', 'kubio')}
			/>
			<SelectControlWithPath
				path="overflow"
				options={overflowOptions}
				defaultValue="visible"
				label={__('Overflow option', 'kubio')}
				inlineLabel={false}
			/>
			<InputControlWithPath
				label={__('HTML anchor (ID)', 'kubio')}
				type={WithDataPathTypes.ATTRIBUTE}
				defaultValue={''}
				path={'anchor'}
				className={'kubio-preserve-caps'}
			/>
			<InputControlWithPath
				label={__('Additional CSS class(es)', 'kubio')}
				type={WithDataPathTypes.ATTRIBUTE}
				defaultValue={''}
				path={'className'}
				className={'kubio-preserve-caps'}
			/>			
		</>
	);
};

export { MiscControl };
