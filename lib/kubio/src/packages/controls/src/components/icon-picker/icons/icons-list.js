import { Grid } from 'react-virtualized';

import { Button, Tooltip, VisuallyHidden } from '@wordpress/components';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _, { first, upperFirst, uniq, last } from 'lodash';
import classnames from 'classnames';
import { closeSmall, Icon, search } from '@wordpress/icons';
import {
	ProBadge,
	addProTagToItem,
	useProModal,
	sortItemsByPro,
	proItemOnFree,
	proItemOnFreeClass,
} from '@kubio/pro';

const ICONS_PER_ROW = 8;

function getIconsList(iconsList, pack = 'all', searchString = '') {
	let iconsPackages = {};
	let filteredIconsPackages = {};
	let filteredIcons = [];

	const nextIcons = [];

	const iconsMap = Object.keys(iconsList).map((name) => ({
		name,
		iconName: last(name.split('/')),
		icon: iconsList[name],
	}));

	if (searchString) {
		iconsPackages = {};

		searchString = searchString
			.split(' ')
			.filter((word) => word !== '')
			.join('-');

		// const fuse = new Fuse(iconsMap, {
		// 	threshold: 1,
		// 	distance: 0,
		// 	keys: ['iconName'],
		// });

		// fuse.search(searchString).forEach((filteredPack) => {
		// 	filteredIcons.push(filteredPack.item);
		// });

		filteredIcons = iconsMap.filter(
			({ iconName }) =>
				iconName.indexOf(searchString.toLowerCase()) !== -1
		);
	} else {
		filteredIcons = iconsMap;
	}

	filteredIcons.forEach(({ name: key, icon: value }) => {
		const name = key.split('/'),
			currentPack = name[0];

		iconsPackages = {
			...iconsPackages,
			[currentPack]: [
				...(iconsPackages[currentPack] || []),
				{
					name: key,
					value,
					isIcon: true,
				},
			],
		};
	});

	const filteredPackages = Object.keys(iconsPackages);

	if (pack !== 'all') {
		filteredIconsPackages = { [pack]: iconsPackages[pack] };
	} else {
		filteredIconsPackages = iconsPackages;
	}

	// if there is a string search group all icons togheter
	if (searchString) {
		const svgs = [].concat(...Object.values(filteredIconsPackages));
		for (let i = 0, j = svgs.length; i < j; i += ICONS_PER_ROW) {
			const iconsSlice = svgs.slice(i, i + ICONS_PER_ROW);
			nextIcons.push(iconsSlice);
		}
	} else {
		let counter = 0;
		// eslint-disable-next-line no-shadow
		for (const [pack, svgs] of Object.entries(filteredIconsPackages)) {
			if (svgs !== undefined) {
				if (counter !== 0) {
					nextIcons.push({
						name: pack,
						isPackHead: true,
					});
				}

				for (let i = 0, j = svgs.length; i < j; i += ICONS_PER_ROW) {
					const iconsSlice = svgs.slice(i, i + ICONS_PER_ROW);
					nextIcons.push(iconsSlice);
				}
				counter++;
			}
		}
	}

	return [filteredPackages, nextIcons];
}

function getIconsPackages(iconsList) {
	return uniq(
		Object.keys(iconsList).map((item) => item.replace(/(.*)\/(.*)/, '$1'))
	);
}

function formatPackageName(name) {
	return name.split('-').map(upperFirst).join(' ');
}

const SearchFilter = ({ value, onChange }) => {
	const placeholder = __('Filter by name…', 'kubio');
	const instanceId = 'kubio-icon-search';
	const searchInput = useRef();

	return (
		<div className={classnames('block-editor-inserter__search')}>
			<VisuallyHidden
				as="label"
				htmlFor={`block-editor-inserter__search-${instanceId}`}
			>
				{placeholder}
			</VisuallyHidden>
			<input
				ref={searchInput}
				className="block-editor-kubio-inserter__search-input"
				id={`block-editor-inserter__search-${instanceId}`}
				type="text"
				placeholder={placeholder}
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus
				onChange={(event) => onChange(event.target.value)}
				autoComplete="off"
				value={value || ''}
			/>
			<div className="block-editor-inserter__search-icon">
				{!!value && (
					<Button
						icon={closeSmall}
						label={__('Reset search', 'kubio')}
						onClick={() => {
							onChange('');
							searchInput.current.focus();
						}}
					/>
				)}
				{!value && <Icon icon={search} />}
			</div>
		</div>
	);
};

const IconsList = (props) => {
	const { value = '', onChange, list: allIcons } = props;

	const [activePackage, setActivePackage] = useState('all');
	const [{ list, packs }, setFilteredData] = useState({
		list: [],
		packs: [],
	});
	const [searchString, setSearchString] = useState('');

	const [selectedIconOffset, setSelectedIconOffset] = useState(0);
	const [scrolling, setScrolling] = useState(false);

	let availablePackages = useMemo(
		() =>
			[{ value: 'all', label: 'All' }].concat(
				getIconsPackages(allIcons)
					.map((packageSlug) => ({
						value: packageSlug,
						label: formatPackageName(packageSlug),
					}))
					.filter(({ value: packageName }) => {
						if (searchString) {
							return packs.indexOf(packageName) !== -1;
						}

						return true;
					})
			),
		[(packs, list)]
	);

	const refineIconsList = () => {
		const [newPacks, newList] = getIconsList(
			allIcons,
			activePackage,
			searchString
		);

		setFilteredData({
			packs: newPacks,
			list: newList,
		});
	};

	useEffect(() => {
		setActivePackage(first(value.split('/')));
		refineIconsList();
	}, [value]);

	useEffect(() => {
		refineIconsList();

		if (selectedIconOffset < 0) {
			setSelectedIconOffset(0);
		}

		if (activePackage !== 'all' && !scrolling) {
			const row = findRowOfSelectedIcon();
			setSelectedIconOffset(row * 75);
			setScrolling(true);
		}
	}, [searchString, activePackage]);

	const findRowOfSelectedIcon = () => {
		let offset = 0;
		const rowIndex = list.findIndex((rowIcons, index) => {
			if (Array.isArray(rowIcons)) {
				return !!rowIcons.find((icon) => icon.name === value);
			}
			offset = index + 1;
			return false;
		});
		return rowIndex - offset;
	};

	const handleScroll = () => {
		if (selectedIconOffset >= 0 && scrolling) {
			setSelectedIconOffset(-1);
		}
	};

	function cellRenderer({ columnIndex, key, rowIndex, style }) {
		const currentIconItem = list[rowIndex][columnIndex];
		if (currentIconItem && currentIconItem.isPackHead) {
			style.width = '100%';
			style.height = '250px';
			return <></>;
		}

		if (currentIconItem && currentIconItem.isIcon) {
			const { name, value: iconValue } = list[rowIndex][columnIndex];
			const iconLabel = name.replace(/(.*)\//, '').replace('-', ' ');

			const onIconClick = (event) => {
				event.stopPropagation();
				event.preventDefault();
				onChange(name);
			};

			return (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events
				<div
					tabIndex={0}
					role={'button'}
					key={key}
					style={style}
					onClick={onIconClick}
					className={classnames([
						'icon-container',
						{
							'is-selected': name === value,
						},
					])}
				>
					<Tooltip text={iconLabel}>
						<div className={'svg-icon'}>
							{/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events */}
							<a
								tabIndex={0}
								role={'button'}
								dangerouslySetInnerHTML={{
									__html: iconValue,
								}}
							/>
						</div>
					</Tooltip>
				</div>
			);
		}
	}

	// ADD PRO
	const [ProModal, showProModal] = useProModal();
	const freePacks = ['all', 'socicon', 'font-awesome', 'icons8-line-awesome'];
	availablePackages = _.concat(availablePackages, [
		{ value: 'ionicons', label: 'Ionicons' },
		{ value: 'foundation-icons', label: 'Foundation Icons' },
		{ value: 'material-icons', label: 'Material Icons' },
		{ value: 'simple-line-icons', label: 'Simple Line Icons' },
		{ value: 'typicons', label: 'Typicons' },
		{ value: 'linea', label: 'Linea' },
	]);
	availablePackages.forEach((item) => {
		if (!freePacks.includes(item.value)) {
			addProTagToItem(item);
		}
	});
	availablePackages = sortItemsByPro(availablePackages);

	return (
		<div className={'iconsWrapper'}>
			<div className="icon-filter-list-container">
				<div className={'icons-filters'}>
					<div className={'search-filter'}>
						<SearchFilter
							value={searchString}
							onChange={setSearchString}
						/>
					</div>
				</div>
				<div id={'icons-list'}>
					<Grid
						className={'icon-grid-container'}
						cellRenderer={cellRenderer}
						columnCount={ICONS_PER_ROW}
						columnWidth={75}
						height={440}
						rowCount={list.length}
						rowHeight={75}
						width={617}
						activePackage={activePackage}
						searchString={searchString}
						scrollTop={selectedIconOffset}
						onScroll={handleScroll}
					/>
				</div>
			</div>

			<div className={'package-filter'}>
				<h3>{__('Font library', 'kubio')}</h3>
				{availablePackages.map((pack) => {
					return (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events
						<div
							key={pack.value}
							tabIndex={0}
							role={'button'}
							className={classnames([
								'package-filter-name',
								{
									'is-selected': pack.value === activePackage,
								},
								proItemOnFreeClass(pack),
							])}
							onClick={(event) => {
								event.stopPropagation();
								if (proItemOnFree(pack)) {
									showProModal(
										true,
										'pack-pro-modal-' + pack.value
									);
									return false;
								}
								setActivePackage(pack.value);
							}}
						>
							{pack.label}
							<ProBadge item={pack} />
							<ProModal
								id={'pack-pro-modal-' + pack.value}
								urlArgs={{
									source: 'icon',
									content: 'pro-pack',
								}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export { IconsList };
