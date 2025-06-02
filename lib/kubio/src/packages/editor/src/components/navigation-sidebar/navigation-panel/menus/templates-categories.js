import { KubioLogo } from '@kubio/icons';
import {
	__experimentalNavigationItem as NavigationItem,
	__experimentalNavigationMenu as NavigationMenu,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { difference, map } from 'lodash';
import {
	CUSTOM_TEMPLATES,
	KUBIO_TEMPLATES,
	MENU_TEMPLATES,
	THEME_TEMPLATES,
} from '../constants';
import NewTemplateDropdown from '../new-template-dropdown';
import TemplateNavigationItem from '../template-navigation-item';
import TemplatesSubMenu from './templates-sub';

const getSourceFilteredTemplates = (templates, source = 'custom') => {
	return (
		!!templates &&
		templates?.filter(
			({ kubio_template_source: _source = 'custom' }) =>
				_source === source
		)
	);
};

export default function TemplateCategories({
	title,
	templates,
	menu,
	hasAdd = true,
	parentMenu = MENU_TEMPLATES,
}) {
	const templatesByCategories = useMemo(() => {
		const result = {};
		const kubioTemplates = getSourceFilteredTemplates(templates, 'kubio');
		const themeTemplates = getSourceFilteredTemplates(templates, 'theme');
		const customTemplates =
			!!templates &&
			difference(templates, [...kubioTemplates, ...themeTemplates]);

		if (kubioTemplates && kubioTemplates.length) {
			result.kubio = kubioTemplates;
		}

		if (themeTemplates && themeTemplates.length) {
			result.theme = themeTemplates;
		}

		if (customTemplates && customTemplates.length) {
			result.custom = themeTemplates;
		}

		return result;
	}, [templates]);

	const showTemplatesDirectly =
		Object.keys(templatesByCategories).length <= 1;

	return (
		<>
			<NavigationMenu
				menu={menu}
				title={title}
				titleAction={hasAdd && <NewTemplateDropdown />}
				parentMenu={parentMenu}
			>
				{
					// if there is only one category display them directly
					showTemplatesDirectly && (
						<>
							{map(templates, (template) => (
								<TemplateNavigationItem
									item={template}
									key={`wp_template-${template.id}`}
									icon={KubioLogo}
								/>
							))}
						</>
					)
				}
				{!showTemplatesDirectly && (
					<>
						<NavigationItem
							navigateToMenu={`${menu}--${KUBIO_TEMPLATES}`}
							title={__('Kubio templates', 'kubio')}
							hideIfTargetMenuEmpty
						/>
						<NavigationItem
							navigateToMenu={`${menu}--${THEME_TEMPLATES}`}
							title={__('Theme templates', 'kubio')}
							hideIfTargetMenuEmpty
						/>
						<NavigationItem
							navigateToMenu={`${menu}--${CUSTOM_TEMPLATES}`}
							title={__('Custom templates', 'kubio')}
							hideIfTargetMenuEmpty
						/>
					</>
				)}
			</NavigationMenu>
			<TemplatesSubMenu
				menu={`${menu}--${KUBIO_TEMPLATES}`}
				title={__('Kubio templates', 'kubio')}
				templates={templatesByCategories.kubio}
				parentMenu={menu}
			/>
			<TemplatesSubMenu
				menu={`${menu}--${THEME_TEMPLATES}`}
				title={__('Theme templates', 'kubio')}
				templates={templatesByCategories.theme}
				parentMenu={menu}
			/>

			<TemplatesSubMenu
				menu={`${menu}--${CUSTOM_TEMPLATES}`}
				title={__('Custom templates', 'kubio')}
				templates={templatesByCategories.custom}
				parentMenu={menu}
			/>
		</>
	);
}
