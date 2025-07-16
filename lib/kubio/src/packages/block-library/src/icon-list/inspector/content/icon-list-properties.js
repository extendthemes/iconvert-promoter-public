import { __ } from '@wordpress/i18n';
import {
	SeparatorHorizontalLine,
	SortableCollapseGroupWithData,
	ToggleGroupWithPath,
	ToggleGroup,
	KubioPanelBody,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { DataHelperContextFromClientId } from '@kubio/inspectors';
import { IconListItemProperties } from './icon-list-item-properties';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import _ from 'lodash';
import NamesOfBlocks from '../../../blocks-list';
import {
	listLayoutOptions,
	verticalAlignOptions,
	horizontalAlignOptions,
	listLayoutValues,
} from '../../config';

import { ElementsEnum } from '../../blocks/icon-list/elements';

const iconListComponentEnum = {
	styledComponent: ElementsEnum.OUTER,
};

const dividerWrapperEnum = {
	styledComponent: ElementsEnum.DIVIDERWRAPPER,
};

const textWrapperEnum = {
	styledComponent: ElementsEnum.TEXTWRAPPER,
};

const Component_ = ({ computed, clientId }) => {
	const {
		iconGetter,
		horizontalAlignProps,
		verticalAlignProps,
		listLayout,
	} = computed;

	return (
		<KubioPanelBody title={__('Icon List Properties', 'kubio')}>
			<ToggleGroup
				label={__('Icon align', 'kubio')}
				{...verticalAlignProps}
				options={verticalAlignOptions}
				allowReset
			/>

			<ToggleGroup
				label={__('List Layout', 'kubio')}
				options={listLayoutOptions}
				{...listLayout}
			/>

			<ToggleGroup
				label={__('Horizontal Align', 'kubio')}
				options={horizontalAlignOptions}
				{...horizontalAlignProps}
				allowReset
			/>

			<DataHelperContextFromClientId clientId={clientId}>
				<SortableCollapseGroupWithData iconGetter={iconGetter}>
					{(item) => {
						return (
							<DataHelperContextFromClientId
								clientId={item?.clientId}
							>
								<IconListItemProperties />
							</DataHelperContextFromClientId>
						);
					}}
				</SortableCollapseGroupWithData>
			</DataHelperContextFromClientId>
		</KubioPanelBody>
	);
};

const useComputed = (dataHelper) => {
	const iconGetter = (itemDataHelper) => {
		return itemDataHelper.getAttribute('icon');
	};

	const verticalAlignProps = {
		value: dataHelper.getStyle('alignItems', null, textWrapperEnum),
		onChange: (value) => {
			dataHelper.setStyle('alignItems', value, textWrapperEnum);
		},
	};

	const getListLayout = () => {
		const defaultUnsetValue = {
			value: 0,
			unit: 'px',
		};
		const onChange = (newValue) => {
			const toHorizontalLayoutMapper = [
				{
					getPath: 'padding.bottom',
					setPath: 'padding.right',
					styledComponent: ElementsEnum.ITEM,
				},
				{
					getPath: 'padding.bottom',
					setPath: 'padding.right',
					styledComponent: ElementsEnum.DIVIDERWRAPPER,
				},
				{
					getPath: 'padding.top',
					setPath: 'padding.left',
					styledComponent: ElementsEnum.DIVIDERWRAPPER,
				},
				{
					getPath: 'border.bottom.width',
					setPath: 'border.left.width',
					styledComponent: ElementsEnum.DIVIDER,
				},
				{
					getPath: 'width',
					setPath: 'height',
					unsetValue: 'auto',
					styledComponent: ElementsEnum.DIVIDER,
				},
			];

			const toVerticalLayoutMapper = toHorizontalLayoutMapper.map(
				(item) => {
					const { getPath, setPath } = item;

					//revert paths for vertical layout. For example in horizontal layout you'll have padding bottom on item
					//but on vertical you'll have padding right
					return {
						...item,
						getPath: setPath,
						setPath: getPath,
					};
				}
			);
			const layoutIsHorizontal = newValue === listLayoutValues.HORIZONTAL;
			const mapper = layoutIsHorizontal
				? toHorizontalLayoutMapper
				: toVerticalLayoutMapper;

			dataHelper.setStyle('flexDirection', newValue, {
				styledComponent: ElementsEnum.OUTER,
			});
			mapper.forEach((setting) => {
				const { unsetOriginal = false } = setting;
				const options = {
					styledComponent: setting.styledComponent,
				};
				const data = dataHelper.getStyle(
					setting.getPath,
					null,
					options
				);
				dataHelper.setStyle(setting.setPath, data, options);

				const unsetValue = _.get(
					setting,
					'unsetValue',
					defaultUnsetValue
				);
				dataHelper.setStyle(setting.getPath, unsetValue, options);
			});
		};

		return {
			value: dataHelper.getStyle('flexDirection', null, {
				styledComponent: ElementsEnum.OUTER,
			}),
			onChange,
		};
	};

	const listLayout = getListLayout();

	const horizontalAlignProps = {
		value: dataHelper.getStyle(
			'justifyContent',
			null,
			iconListComponentEnum
		),
		onChange: (value) => {
			dataHelper.setStyle('justifyContent', value, iconListComponentEnum);
			dataHelper.setStyle('alignContent', value, iconListComponentEnum);
		},
	};

	return {
		listLayout,
		verticalAlignProps,
		horizontalAlignProps,
		iconGetter,
	};
};

const IconListProperties = compose(withComputedData(useComputed))(Component_);

export { IconListProperties };
