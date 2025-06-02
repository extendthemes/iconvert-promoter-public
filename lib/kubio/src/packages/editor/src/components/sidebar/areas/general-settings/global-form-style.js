import { STORE_KEY } from '@kubio/constants';
import { ControlNotice } from '@kubio/controls';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import SubSidebarArea from '../../subsidebar-area';
import { FormFields } from './global-form/fields';
import { FormButton } from './global-form/form-submit';

const FormFieldsWrapper = ({ areaIdentifier }) => {
	const isOpened = useSelect((select) => {
		return select(STORE_KEY).isEditorSidebarOpened(areaIdentifier);
	}, []);

	const isKubioTheme = useSelect((select) => {
		return select('kubio/edit-site')?.getSettings()?.isKubioTheme || null;
	});

	return (
		isOpened && (
			<>
				<FormFields />
				<FormButton
					styledElement={'form-button'}
					title={__('Form button', 'kubio')}
				/>
				<FormButton
					styledElement={'form-submit-button'}
					title={__('Form submit button', 'kubio')}
				/>
				<FormButton
					styledElement={'form-reset-button'}
					title={__('Form reset button', 'kubio')}
				/>

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
		)
	);
};

const GlobalFormStyle = ({ parentAreaIdentifier }) => {
	return (
		<SubSidebarArea
			title={__('Form Elements', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/form-elements`}
		>
			<FormFieldsWrapper
				areaIdentifier={`${parentAreaIdentifier}/form-elements`}
			/>
		</SubSidebarArea>
	);
};

export { GlobalFormStyle };
