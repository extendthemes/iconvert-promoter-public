import { getNamesOfBlocks } from '@kubio/block-library';
import { TabPanel } from '@kubio/controls';
import { AdvancedIcon, LayoutIcon, StyleIcon } from '@kubio/icons';
import {
	AdvancedStyleBlockInspector,
	BlockInspectorTopControls,
	ContentBlockInspector,
	StyleBlockInspector,
	useCurrentInspectorTab,
} from '@kubio/inspectors';
import { compose } from '@wordpress/compose';
import { useSelect, withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';

const tabs = {
	content: <ContentBlockInspector />,
	style: <StyleBlockInspector />,
	advanced: <AdvancedStyleBlockInspector />,
};

const NamesOfBlocks = getNamesOfBlocks();

const layoutBlocks = [
	NamesOfBlocks.HEADER,
	NamesOfBlocks.FOOTER,
	NamesOfBlocks.QUERY_LAYOUT,
	NamesOfBlocks.HERO,
	NamesOfBlocks.SECTION,
	NamesOfBlocks.ROW,
	NamesOfBlocks.COLUMN,
	NamesOfBlocks.QUERY,
	NamesOfBlocks.LOOP,
	NamesOfBlocks.LOOP_ITEM,
];

const ContentTitle = () => {
	const selectedBlockName = useSelect(
		(select) => select('core/block-editor').getSelectedBlock()?.name
	);

	let label = __('Layout', 'kubio');

	if (layoutBlocks.indexOf(selectedBlockName) === -1) {
		label = __('Content', 'kubio');
	}

	return (
		<span className={'kubio-tab-panel'}>
			<Icon icon={LayoutIcon} />
			<span className={'kubio-tab-panel-text'}>{label}</span>
		</span>
	);
};

const styleTitle = () => {
	return (
		<span className={'kubio-tab-panel'}>
			<Icon icon={StyleIcon} />
			<span className={'kubio-tab-panel-text'}>
				{__('Style', 'kubio')}
			</span>
		</span>
	);
};

const advancedTitle = () => {
	return (
		<span className={'kubio-tab-panel'}>
			<Icon icon={AdvancedIcon} />
			<span className={'kubio-tab-panel-text'}>
				{__('Advanced', 'kubio')}
			</span>
		</span>
	);
};

const panelTabs = [
	{
		name: 'content',
		title: ContentTitle,
		className: 'tab-content',
	},
	{
		name: 'style',
		title: styleTitle,
		className: 'tab-style',
	},
	{
		name: 'advanced',
		title: advancedTitle,
		className: 'tab-advanced',
	},
];

const AdvancedBlockInspector = ({ selectedBlockClientId }) => {
	const [displayedTab, setDisplayedTab] = useCurrentInspectorTab();
	return (
		selectedBlockClientId && (
			<>
				<TabPanel
					className="kubio-advanced-block-inspector"
					currentTab={displayedTab}
					onSelect={setDisplayedTab}
					tabs={panelTabs}
				>
					{(tab) => {
						return (
							<div
								className={'kubio-block-inspector-tab-content'}
							>
								<BlockInspectorTopControls.Slot
									bubblesVirtually
								/>
								{tabs[tab.name]}
							</div>
						);
					}}
				</TabPanel>
			</>
		)
	);
};

export default compose(
	withSelect((select) => {
		const { getSelectedBlockClientId } = select('core/block-editor');
		return {
			selectedBlockClientId: getSelectedBlockClientId(),
		};
	})
)(AdvancedBlockInspector);
