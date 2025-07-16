import _ from 'lodash';
import { __ } from '@wordpress/i18n';
import { InlineLabeledControl, PopoverOptionsButton } from '../../components';
import { Button, FormToggle } from '@wordpress/components';
import { BoxShadowContent, useGetMergedValue } from './index';

const BoxShadowPopup = (props) => {
	const { value, onChange, label = __('Box shadow', 'kubio') } = props;

	const {
		mergedValue,
		localEnabledValue,
		onEnabledChange,
	} = useGetMergedValue({ value, onChange });

	return (
		<>
			<PopoverOptionsButton
				label={label}
				toggable={true}
				position={'middle left'}
				onToggleChange={onEnabledChange}
				enabled={!!localEnabledValue}
				popoverWidth={280}
				popupContent={
					<BoxShadowContent
						{...props}
						mergedValue={mergedValue}
						enabled={localEnabledValue}
					/>
				}
			/>
		</>
	);
};

export { BoxShadowPopup };
