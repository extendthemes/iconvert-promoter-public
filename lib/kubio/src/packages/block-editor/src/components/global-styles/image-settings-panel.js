/**
 * WordPress dependencies
 */
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	TOOLSPANEL_DROPDOWNMENU_PROPS,
	TOOLSPANEL_DROPDOWNMENU_PROPS_V1,
} from './utils';
import { useUIVersion } from '@kubio/core-hooks';

export function useHasImageSettingsPanel( name, value, inheritedValue ) {
	// Note: If lightbox `value` exists, that means it was
	// defined via the the Global Styles UI and will NOT
	// be a boolean value or contain the `allowEditing` property,
	// so we should show the settings panel in those cases.
	return (
		( name === 'core/image' && inheritedValue?.lightbox?.allowEditing ) ||
		!! value?.lightbox
	);
}

export default function ImageSettingsPanel( {
	onChange,
	value,
	inheritedValue,
	panelId,
} ) {
	const resetLightbox = () => {
		onChange( undefined );
	};

	const onChangeLightbox = ( newSetting ) => {
		onChange( {
			enabled: newSetting,
		} );
	};

	let lightboxChecked = false;

	if ( inheritedValue?.lightbox?.enabled ) {
		lightboxChecked = inheritedValue.lightbox.enabled;
	}

	const { uiVersion } = useUIVersion();

	return (
		<>
			<ToolsPanel
				label={ _x( 'Settings', 'Image settings', 'kubio' ) }
				resetAll={ resetLightbox }
				panelId={ panelId }
				dropdownMenuProps={
					uiVersion === 1
						? TOOLSPANEL_DROPDOWNMENU_PROPS_V1
						: TOOLSPANEL_DROPDOWNMENU_PROPS
				}
			>
				<ToolsPanelItem
					// We use the `userSettings` prop instead of `settings`, because `settings`
					// contains the core/theme values for the lightbox and we want to show the
					// "RESET" button ONLY when the user has explicitly set a value in the
					// Global Styles.
					hasValue={ () => !! value?.lightbox }
					label={ __( 'Expand on click' ) }
					onDeselect={ resetLightbox }
					isShownByDefault
					panelId={ panelId }
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Expand on click' ) }
						checked={ lightboxChecked }
						onChange={ onChangeLightbox }
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</>
	);
}
