import {
	Button,
	ButtonGroup,
	Modal,
	PanelBody,
	BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { GutentagInputControl } from '../../input-control';
import { useState, useRef } from '@wordpress/element';
import _ from 'lodash';
import classnames from 'classnames';
import { STORE_KEY } from '@kubio/constants';
import { useSelect } from '@wordpress/data';

const TemplateWizardContent = ({ onClose, onNewTemplate }) => {
	const { pageTitle } = useSelect((select) => {
		const { getEditedEntityRecord } = select('core');
		const page = select(STORE_KEY).getPage();
		const context = page?.context || {};
		const { postId, postType } = context;
		const record = getEditedEntityRecord('postType', postType, postId);
		const pageTitle = _.get(record, 'title', 'new');
		return {
			pageTitle,
		};
	}, []);
	const defaultTitle = `${pageTitle} Template`;
	const [templateName, setTemplateName] = useState(defaultTitle);
	const [isValid, setIsValid] = useState(true);
	const pattern = new RegExp('[a-zA-Z_\\-]+.');

	const onCreateTemplate = async () => {
		if (!pattern.test(templateName)) {
			setIsValid(false);
			return;
		}

		if (!isValid) {
			setIsValid(true);
		}
		onClose();
		onNewTemplate(templateName, { revertEditsOnOriginal: true });
	};
	return (
		<>
			<BaseControl>
				<span>
					{__(
						'Current template is used on multiple pages. Let’s create a custom template for this page',
						'kubio'
					)}
				</span>
			</BaseControl>

			<div>
				<GutentagInputControl
					className={classnames([
						'h-template-wizard__template-group',
						{
							'h-template-wizard__template-group--invalid': !isValid,
						},
					])}
					label={__('TEMPLATE NAME', 'kubio')}
					value={templateName}
					onChange={setTemplateName}
					onEnter={onCreateTemplate}
					placeholder={__('Eg. Page name - Template', 'kubio')}
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={true}
					debounceDelay={0}
				/>
				{!isValid && (
					<div className="h-template-wizard__validation-errors">
						{__(
							'The first character needs to be a alphabetic character',
							'kubio'
						)}
					</div>
				)}
			</div>
			<div className={'h-template-wizard__modal__footer'}>
				<Button
					isPrimary
					className="w-100"
					onClick={onCreateTemplate}
					disabled={!templateName}
				>
					{__('Create template', 'kubio')}
				</Button>
			</div>
		</>
	);
};

const TemplateWizard = (props = {}) => {
	const { onClose = _.noop } = props;
	return (
		<Modal
			className="h-template-wizard__modal"
			title={__('New page template', 'kubio')}
			onRequestClose={onClose}
		>
			<TemplateWizardContent {...props} />
		</Modal>
	);
};

export { TemplateWizard, TemplateWizardContent };
