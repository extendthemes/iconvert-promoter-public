import { STORE_KEY } from '@kubio/constants';
import { generateItemInitialData } from '@kubio/menu-data';
import { Button, Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { menu } from '@wordpress/icons';
import classnames from 'classnames';
import { useSectionListMenuContext } from '../menu-context';
import { CreateMenuPopover } from './create-menu-popover';

const MenuToggleIcon = ({ dataHelper, containerRef }) => {
	const [isPopoverVisible, setIsPopoverVisible] = useState(false);
	const [addOnUpdate, setAddOnUpdate] = useState(false);
	const {
		exists: menuExists,
		items,
		setItems,
		hasResolved: menuHasResolved,
	} = useSectionListMenuContext();

	const currentPageURL = useSelect((select) => {
		const { getPage, getEntity } = select(STORE_KEY);
		const pageURL = getPage()?.link || null;
		const entityURL = getEntity()?.path || null;

		return (pageURL || entityURL || '').replace(/\/$/, '');
	}, []);

	useEffect(() => {
		if (addOnUpdate && menuExists && menuHasResolved) {
			setItems(
				[
					{
						...generateItemInitialData(),
						label: dataHelper?.getAttribute('attrs.name'),
						url: `${currentPageURL}/${anchor}`,
					},
				],
				true
			);
			setAddOnUpdate(false);
		}
	}, [menuExists, addOnUpdate, setItems, menuHasResolved]);

	const changeMenuVisibility = useCallback(() => {
		if (sectionMenuItems.length) {
			const sectionMenuItemsIds = sectionMenuItems.map(({ id }) => id);
			const newItems = menuItems.filter(
				(menuItem) => sectionMenuItemsIds.indexOf(menuItem.id) === -1
			);

			setItems([...newItems], true);
		} else {
			const order =
				Math.max.apply(
					null,
					menuItems
						.filter(({ parent }) => parent === 0)
						.map(({ order: itemOrder }) => itemOrder)
						.filter(Boolean)
				) + 1;
			setItems(
				[
					...menuItems,
					{
						...generateItemInitialData(),
						label: dataHelper?.getAttribute('attrs.name'),
						url: `${currentPageURL}/${anchor}`,
						order,
					},
				],
				true
			);
		}
	}, [setItems, items, menuExists, currentPageURL]);

	const menuItems = Array.isArray(items) ? items : [];
	const anchor = '#' + dataHelper?.getAttribute('anchor');

	const sectionMenuItems = useMemo(() => {
		if (!menuExists) {
			return [];
		}
		const filteredItems = menuItems.filter(
			({ url }) =>
				url === `${currentPageURL}/${anchor}` ||
				url === `${currentPageURL}${anchor}`
		);

		if (filteredItems.length) {
			return filteredItems;
		}

		return [];
	}, [menuExists, items, currentPageURL]);

	const toggleMenuVisibility = useCallback(() => {
		if (!menuExists) {
			setIsPopoverVisible(true);
		} else {
			changeMenuVisibility();
		}
	}, [menuExists, changeMenuVisibility]);

	const afterMenuCreation = () => {
		setAddOnUpdate(true);
		setIsPopoverVisible(false);
	};

	const isOnMenu = sectionMenuItems.length > 0;

	return (
		<>
			<Tooltip
				text={
					isOnMenu
						? __('Remove from menu', 'kubio')
						: __('Add to menu', 'kubio')
				}
				position={'top left'}
			>
				<div className={'d-flex'}>
					<Button
						isSmall
						onClick={() => toggleMenuVisibility()}
						icon={menu}
						className={classnames([
							'icon-menu',
							{
								active: isOnMenu,
							},
						])}
					/>
				</div>
			</Tooltip>
			{isPopoverVisible && (
				<CreateMenuPopover
					containerRef={containerRef?.current}
					afterMenuCreation={afterMenuCreation}
					onClose={() => setIsPopoverVisible(false)}
				/>
			)}
		</>
	);
};

export { MenuToggleIcon };
