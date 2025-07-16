import { useEffect } from '@wordpress/element';
import { UIUtils } from '@kubio/controls';
import { BlockControls } from '@wordpress/block-editor';
import {
	Dropdown,
	ToolbarGroup,
	ToolbarButton,
	MenuGroup,
	MenuItemsChoice,
} from '@wordpress/components';
import { __, _n, sprintf } from '@wordpress/i18n';
import { DOWN } from '@wordpress/keycodes';
import { grid } from '@wordpress/icons';
import { useActiveMedia } from '@kubio/core';

const POPOVER_PROPS = {
	isAlternate: true,
};

const ITEMS_PER_ROW = UIUtils.itemsPerRowOptions;

const EqualColumnsToggle = ({ dataHelper }) => {
	const isEqualWidth = dataHelper.getProp('layout.equalWidth');
	const activeMedia = useActiveMedia();

	if (!isEqualWidth) {
		return <></>;
	}

	const itemsPerRow = dataHelper.getPropInMedia(
		'layout.itemsPerRow',
		dataHelper.getProp('layout.itemsPerRow'),
		{
			media: activeMedia,
		}
	);

	const onChangeItemsPerRow = (newItemsPerRow) => {
		dataHelper.setPropInMedia('layout.itemsPerRow', newItemsPerRow, {
			media: activeMedia,
		});
	};

	return (
		<BlockControls>
			<ToolbarGroup>
				<Dropdown
					popoverProps={POPOVER_PROPS}
					renderToggle={({ onToggle, isOpen }) => {
						const openOnArrowDown = (event) => {
							if (!isOpen && event.keyCode === DOWN) {
								event.preventDefault();
								event.stopPropagation();
								onToggle();
							}
						};

						return (
							<ToolbarButton
								icon={grid}
								label={__('Columns per row', 'kubio')}
								onClick={onToggle}
								aria-expanded={isOpen}
								onKeyDown={openOnArrowDown}
							/>
						);
					}}
					renderContent={() => (
						<MenuGroup label={__('Items per row', 'kubio')}>
							<MenuItemsChoice
								choices={ITEMS_PER_ROW.map(({ value }) => ({
									value,
									label: sprintf(
										// translators: number of items per row
										_n(
											'%d item',
											'%d items',
											value,
											'kubio'
										),
										value
									),
								}))}
								value={itemsPerRow}
								onSelect={(nextValue) =>
									onChangeItemsPerRow(nextValue)
								}
							/>
						</MenuGroup>
					)}
				/>
			</ToolbarGroup>
		</BlockControls>
	);
};

export { EqualColumnsToggle };
