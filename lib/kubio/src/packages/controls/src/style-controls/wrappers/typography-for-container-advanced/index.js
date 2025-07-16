import TypographyForContainerWithPath from '../typography-for-container-wrapper';
import PopoverOptionsButton from '../../../components/popover-options-button';
import { memo } from '@wordpress/element';
import _ from 'lodash';
import { __ } from '@wordpress/i18n';
import { AdvancedTypographyPopup } from './advanced-typography-popup';
import { useDataHelperDefaultOptionsContext } from '@kubio/core';

const TypographyForContainerAdvanced = memo((props) => {
	const dataHelperDefaultOptions = useDataHelperDefaultOptionsContext();
	const { defaultOptions: inheritedOptions = {} } = dataHelperDefaultOptions;

	const onReset = () => {
		const { dataHelper } = props;
		dataHelper.setStyle('typography', null, {
			...inheritedOptions,
			unset: true,
		});
	};

	const advancedPopup = (
		<PopoverOptionsButton
			label={__('Advanced', 'kubio')}
			popoverWidth={300}
			showReset
			onReset={onReset}
			popupContent={<AdvancedTypographyPopup hideReset {...props} />}
		/>
	);
	return (
		<>
			<TypographyForContainerWithPath
				nodeType={''}
				path={'typography'}
				afterColors={advancedPopup}
				{...props}
			/>
		</>
	);
});

export { TypographyForContainerAdvanced };
