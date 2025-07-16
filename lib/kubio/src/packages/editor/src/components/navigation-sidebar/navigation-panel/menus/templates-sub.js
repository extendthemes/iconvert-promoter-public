import { __experimentalNavigationMenu as NavigationMenu } from '@wordpress/components';
import { map } from 'lodash';
import TemplateNavigationItem from '../template-navigation-item';

export default function TemplatesSubMenu({
	menu,
	title,
	templates,
	parentMenu,
}) {
	const isEmpty = !templates || templates.length === 0;

	return (
		!isEmpty && (
			<NavigationMenu
				menu={menu}
				title={title}
				parentMenu={parentMenu}
				isEmpty={isEmpty}
			>
				{map(templates, (template) => (
					<TemplateNavigationItem
						item={template}
						key={`wp_template-${template.id}`}
					/>
				))}
			</NavigationMenu>
		)
	);
}
