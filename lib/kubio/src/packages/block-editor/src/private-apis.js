/**
 * Internal dependencies
 */
import { ExperimentalBlockCanvas } from './components/block-canvas';
import { useBlockEditingMode } from './components/block-editing-mode';
import BlockInfo from './components/block-info-slot-fill';
import { LayoutStyle } from './components/block-list/layout';
import BlockQuickNavigation from './components/block-quick-navigation';
import { BlockRemovalWarningModal } from './components/block-removal-warning-modal';
import DimensionsTool from './components/dimensions-tool';
import { getDuotoneFilter } from './components/duotone/utils';
import * as globalStyles from './components/global-styles';
import { ComposedPrivateInserter as PrivateInserter } from './components/inserter';
import { default as PrivateQuickInserter } from './components/inserter/quick-inserter';
import {
	default as ReusableBlocksRenameHint,
	useReusableBlocksRenameHint,
} from './components/inserter/reusable-block-rename-hint';
import { PrivateListView } from './components/list-view';
import { ExperimentalBlockEditorProvider } from './components/provider';
import ResizableBoxPopover from './components/resizable-box-popover';
import ResolutionTool from './components/resolution-tool';
import { PrivateRichText } from './components/rich-text/';
import { usesContextKey } from './components/rich-text/format-edit';
import { getRichTextValues } from './components/rich-text/get-rich-text-values';
import { useFlashEditableBlocks } from './components/use-flash-editable-blocks';
import { 	setBackgroundStyleDefaults, useLayoutClasses, useLayoutStyles } from './hooks';
import { cleanEmptyObject, useStyleOverride } from './hooks/utils';
import { lock, unlock } from './lock-unlock';
import { useCanBlockToolbarBeFocused } from './utils/use-can-block-toolbar-be-focused';

import { PrivateBlockPopover } from './components/block-popover';
import useBlockDisplayTitle from './components/block-title/use-block-display-title';
import { PrivateInserterLibrary } from './components/inserter/library';
import { PrivatePublishDateTimePicker } from './components/publish-date-time-picker';
import useSpacingSizes from './components/spacing-sizes-control/hooks/use-spacing-sizes';
import TextAlignmentControl from './components/text-alignment-control';
import { requiresWrapperOnCopy } from './components/writing-flow/utils';
import {
	globalStylesDataKey,
	reusableBlocksSelectKey,
	selectBlockPatternsKey,
	globalStylesLinksDataKey,
	sectionRootClientIdKey,
} from './store/private-keys';
import TabbedSidebar from './components/tabbed-sidebar';
/**
 * Private @wordpress/block-editor APIs.
 */
const experiments = {};
lock( experiments, {
	...globalStyles,
	ExperimentalBlockCanvas,
	ExperimentalBlockEditorProvider,
	getDuotoneFilter,
	getRichTextValues,
	PrivateInserter,
	PrivateQuickInserter,
	PrivateListView,
	ResizableBoxPopover,
	BlockInfo,
	useCanBlockToolbarBeFocused,
	cleanEmptyObject,
	useStyleOverride,
	BlockQuickNavigation,
	LayoutStyle,
	BlockRemovalWarningModal,
	useLayoutClasses,
	useLayoutStyles,
	DimensionsTool,
	ResolutionTool,
	TabbedSidebar,
	TextAlignmentControl,
	ReusableBlocksRenameHint,
	useReusableBlocksRenameHint,
	usesContextKey,
	useFlashEditableBlocks,
	globalStylesDataKey,
	globalStylesLinksDataKey,
	selectBlockPatternsKey,
	requiresWrapperOnCopy,
	PrivateRichText,
	PrivateInserterLibrary,
	reusableBlocksSelectKey,
	PrivateBlockPopover,
	PrivatePublishDateTimePicker,
	useSpacingSizes,
	useBlockDisplayTitle,
	useBlockEditingMode,
	setBackgroundStyleDefaults,
	sectionRootClientIdKey,
} );

const privateApis = experiments;

export { experiments, lock, privateApis, unlock };
