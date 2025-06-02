import classnames from 'classnames';
import { partial, noop, find } from 'lodash';
import { useEffect, useState } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';
import { NavigableMenu, Button } from '@wordpress/components';

const TabButton = ({ tabId, onClick, children, selected, ...rest }) => (
	<Button
		role="tab"
		tabIndex={selected ? null : -1}
		aria-selected={selected}
		id={tabId}
		onClick={onClick}
		{...rest}
	>
		{children}
	</Button>
);

const TabPanel = ({
	className,
	children,
	tabs,
	initialTabName,
	currentTab,
	orientation = 'horizontal',
	activeClass = 'is-active',
	onSelect = noop,
}) => {
	const instanceId = useInstanceId(TabPanel, 'tab-panel');
	const [selected, setSelected] = useState(
		initialTabName || (tabs.length > 0 ? tabs[0].name : null)
	);

	const handleClick = (tabKey) => {
		setSelected(tabKey);
		onSelect(tabKey);
	};

	useEffect(() => {
		const tabsKeys = tabs.map(({ name }) => name);
		if (tabsKeys.includes(currentTab)) {
			setSelected(currentTab);
		}
	}, [currentTab]);

	const onNavigate = (childIndex, child) => {
		child.click();
	};

	const selectedTab = find(tabs, { name: selected });
	const selectedId = `${instanceId}-${selectedTab.name}`;

	return (
		<div className={className}>
			<NavigableMenu
				role="tablist"
				orientation={orientation}
				onNavigate={onNavigate}
				className="components-tab-panel__tabs kubio-inspector-tabs"
			>
				{tabs.map((tab) => (
					<TabButton
						className={classnames(
							'components-tab-panel__tabs-item',
							tab.className,
							{
								[activeClass]: tab.name === selected,
							}
						)}
						tabId={`${instanceId}-${tab.name}`}
						aria-controls={`${instanceId}-${tab.name}-view`}
						selected={tab.name === selected}
						key={tab.name}
						onClick={partial(handleClick, tab.name)}
					>
						{typeof tab.title === 'function'
							? tab.title()
							: tab.title}
					</TabButton>
				))}
			</NavigableMenu>
			{selectedTab && (
				<div
					aria-labelledby={selectedId}
					role="tabpanel"
					id={`${selectedId}-view`}
					className="components-tab-panel__tab-content"
				>
					{children(selectedTab)}
				</div>
			)}
		</div>
	);
};
export { TabPanel };
