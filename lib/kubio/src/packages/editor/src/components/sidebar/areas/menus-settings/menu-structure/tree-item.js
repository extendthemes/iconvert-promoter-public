import { PopoverOptionsButton, MenuItemOptions } from '@kubio/controls';
import { DeleteItemIcon } from '@kubio/icons';
import { stripTags } from '@kubio/utils';
import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Tooltip,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';

const TreeItem = ({
	item: initialItem,
	onItemChange,
	onRemoveItem,
	onTogglePopover,
}) => {
	const [item, setItem] = useState(initialItem);

	useEffect(() => {
		setItem(initialItem);
	}, [initialItem]);

	const onChange = (updates) => {
		const nexItem = {
			...item,
			...updates,
		};
		setItem(nexItem);
		onItemChange(nexItem);
	};

	const ref = useRef();

	return (
		<div ref={ref}>
			<Flex className={'kubio-inspector-menu-item-content'}>
				<FlexBlock>
					<Tooltip text={stripTags(item.label)}>
						<span className={'kubio-inspector-menu-item-label'}>
							{stripTags(item.label)}
						</span>
					</Tooltip>
				</FlexBlock>
				<FlexItem className={'kubio-inspector-menu-items-settings'}>
					<Flex gap={1}>
						<FlexItem>
							<Button
								className={'kubio-inspector-menu-remove-item'}
								isSmall
								iconSize={18}
								onClick={() => onRemoveItem(item)}
								icon={DeleteItemIcon}
							/>
						</FlexItem>
						<FlexItem>
							<PopoverOptionsButton
								iconSize={18}
								popoverClass={'kubio-menu-edit-popover'}
								popoverAnchorRef={ref}
								popupContent={(closePopup) => (
									<MenuItemOptions
										item={item}
										onChange={onChange}
										afterUpdateClick={closePopup}
									/>
								)}
								onPopoverClose={() => onTogglePopover(false)}
								onPopoverOpen={() => onTogglePopover(true)}
							/>
						</FlexItem>
					</Flex>
				</FlexItem>
			</Flex>
		</div>
	);
};

export { TreeItem };
