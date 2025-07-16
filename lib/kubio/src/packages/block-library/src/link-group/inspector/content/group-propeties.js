import {
	HorizontalTextAlignControlWithPath,
	RangeWithUnitWithPath,
	SortableCollapseGroupWithData,
	SeparatorHorizontalLine,
	KubioPanelBody,
} from '@kubio/controls';
import { withComputedData } from '@kubio/core';
import { useSessionProp } from '@kubio/editor-data';
import { ElementsEnum } from '../../elements';
import { __ } from '@wordpress/i18n';

import { useGlobalDataStyle, useInheritedTextAlign } from '@kubio/global-data';

const LinkGroupProperties_ = (props) => {
	const {
		panelLabel,
		addButtonText = __('Add link', 'kubio'),
		groupListLabel = __('Button list', 'kubio'),
		alignLabel = __('Link group align', 'kubio'),
		spaceBetweenLabel = __('Space between links', 'kubio'),
		initialOpen = true,
		computed,
		dataHelper,
	} = props;
	const { iconGetter, hSpaceDefault, defaultTextAlign } = computed;

	const [opened, setIsOpened] = useSessionProp(
		dataHelper.clientId,
		'content-group-props-opened',
		initialOpen
	);

	const onToggle = () => {
		setIsOpened(!opened);
	};

	return (
		<KubioPanelBody
			title={panelLabel}
			initialOpen={initialOpen}
			opened={opened}
			onToggle={onToggle}
		>
			<SortableCollapseGroupWithData
				selectItem={true}
				iconGetter={iconGetter}
				addButtonText={addButtonText}
				selectPrevious={true}
				label={groupListLabel}
			/>
			<SeparatorHorizontalLine />
			<RangeWithUnitWithPath
				label={spaceBetweenLabel}
				type="prop"
				path="layout.hSpace"
				media={'auto'}
				defaultValue={hSpaceDefault}
				min={0}
				max={100}
				capMax={true}
				capMin={true}
			/>
			<HorizontalTextAlignControlWithPath
				path="textAlign"
				type="style"
				label={alignLabel}
				defaultValue={defaultTextAlign}
				style={ElementsEnum.SPACING}
			/>
		</KubioPanelBody>
	);
};

const useComputed = (dataHelper) => {
	const { globalStyle } = useGlobalDataStyle();
	const defaultTextAlign = useInheritedTextAlign();
	const iconGetter = (itemDataHelper) => {
		if (!itemDataHelper.getProp('showIcon')) {
			return false;
		}

		return itemDataHelper.getAttribute('icon.name', '');
	};

	return {
		hSpaceDefault: globalStyle.getPropInMedia('hSpace'),
		iconGetter,
		defaultTextAlign,
	};
};
const LinkGroupProperties = withComputedData(useComputed)(LinkGroupProperties_);
export { LinkGroupProperties };
export default LinkGroupProperties;
