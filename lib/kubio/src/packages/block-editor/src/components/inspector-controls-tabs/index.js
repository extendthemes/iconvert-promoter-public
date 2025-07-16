/**
 * WordPress dependencies
 */
import { Flex, Icon, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InspectorControls from '../inspector-controls';
import SettingsTab from './settings-tab';
import StylesTab from './styles-tab';
import useIsListViewTabDisabled from './use-is-list-view-tab-disabled';
import { TAB_LIST_VIEW, TAB_SETTINGS, TAB_STYLES } from './utils';
import { useMemo } from '@wordpress/element';

export default function InspectorControlsTabs( {
	blockName,
	clientId,
	hasBlockStyles,
	tabs,
} ) {
	// The tabs panel will mount before fills are rendered to the list view
	// slot. This means the list view tab isn't initially included in the
	// available tabs so the panel defaults selection to the settings tab
	// which at the time is the first tab. This check allows blocks known to
	// include the list view tab to set it as the tab selected by default.
	const initialTabName = ! useIsListViewTabDisabled( blockName )
		? TAB_LIST_VIEW.name
		: undefined;

	const memoizedTabs = useMemo( () => {
		return tabs.map( ( { icon, title, ...rest } ) => ( {
			...rest,
			title: (
				<Flex
					direction={ 'column' }
					justify="center"
					align="center"
					gap={ 0 }
				>
					<Icon icon={ icon } />
					<span>{ title }</span>
				</Flex>
			),
		} ) );
	}, [ tabs ] );

	//modified in kubio
	return (
		<TabPanel
			className="block-editor-block-inspector__tabs kubio-core-blocks-tabs"
			tabs={ memoizedTabs }
			initialTabName={ initialTabName }
			key={ clientId }
		>
			{ ( tab ) => {
				if ( tab.name === TAB_SETTINGS.name ) {
					return (
						<SettingsTab showAdvancedControls={ !! blockName } />
					);
				}

				if ( tab.name === TAB_STYLES.name ) {
					return (
						<StylesTab
							blockName={ blockName }
							clientId={ clientId }
							hasBlockStyles={ hasBlockStyles }
						/>
					);
				}

				if ( tab.name === TAB_LIST_VIEW.name ) {
					return <InspectorControls.Slot group="list" />;
				}
			} }
		</TabPanel>
	);
}
