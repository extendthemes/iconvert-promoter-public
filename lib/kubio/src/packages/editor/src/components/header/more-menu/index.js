/**
 * WordPress dependencies
 */
import {
	convertSiteTemplate,
	useColibriConvertProps,
} from '@kubio/admin-panel';
import { STORE_KEY } from '@kubio/constants';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Modal,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { _x, __ } from '@wordpress/i18n';
import { check, moreVertical } from '@wordpress/icons';
import { ActionItem } from '@wordpress/interface';
/**
 * Internal dependencies
 */
import FeatureToggle from '../feature-toggle';
import ToolsMoreMenuGroup from '../tools-more-menu-group';

const POPOVER_PROPS = {
	className: 'edit-site-more-menu__content',
	position: 'bottom left',
};
const TOGGLE_PROPS = {
	tooltipPosition: 'bottom',
};



const MoreMenu = () => {
	const isGutentagDebug = useSelect((select) =>
		select(STORE_KEY) ? select(STORE_KEY).isGutentagDebug() : false
	);

	const { toggleGutentagDebug } = useDispatch(STORE_KEY);

	let kubioInternalMenu = <></>;


	return (
		<DropdownMenu
			className="edit-site-more-menu"
			icon={moreVertical}
			label={__('More tools & options', 'kubio')}
			popoverProps={POPOVER_PROPS}
			toggleProps={TOGGLE_PROPS}
		>
			{({ onClose }) => (
				<>
					<MenuGroup label={_x('View', 'noun', 'kubio')}>
						{/*<FeatureToggle
							feature="fixedToolbar"
							label={__('Top toolbar', 'kubio')}
							info={__(
								'Access all block and document tools in a single place',
								'kubio'
							)}
							messageActivated={__(
								'Top toolbar activated',
								'kubio'
							)}
							messageDeactivated={__(
								'Top toolbar deactivated',
								'kubio'
							)}
						/>*/}
						<FeatureToggle
							feature="focusMode"
							label={__('Spotlight mode', 'kubio')}
							info={__('Focus on one block at a time', 'kubio')}
							messageActivated={__(
								'Spotlight mode activated',
								'kubio'
							)}
							messageDeactivated={__(
								'Spotlight mode deactivated',
								'kubio'
							)}
						/>

						{kubioInternalMenu}

						<ActionItem.Slot
							name="kubio/edit-site/plugin-more-menu"
							label={__('Plugins', 'kubio')}
							as={[MenuGroup, MenuItem]}
							fillProps={{ onClick: onClose }}
						/>
					</MenuGroup>
					<ToolsMoreMenuGroup.Slot fillProps={{ onClose }} />
				</>
			)}
		</DropdownMenu>
	);
};

export default MoreMenu;
