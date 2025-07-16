import {
	HorizontalTextAlignControlWithPath,
	IconPickerWithPath,
	LinkControlWithData,
	SeparatorHorizontalLine,
	ToggleControlWithPath,
	TinymceControlWithPath,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { AddItemIcon } from '@kubio/icons';
import { DataHelperContextFromClientId } from '@kubio/inspectors';
import { Button, PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../../link-group/elements';

import LinkGroupProperties from '../../../link-group/inspector/content/group-propeties';

const editorSettings = {
	toolbar1: 'bold,italic',
};

const Component_ = ({ computed }) => {
	const { showIcon, groupClientId, onAddLink, showLinkGroup } = computed;

	return (
		<>
			<PanelBody title={__('Link Properties', 'kubio')}>
				<TinymceControlWithPath
					label={__('Link text', 'kubio')}
					path={'text'}
					type={WithDataPathTypes.ATTRIBUTE}
					editorSettings={editorSettings}
				/>

				<SeparatorHorizontalLine />

				<LinkControlWithData />

				<SeparatorHorizontalLine />

				<ToggleControlWithPath
					label={__('Display link icon', 'kubio')}
					type={WithDataPathTypes.PROP}
					path="showIcon"
				/>
				{showIcon && (
					<IconPickerWithPath
						path="icon.name"
						type={WithDataPathTypes.ATTRIBUTE}
					/>
				)}
				{!showLinkGroup && (
					<>
						<SeparatorHorizontalLine />
						<DataHelperContextFromClientId clientId={groupClientId}>
							<HorizontalTextAlignControlWithPath
								path="textAlign"
								type="style"
								label={__('Link align', 'kubio')}
								style={ElementsEnum.SPACING}
							/>
						</DataHelperContextFromClientId>
						<div className="components-base-control">
							<Button
								isPrimary
								icon={AddItemIcon}
								onClick={onAddLink}
								className={
									'kubio-button-group-button sortable-collapse__add-button'
								}
							>
								{__('Add link', 'kubio')}
							</Button>
						</div>
					</>
				)}
			</PanelBody>
			{showLinkGroup && (
				<DataHelperContextFromClientId clientId={groupClientId}>
					<LinkGroupProperties
						panelLabel={__('Link Group', 'kubio')}
						groupListLabel={__('Link list', 'kubio')}
					/>
				</DataHelperContextFromClientId>
			)}
		</>
	);
};

const useComputed = (dataHelper) => {
	const groupColibriData = dataHelper.withParent();
	const groupClientId = groupColibriData?.clientId;
	const { childrenIds, defaultVariation } = useSelect((select) => {
		const { getBlockOrder } = select('core/block-editor');

		return {
			childrenIds: getBlockOrder(groupClientId),
		};
	});

	const showLinkGroup = childrenIds.length > 1;

	const onAddLink = () => {
		dataHelper.duplicate({
			unlink: true,
			selectDuplicate: false,
		});
	};

	return {
		showIcon: dataHelper.getProp('showIcon'),
		groupClientId,
		showLinkGroup,
		onAddLink,
	};
};

const Component = withComputedData(useComputed)(Component_);
export default Component;
