import { __experimentalNavigationMenu as NavigationMenu } from '@wordpress/components';
import { map } from 'lodash';
import { MENU_TEMPLATE_PARTS } from '../constants';
import TemplateNavigationItem from '../template-navigation-item';

export default function TemplatePartsSubMenu({ menu, title, templateParts }) {
	return (
		<NavigationMenu
			menu={menu}
			title={title}
			parentMenu={MENU_TEMPLATE_PARTS}
			isEmpty={!templateParts || templateParts.length === 0}
		>
			{map(templateParts, (templatePart) => (
				<TemplateNavigationItem
					item={templatePart}
					key={`wp_template_part-${templatePart.id}`}
				/>
			))}
		</NavigationMenu>
	);
}
