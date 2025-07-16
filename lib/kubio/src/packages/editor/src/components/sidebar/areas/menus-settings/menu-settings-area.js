import { STORE_KEY } from '@kubio/constants';
import { useMenuBlockEditor } from '@kubio/menu-data';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import SubSidebarArea from '../../subsidebar-area';
import { AddItem } from './menu-structure/add-item';
import { MenuTree } from './menu-structure/menu-tree';

const MenuPanels = ({ menu }) => {
	const {
		setItems,
		items = [],
		isResolving,
		hasResolved,
	} = useMenuBlockEditor(menu.id);

	const addItem = useCallback(
		(newItem) => {
			setItems(
				[
					...items,
					{
						...newItem,
						order: items.length + 1,
					},
				],
				true
			);
		},
		[items]
	);
	return (
		<>
			<PanelBody title={__('Menu Structure', 'kubio')}>
				<MenuTree
					menuId={menu.id}
					items={items}
					setItems={setItems}
					isResolving={isResolving}
					hasResolved={hasResolved}
				/>
				<AddItem addItem={addItem} />
			</PanelBody>
		</>
	);
};

const MenuSettingsAreaMenuContent = ({ menu, areaIdentifier }) => {
	const currentSidebar = useSelect((select) =>
		select(STORE_KEY).getEditorOpenedSidebar()
	);

	const shouldRender =
		currentSidebar && currentSidebar.indexOf(areaIdentifier) !== -1;

	return shouldRender && <MenuPanels menu={menu} />;
};

const MenuSettingsArea = ({ parentAreaIdentifier, menu }) => {
	const AREA_IDENTIFIER = `${parentAreaIdentifier}/menu-${menu.id}`;
	return (
		<SubSidebarArea
			title={sprintf(
				// translators: %s is for the menu name
				__('Menu: %s', 'kubio'),
				menu.name || __('Unnamed menu', 'kubio')
			)}
			label={menu.name || __('Unnamed menu', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={AREA_IDENTIFIER}
		>
			<MenuSettingsAreaMenuContent
				areaIdentifier={AREA_IDENTIFIER}
				menu={menu}
			/>
		</SubSidebarArea>
	);
};

export { MenuSettingsArea };
