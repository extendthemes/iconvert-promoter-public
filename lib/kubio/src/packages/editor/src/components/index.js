import EntitiesSavedStates from './entities-saved-states';
import Editor from './editor';
import Header from './header';
import KeyboardShortcuts from './keyboard-shortcuts';
import MainDashboardButton from './main-dashboard-button';
import NavigateToLink from './navigate-to-link';
import NavigationSidebar from './navigation-sidebar';
import { EditorSnackbars as Notices } from './notices';
import SaveButton from './save-button';
import Sidebar from './sidebar';
import TemplateDetails from './template-details';
import TemplatePartConverter from './template-part-converter';
import URLQueryController from './url-query-controller';

export * from './block-editor';
export * from './kubio-blinking-logo';
export * from './kubio-blog-template';
export * from './navigation-sidebar';
export * from './providers';
export * from './secondary-sidebar';
export * from './sidebar';
export * from './editor/global-styles-renderer';
export * from './editor/use-sidebar-tab-autochange';
import * as NavigationSidebarConstants from './navigation-sidebar/navigation-panel/constants';

//Header internal start
import MoreMenu from './header/more-menu';
import { PreviewOptions } from './header/preview-options';
import { MediaControls } from './header/media-controls';
import RedoButton from './header/undo-redo/redo';
import UndoButton from './header/undo-redo/undo';

const HeaderComponents = {
	MoreMenu,
	MediaControls,
	PreviewOptions,
	RedoButton,
	UndoButton,
};

//Header internal end

//Editor internal start
import { KubioEditorStateProvider } from './editor/editor-state-provider';
import { GlobalStylesRenderer } from './editor/global-styles-renderer';
import { useSidebarTabAutochange } from './editor/use-sidebar-tab-autochange';

const EditorComponents = {
	KubioEditorStateProvider,
	GlobalStylesRenderer,
	useSidebarTabAutochange,
};
//Editor internal end

//Sidebar internal start
import SubSidebarArea from './sidebar/subsidebar-area';
import SidebarArea from './sidebar/sidebar-area';
import BlockArea from './sidebar/areas/block-area';
import DocumentArea from './sidebar/areas/document-area';
import SectionsList from './sidebar/sections-list';
import GeneralSettingsArea from './sidebar/areas/general-settings';

import AdditionalCSS from './sidebar/areas/general-settings/additional-css';
import ColorSchemeArea from './sidebar/areas/general-settings/color-scheme-area';
import GlobalEffectsArea from './sidebar/areas/general-settings/effects-area';
import GlobalTypography from './sidebar/areas/general-settings/global-typography';

const SidebarComponents = {
	BlockArea,
	DocumentArea,
	SubSidebarArea,
	SidebarArea,
	SectionsList,
	GeneralSettingsArea,
	AdditionalCSS,
	ColorSchemeArea,
	GlobalEffectsArea,
	GlobalTypography,
};

//Sidebar internal end

//Navigation sidebar start

import ContentNavigationItem from './navigation-sidebar/navigation-panel/content-navigation-item';
import SearchResults from './navigation-sidebar/navigation-panel/search-results';
import useDebouncedSearch from './navigation-sidebar/navigation-panel/use-debounced-search';

const NavigationSidebarComponents = {
	ContentNavigationItem,
	SearchResults,
	useDebouncedSearch,
};
//Navigation sidebar end

export {
	EntitiesSavedStates,
	Editor,
	Header,
	KeyboardShortcuts,
	MainDashboardButton,
	NavigateToLink,
	NavigationSidebar,
	Notices,
	SaveButton,
	Sidebar,
	TemplateDetails,
	TemplatePartConverter,
	URLQueryController,
	NavigationSidebarConstants,
	HeaderComponents,
	EditorComponents,
	SidebarComponents,
	NavigationSidebarComponents,
};
