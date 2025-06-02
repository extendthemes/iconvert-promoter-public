import { createPrimaryMenu } from '@kubio/menu-data';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalInputControl as InputControl,
	BaseControl,
	Button,
	FlexBlock,
	Popover,
	Flex,
	Placeholder,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { navigation as icon } from '@wordpress/icons';

const CreateMenuPopover = ({ containerRef, afterMenuCreation, onClose }) => {
	const [menuName, setMenuName] = useState('');
	const [isPreparingMenu, setIsPreparingMenu] = useState(false);

	const onClick = async () => {
		setIsPreparingMenu(true);
		await createPrimaryMenu(menuName);
		setIsPreparingMenu(false);
		afterMenuCreation();
	};

	return (
		<Popover
			className={'kubio-options-popover kubio-create-menu-popover'}
			anchorRef={containerRef}
			position={'middle right'}
			onClose={onClose}
		>
			<Placeholder
				className="wp-block-navigation-placeholder kubio-menu-placeholder"
				icon={icon}
				label={__('Kubio Menu', 'kubio')}
			>
				{/* added extra div to fix: 0042764: Firefox - If there is no menu and you try to add section as menu item, the displayed pop-up doesn't look ok */}
				<div>
					<div className={'kubio-create-menu-popover-description'}>
						<span>
							{__(
								'There is no header menu created. Please create a new one',
								'kubio'
							)}
						</span>
					</div>
					<div className="wp-block-navigation-placeholder__actions">
						<Flex>
							<FlexBlock>
								<BaseControl
									className={
										'kubio-create-menu-popover-input-control'
									}
								>
									<BaseControl.VisualLabel>
										{__('Menu name', 'kubio')}
									</BaseControl.VisualLabel>
									<InputControl
										value={menuName}
										onChange={setMenuName}
										placeholder={__(
											'Please set a name',
											'kubio'
										)}
									/>
								</BaseControl>
								<Button
									isSecondary
									className="wp-block-navigation-placeholder__button"
									disabled={menuName.length === 0}
									isBusy={isPreparingMenu}
									onClick={onClick}
								>
									{__('Create new Menu', 'kubio')}
								</Button>
							</FlexBlock>
						</Flex>
					</div>
				</div>
			</Placeholder>
		</Popover>
	);
};

export { CreateMenuPopover };
