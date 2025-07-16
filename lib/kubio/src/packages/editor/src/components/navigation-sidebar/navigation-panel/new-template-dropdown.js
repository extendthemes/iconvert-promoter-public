/**
 * External dependencies
 */
/**
 * WordPress dependencies
 */
import {
	Button,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	NavigableMenu,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Icon, plus } from '@wordpress/icons';
import { filter, find, includes, map, uniq } from 'lodash';
import { STORE_NAME } from '../../../store/constants';
import { TEMPLATES_NEW_OPTIONS } from './constants';

export default function NewTemplateDropdown() {
	const {
		defaultTemplateTypes,
		templates,
		classicThemePrimaryTemplates,
	} = useSelect((select) => {
		const { getSettings } = select(STORE_NAME);
		const templateEntities = select('core').getEntityRecords(
			'postType',
			'wp_template'
		);
		return {
			defaultTemplateTypes: getSettings().defaultTemplateTypes,
			classicThemePrimaryTemplates: getSettings()
				.classicThemePrimaryTemplates,
			templates: templateEntities,
		};
	}, []);
	const { addTemplate } = useDispatch(STORE_NAME);

	const createTemplate = (slug) => {
		const { title, description } = find(defaultTemplateTypes, { slug });
		addTemplate({
			content: '__KUBIO_REPLACE_WITH_APPROPRIATE_CONTENT__',
			excerpt: description,
			// Slugs need to be strings, so this is for template `404`
			slug: slug.toString(),
			status: 'publish',
			title,
			kubio_template_source: 'kubio-custom',
		});
	};

	const existingTemplateSlugs = map(templates, 'slug');

	const missingTemplates = filter(
		defaultTemplateTypes,
		(template) =>
			includes(
				uniq([
					...TEMPLATES_NEW_OPTIONS,
					...classicThemePrimaryTemplates,
				]),
				template.slug
			) && !includes(existingTemplateSlugs, template.slug)
	);

	if (!missingTemplates.length) {
		return null;
	}

	return (
		<DropdownMenu
			className="edit-site-navigation-panel__new-template-dropdown"
			icon={null}
			label={__('Add Template', 'kubio')}
			popoverProps={{
				noArrow: false,
			}}
			toggleProps={{
				children: (
					<Button
						isPrimary
						icon={plus}
						iconPosition={'right'}
						className={'kubio-new-page-btn'}
						label={__('New', 'kubio')}
					>
						{__('New', 'kubio')}
					</Button>
				),
				// isSmall: true,
				// isTertiary: true,
			}}
		>
			{({ onClose }) => (
				<NavigableMenu className="edit-site-navigation-panel__new-template-popover">
					<MenuGroup label={__('Add Template', 'kubio')}>
						{map(
							missingTemplates,
							({ title, description, slug }) => (
								<MenuItem
									info={description}
									key={slug}
									onClick={() => {
										createTemplate(slug);
										onClose();
									}}
								>
									{title}
								</MenuItem>
							)
						)}
					</MenuGroup>
				</NavigableMenu>
			)}
		</DropdownMenu>
	);
}
