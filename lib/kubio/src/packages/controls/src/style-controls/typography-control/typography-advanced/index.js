import { BaseControl, Button } from '@wordpress/components';
import { ToggleGroup } from '../../../components';
import _ from 'lodash';
import { __ } from '@wordpress/i18n';
import TypographyControl from '../index';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { STORE_KEY } from '@kubio/constants';
import { withComputedData } from '@kubio/core';
import { applyFilters } from '@wordpress/hooks';

const showEditThemeDefaults = applyFilters(
	'kubio.style-controls.showEditThemeDefaults',
	true
);

const TypographyControlAdvanced_ = (props) => {
	const { label, computed, filters, ...rest } = props;
	const { clearSelectedBlock } = useDispatch('core/block-editor');
	const { openSidebar } = useDispatch(STORE_KEY);
	const { onReset = _.noop } = rest;
	const { openedSidebar = 'document/general-settings/typography' } = filters;
	const { isLead } = computed;

	const nodeType = isLead ? 'lead' : props?.nodeType || 'p';

	const toggleValues = {
		DEFAULTS: 'defaults',
		DIFFERENT: 'different',
	};
	const toggleOptions = [
		{
			value: toggleValues.DEFAULTS,
			label: __('Default', 'kubio'),
		},
		{
			value: toggleValues.DIFFERENT,
			label: __('Different style', 'kubio'),
		},
	];

	const defaultToggleState = rest.value
		? toggleValues.DIFFERENT
		: toggleValues.DEFAULTS;

	const [activeToggle, setToggle] = useState(defaultToggleState);

	return (
		<BaseControl className={'kubio-typography-control-container'}>
			{label && (
				<BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
			)}

			<ToggleGroup
				value={activeToggle}
				options={toggleOptions}
				onChange={(event) => {
					setToggle(event);

					if (activeToggle === toggleValues.DIFFERENT) {
						onReset();
					}
				}}
			/>

			{activeToggle === toggleValues.DIFFERENT && (
				<>
					<TypographyControl
						{...rest}
						nodeType={nodeType}
						withColor={true}
					/>
				</>
			)}

			{activeToggle === toggleValues.DEFAULTS && showEditThemeDefaults && (
				<div
					className={
						'kubio-typography-for-text-button-edit-theme-default'
					}
				>
					<Button
						isPrimary
						onClick={() => {
							clearSelectedBlock().then(() => {
								openSidebar(openedSidebar);
							});
						}}
						className={'kubio-button-100'}
					>
						{__('Edit theme defaults', 'kubio')}
					</Button>
				</div>
			)}
		</BaseControl>
	);
};

const TypographyControlAdvanced = withComputedData((dataHelper) => {
	return {
		isLead: dataHelper.getProp('isLead', false),
	};
})(TypographyControlAdvanced_);

export default TypographyControlAdvanced;
