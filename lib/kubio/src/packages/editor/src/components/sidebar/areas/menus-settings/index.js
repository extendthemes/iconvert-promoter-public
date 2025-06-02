import { InputControl } from '@kubio/controls';
import { BaseControl, Button, Popover } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { store as noticesStore } from '@wordpress/notices';
import SubSidebarArea from '../../subsidebar-area';
import { MenuSettingsArea } from './menu-settings-area';

const CreateMenuButton = () => {
	const [isPopoverVisible, setIsPopoverVisible] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [name, setName] = useState('');
	const ref = useRef();
	const { saveMenu } = useDispatch('core');
	const { createErrorNotice, createInfoNotice } = useDispatch(noticesStore);

	const onClick = useCallback(() => {
		if (isCreating) {
			createInfoNotice(
				__('Another menu creation is in progress', 'kubio'),
				{
					type: 'snackbar',
				}
			);
			return;
		}

		setIsPopoverVisible(!isPopoverVisible);
		setName('');
	}, [isPopoverVisible, setIsPopoverVisible, isCreating]);

	const onSave = useCallback(async () => {
		if (isCreating) {
			return;
		}

		setIsCreating(true);
		try {
			await saveMenu({ name });
		} catch (e) {
			createErrorNotice(__('Menu creation failed', 'kubio'), {
				type: 'snackbar',
			});
		}
		setIsPopoverVisible(false);
		setIsCreating(false);
	}, [setIsPopoverVisible, saveMenu, name, isCreating, setIsCreating]);

	return (
		<>
			<BaseControl className={'kubio-create-menu-button'}>
				<Button
					onClick={onClick}
					isPrimary
					className={'kubio-button-100'}
					ref={ref}
					isBusy={isCreating}
				>
					{__('Create menu', 'kubio')}
				</Button>
			</BaseControl>
			{isPopoverVisible && (
				<Popover
					position={'middle left'}
					className={`kubio-options-popover`}
					anchorRef={ref.current}
					onClose={() => setIsPopoverVisible(false)}
					offset={6}
				>
					<div>
						<BaseControl>
							<InputControl
								label={__('Menu name', 'kubio')}
								onChange={setName}
								value={name}
								disabled={isCreating}
							/>
						</BaseControl>
						<BaseControl>
							<Button
								onClick={onSave}
								isPrimary
								disabled={isCreating}
								isBusy={isCreating}
								className={'kubio-button-100'}
							>
								{__('Create menu', 'kubio')}
							</Button>
						</BaseControl>
					</div>
				</Popover>
			)}
		</>
	);
};

const MenuList = ({ areaIdentifier }) => {
	const { menus } = useSelect((select) => {
		const { getMenus, isResolving, hasFinishedResolution } = select('core');

		const menusParameters = [{ per_page: -1 }];

		return {
			menus: getMenus(...menusParameters),
			isResolvingMenus: isResolving('getMenus', menusParameters),
			hasResolvedMenus: hasFinishedResolution(
				'getMenus',
				menusParameters
			),
		};
	});

	return (
		<>
			{menus?.map((menu) => (
				<MenuSettingsArea
					key={menu.id}
					parentAreaIdentifier={areaIdentifier}
					menu={menu}
				/>
			))}
		</>
	);
};

export default function MenusSettingsArea({ parentAreaIdentifier }) {
	const AREA_IDENTIFIER = `${parentAreaIdentifier}/menus-settings`;

	return (
		<>
			<SubSidebarArea
				title={__('Menus', 'kubio')}
				areaIdentifier={AREA_IDENTIFIER}
			>
				<MenuList areaIdentifier={AREA_IDENTIFIER} />
				<CreateMenuButton />
			</SubSidebarArea>
		</>
	);
}
