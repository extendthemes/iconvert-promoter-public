import { __ } from '@wordpress/i18n';
import {
	HorizontalTextAlignControlWithPath,
	SortableCollapseGroupWithData,
	KubioPanelBody,
} from '@kubio/controls';
import { withComputedData } from '@kubio/core';
import { DataHelperContextFromClientId } from '@kubio/inspectors';
import { ElementsEnum } from '../../elements';
import { IconItemProperties } from './icon-item-properties';
import { useSocialIconsContext } from '../../context';

const Panel = (props) => {
	const {
		panelLabel,
		addButtonText = __('Add Icon', 'kubio'),
		computed,
	} = props;
	const { currentActiveItem, setCurrentActiveItem } = useSocialIconsContext();
	const { iconGetter } = computed;

	return (
		<>
			<KubioPanelBody
				title={panelLabel}
				className={'social-icons-sortable'}
			>
				<HorizontalTextAlignControlWithPath
					path="textAlign"
					type="style"
					style={ElementsEnum.SPACING}
				/>

				<SortableCollapseGroupWithData
					activeItems={[currentActiveItem]}
					selectItem={true}
					iconGetter={iconGetter}
					addButtonText={addButtonText}
					allowMultipleExpanded={false}
					onDuplicateUnlink={true}
					onSelect={(item) => setCurrentActiveItem(item.id)}
				>
					{(item) => {
						return (
							<DataHelperContextFromClientId
								clientId={item.clientId}
							>
								<IconItemProperties />
							</DataHelperContextFromClientId>
						);
					}}
				</SortableCollapseGroupWithData>
			</KubioPanelBody>
		</>
	);
};
const useComputed = (dataHelper) => {
	const iconGetter = (itemDataHelper) => {
		return itemDataHelper.getAttribute('icon.name', '');
	};

	return {
		iconGetter,
	};
};

const IconGroupProperties = withComputedData(useComputed)(Panel);
export { IconGroupProperties };
export default IconGroupProperties;
