/**
 * WordPress dependencies
 */
import {
	__experimentalNavigation as Navigation,
	__experimentalNavigationItem as NavigationItem,
	__experimentalNavigationMenu as NavigationMenu,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { STORE_NAME } from '../../../store/constants';
import { MENU_TEMPLATES, MENU_TEMPLATE_PARTS } from './constants';
import TemplatePartsMenu from './menus/template-parts';
/**
 * Internal dependencies
 */
import TemplatesMenu from './menus/templates';

export default function TemplatesNavigation({ activeMenu, onActivateMenu }) {
	const { postId, postType } = useSelect((select) => {
		const { getEditedPostType, getEditedPostId } = select(STORE_NAME);

		return {
			postId: getEditedPostId(),
			postType: getEditedPostType(),
		};
	}, []);

	const setActive = (next) => {
		onActivateMenu(next);
	};

	return (
		<Navigation
			activeItem={`${postType}-${postId}`}
			activeMenu={activeMenu}
			onActivateMenu={setActive}
		>
			<NavigationMenu title={__('Advanced', 'kubio')}>
				<NavigationItem
					title={__('Templates', 'kubio')}
					navigateToMenu={MENU_TEMPLATES}
				/>

				<NavigationItem
					title={__('Template Parts', 'kubio')}
					navigateToMenu={MENU_TEMPLATE_PARTS}
				/>
				<TemplatesMenu activeMenu={activeMenu} />
				<TemplatePartsMenu />
			</NavigationMenu>
		</Navigation>
	);
}
