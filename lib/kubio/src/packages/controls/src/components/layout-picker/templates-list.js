import { find, noop } from 'lodash';
import { store as blocksStore } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { Button, Tooltip } from '@wordpress/components';
import { convertTemplateFormatToBlock } from '@kubio/core';
import { columnWidth, LayoutHelper } from '@kubio/style-manager';
import { addProTagToItems, ProItem } from '@kubio/pro';
import { HERO_TYPES_FREE_VALUES, HERO_LAYOUT_OPTIONS } from '@kubio/constants';
import { refreshBlockStyleRefs } from '@kubio/utils';

const { columnWidthGroup, ColumnWidthTypes } = columnWidth;

const getPercentageColumn = (percentage) => {
	return {
		type: ColumnWidthTypes.CUSTOM,
		custom: {
			value: percentage,
			unit: '%',
		},
	};
};

const LAYOUTS = [
	//first row
	[getPercentageColumn(100)],
	[getPercentageColumn(50), getPercentageColumn(50)],
	[
		getPercentageColumn(33.33),
		getPercentageColumn(33.33),
		getPercentageColumn(33.33),
	],
	[
		getPercentageColumn(25),
		getPercentageColumn(25),
		getPercentageColumn(25),
		getPercentageColumn(25),
	],
	[getPercentageColumn(33.33), getPercentageColumn(66.66)],
	[getPercentageColumn(66.66), getPercentageColumn(33.33)],

	//second row
	[getPercentageColumn(25), getPercentageColumn(25), getPercentageColumn(50)],
	[getPercentageColumn(50), getPercentageColumn(25), getPercentageColumn(25)],
	[getPercentageColumn(25), getPercentageColumn(50), getPercentageColumn(25)],
	[
		getPercentageColumn(20),
		getPercentageColumn(20),
		getPercentageColumn(20),
		getPercentageColumn(20),
		getPercentageColumn(20),
	],
	[
		getPercentageColumn(16.66),
		getPercentageColumn(16.66),
		getPercentageColumn(16.66),
		getPercentageColumn(16.66),
		getPercentageColumn(16.66),
		getPercentageColumn(16.66),
	],
	[
		getPercentageColumn(16.5),
		getPercentageColumn(67),
		getPercentageColumn(16.5),
	],
];

const TemplatesList = (props) => {
	const layouts = [];

	const setLayout = (e) => {
		if (props.onLayoutSelect) {
			props.onLayoutSelect(e);
		}
	};

	let key = 0;

	for (const layout of LAYOUTS) {
		const layoutParts = [];
		for (const layoutPart of layout) {
			const className =
				'section-layout-column ' +
				LayoutHelper.computeColumnWidthClasses({
					desktop: {
						type: ColumnWidthTypes.CUSTOM,
					},
				});
			layoutParts.push(
				<span
					key={key++}
					className={className}
					style={columnWidthGroup.parser(layoutPart)}
				/>
			);
		}

		layouts.push(
			<span key={key++} className={'h-col-4 h-col-md-2'}>
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
				<span
					role={'button'}
					tabIndex={0}
					className={'section-layout'}
					onClick={() => setLayout(layout)}
				>
					{layoutParts}
				</span>
			</span>
		);
	}

	return layouts;
};

HERO_LAYOUT_OPTIONS.pop();

const layoutOptions = addProTagToItems(
	HERO_LAYOUT_OPTIONS,
	HERO_TYPES_FREE_VALUES
);

const HeroTemplatesList = (props) => {
	const { clientId } = props;
	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const { getBlockVariations } = useSelect(blocksStore);

	const { isFrontPage } = useSelect((select) => {
		const { getIsFrontPage = noop } = select('kubio/edit-site') || {};

		return {
			isFrontPage: getIsFrontPage(),
		};
	});

	const layouts = [];
	const variations = getBlockVariations('kubio/hero');

	const getVariation = (variationName) => {
		const needle = isFrontPage ? 'FP' + variationName : variationName;
		return find(variations, ['name', needle]);
	};

	for (const heroLayout of layoutOptions) {
		const onClick = () => {
			const { innerBlocks } = getVariation(heroLayout.value);
			const converted = convertTemplateFormatToBlock(innerBlocks).map(
				(block) => {
					return refreshBlockStyleRefs(block);
				}
			);
			replaceInnerBlocks(clientId, converted, true);
		};

		layouts.push(
			<span
				key={'hero-layout-preview-item-' + heroLayout.value}
				className={'hero-layout-preview-item'}
			>
				<Tooltip
					text={heroLayout.label}
					position={'top center'}
					key={'hero-layout-picker-tooltip' + heroLayout.value}
				>
					<ProItem
						tag={Button}
						item={heroLayout}
						urlArgs={{
							source: 'hero-layout',
							content: heroLayout.value,
						}}
						icon={heroLayout.icon}
						onClick={onClick}
						key={'hero-layout-preview-item-pro-' + heroLayout.value}
					/>
				</Tooltip>
			</span>
		);
	}

	return layouts;
};

export { TemplatesList, HeroTemplatesList };
