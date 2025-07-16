import { STORE_KEY } from '@kubio/constants';
import { useTemplateData } from '@kubio/core';
import { ProItem } from '@kubio/pro';
import { Button, ButtonGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';
import { find, noop } from 'lodash';
import { TemplateWizard } from '../template-wizard';
import { useTemplatePartLock } from '../utils';

const onStopPropagation = (e) => {
	e.stopPropagation();
	e.preventDefault();
};

const TemplateLockControls = ({
	isWizardShown,
	setIsWizardShown,
	templatePart,
	onClose = noop,
	showMessage = true,
}) => {
	const {
		onNewTemplate,
		onNewTemplatePart,
		templateIsUsedOnMultiplePages,
	} = useTemplateData(templatePart);

	const createNewTemplate = () => {
		onClose();
		onNewTemplate();
	};
	const { unlock } = useTemplatePartLock(templatePart);

	const onEdit = () => {
		unlock();
	};

	const onCreateTemplate = () => {
		if (templateIsUsedOnMultiplePages) {
			setIsWizardShown(true);
		} else {
			onNewTemplatePart();
			onClose();
		}
	};

	const currentTemplateLabel = useSelect((select) => {
		const {
			getCurrentPageTemplate,
			getCurrentPostType,
			getAvailablePageTemplates,
		} = select(STORE_KEY);

		const currentPostType = getCurrentPostType();
		let currentTemplate = getCurrentPageTemplate();

		//if the current template is the current post type it means the default template. So we set the '' value to be the
		//same as values from the options
		if (currentPostType === currentTemplate) {
			currentTemplate = '';
		}
		const mappedTemplates = getAvailablePageTemplates();

		return find(mappedTemplates, { value: currentTemplate })?.label || '';
	}, []);

	return (
		<div
			onMouseOver={onStopPropagation}
			className="h-template-lock-controls"
			style={{ display: 'none' }}
		>
			{showMessage && (
				<p
					className="h-template-lock-controls__message"
					dangerouslySetInnerHTML={{
						__html:
							currentTemplateLabel === ''
								? sprintf(
										__(
											'Would you like to apply this %s to all pages that are using the current template or only for this page?',
											'kubio'
										),
										templatePart
								  )
								: sprintf(
										__(
											`This %1$s is used on multiple pages. Would you like to edit this %1$s for all pages that are using the "%2$s" template?`,
											'kubio'
										),
										templatePart,
										`<strong>${currentTemplateLabel}</strong>`
								  ),
					}}
				/>
			)}
			<ButtonGroup>
				<Button isPrimary onClick={onEdit}>
					{__('Edit for all pages', 'kubio')}
				</Button>

				<ProItem
					tag={Button}
					isSecondary
					onClick={onCreateTemplate}
					urlArgs={{
						source: 'edit-template-part',
						content: 'this-page-only',
					}}
				>
					{__('Edit for this page only', 'kubio')}
				</ProItem>
			</ButtonGroup>

			{isWizardShown && (
				<TemplateWizard
					onNewTemplate={onNewTemplate}
					onClose={() => {
						setIsWizardShown(false);
					}}
				/>
			)}
		</div>
	);
};

export { TemplateLockControls };
