import { useTemplateData } from '@kubio/core';
import { BaseControl, Button, ButtonGroup, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import _ from 'lodash';
import { ToggleGroup } from '../..';
import { GutentagInputControl } from '../../input-control';
import { TemplateWizardContent } from '../template-wizard';
import { ProItem } from '@kubio/pro';

const actionValues = {
	EDIT: 'edit',
	NEW_PAGE: 'newPage',
};
const actionOptions = [
	{
		value: actionValues.EDIT,
		label: __('All pages using the current header', 'kubio'),
	},
	{
		value: actionValues.NEW_PAGE,
		label: __('This page only', 'kubio'),
	},
];
const ChoiceStep = ({ onNextStep, typeLabel, action, setAction }) => {
	const onAllPages = () => {
		setAction(actionValues.EDIT);
		onNextStep();
	};

	const onCurrentPage = () => {
		setAction(actionValues.NEW_PAGE);
		onNextStep();
	};

	return (
		<>
			<>
				<BaseControl>
					<h2>{`Changes to the ${typeLabel} will affect multiple pages`}</h2>
				</BaseControl>

				<p>
					{__(
						'Would you like to apply these changes to all pages that are using the current template or only for this page?',
						'kubio'
					)}
				</p>

				<ButtonGroup
					className={
						'h-template-part-modal__button-group w-100 justify-content-center'
					}
				>
					<Button isPrimary onClick={onAllPages}>
						{__('Apply to all pages', 'kubio')}
					</Button>
					<ProItem
						tag={Button}
						isSecondary
						onClick={onCurrentPage}
						urlArgs={{
							source: 'inserter',
							content: `create-template`,
						}}
					>
						{__('Apply to this page only', 'kubio')}
					</ProItem>
				</ButtonGroup>
			</>
		</>
	);
};
const ActionStep = (props) => {
	const { action } = props;
	const Component =
		action === actionValues.EDIT
			? NewTemplatePartContent
			: newTemplateContent;

	return <Component {...props} />;
};
const NewTemplatePartContent = ({ typeLabel, onClose, onNewTemplatePart }) => {
	const defaultTemplatePartName = sprintf(__(`New %s`, 'kubio'), typeLabel);
	const [templatePartName, setTemplatePartName] = useState(
		defaultTemplatePartName
	);

	const onCreateTemplatePart = async () => {
		onClose();
		onNewTemplatePart(templatePartName);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		return onCreateTemplatePart();
	};

	return (
		<form onSubmit={handleFormSubmit}>
			<BaseControl>
				<h2>{`Create new ${typeLabel.toLowerCase()}`}</h2>
			</BaseControl>

			<GutentagInputControl
				className={'h-template-wizard__template-group'}
				// translators: %s type label
				label={sprintf(__(`%s name`, 'kubio'), _.capitalize(typeLabel))}
				value={templatePartName}
				onChange={setTemplatePartName}
				debounceDelay={0}
			/>
			<div className={'h-template-wizard__modal__footer'}>
				<Button
					isPrimary
					className="w-100"
					disabled={!templatePartName}
					onClick={onCreateTemplatePart}
				>
					{
						/* translators: %s type label */
						sprintf(__(`Save %s`, 'kubio'), typeLabel)
					}
				</Button>
			</div>
		</form>
	);
};

const newTemplateContent = ({ onClose, onNewTemplate }) => {
	return (
		<TemplateWizardContent
			onClose={onClose}
			onNewTemplate={onNewTemplate}
		/>
	);
};

const wizardBasicSteps = [ChoiceStep, ActionStep];

const StepManager = (props) => {
	const { templateIsUsedOnMultiplePages } = props;
	let wizardSteps = wizardBasicSteps;
	if (!templateIsUsedOnMultiplePages) {
		wizardSteps = [ActionStep];
	}
	const [action, setAction] = useState('edit');
	const [currentStepPosition, setStepPosition] = useState(0);
	const CurrentStepComponent = _.get(wizardSteps, currentStepPosition);
	const onNextStep = () => {
		if (currentStepPosition < wizardSteps.length - 1) {
			setStepPosition(currentStepPosition + 1);
		}
	};
	const onPreviousStep = () => {
		if (currentStepPosition !== 0) {
			setStepPosition(currentStepPosition - 1);
		}
	};
	return (
		<CurrentStepComponent
			{...props}
			onNextStep={onNextStep}
			onPreviousStep={onPreviousStep}
			action={action}
			setAction={setAction}
		/>
	);
};
const TemplatePartWizard = ({ onClose = _.noop, type }) => {
	const {
		onNewTemplatePart,
		onNewTemplate,
		config,
		templateIsUsedOnMultiplePages,
	} = useTemplateData(type);
	const typeLabel = _.get(config, 'label', 'Part');
	return (
		<Modal
			className="h-template-wizard__modal"
			// translators: %s type label
			title={sprintf(__(`New page %s`, 'kubio'), typeLabel)}
			onRequestClose={onClose}
		>
			<StepManager
				onClose={onClose}
				type={type}
				typeLabel={typeLabel}
				onNewTemplatePart={onNewTemplatePart}
				onNewTemplate={onNewTemplate}
				templateIsUsedOnMultiplePages={templateIsUsedOnMultiplePages}
			/>
		</Modal>
	);
};

export { TemplatePartWizard };
