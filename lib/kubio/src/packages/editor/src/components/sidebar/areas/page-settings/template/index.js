import {
	STORE_KEY,
	templateGroupPriorities,
	templateGroups,
} from '@kubio/constants';
import { GutentagSelectControl, TemplateLoadingOverlay } from '@kubio/controls';
import {
	defaultTemplatesByPostType,
	useDeepMemo,
	useTemplateData,
} from '@kubio/core';

import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';
import { find } from 'lodash';
import PostTemplateActions from './actions';

export function TemplatePanel() {
	const {
		currentPostType,
		currentTemplate,
		currentTemplateLabel,
		availableTemplates,
	} = useSelect((select) => {
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

		return {
			currentPostType,
			currentTemplate,
			currentTemplateLabel:
				find(mappedTemplates, { value: currentTemplate })?.label || '',
			availableTemplates: mappedTemplates,
		};
	}, []);

	const {
		onNewTemplate,
		assignTemplate,
		assignClassicTemplate,
	} = useTemplateData('header');

	const templateOptions = useDeepMemo(() => {
		const groupedTemplates = availableTemplates.reduce((acc, item) => {
			const key = item.source || 'custom';
			return {
				...acc,
				[key]: [...(acc[key] || []), item],
			};
		}, {});

		return templateGroupPriorities
			.map((key) => ({
				label: templateGroups[key],
				items: groupedTemplates[key],
			}))
			.filter((group) => group.items?.length);
	}, [availableTemplates]);

	async function onTemplateChange(nextTemplateSlug) {
		if (
			Object.values(defaultTemplatesByPostType).includes(nextTemplateSlug)
		) {
			nextTemplateSlug = '';
		}
		const template = availableTemplates.find(
			(template_) => template_.value === nextTemplateSlug
		);
		if (!template) {
			return;
		}
		const isClassicTemplate = template?.isClassicTemplate;
		if (!isClassicTemplate) {
			assignTemplate(nextTemplateSlug);
		} else {
			assignClassicTemplate(nextTemplateSlug);
		}
	}

	if (
		currentPostType !== 'page' ||
		currentTemplate?.replace('.php', '') === 'front-page'
	) {
		return <></>;
	}

	return (
		<PanelBody
			title={sprintf(
				/* translators: %s: template title */
				__('Template: %s', 'kubio'),
				currentTemplateLabel
			)}
		>
			<GutentagSelectControl
				hideLabelFromVision
				label={__('Template:', 'kubio')}
				value={currentTemplate}
				onChange={onTemplateChange}
				options={templateOptions}
			/>
			<PostTemplateActions onNewTemplate={onNewTemplate} />
		</PanelBody>
	);
}

export default TemplatePanel;
