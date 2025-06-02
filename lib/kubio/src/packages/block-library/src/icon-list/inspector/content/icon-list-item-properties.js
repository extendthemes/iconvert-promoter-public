import { withComputedData, WithDataPathTypes } from '@kubio/core';

import {
	IconPicker,
	ToggleControl,
	LinkControlWithData,
} from '@kubio/controls';
import { __ } from '@wordpress/i18n';

import { TextareaControl } from '@wordpress/components';

const IconListItemProperties_ = (props) => {
	const { computed } = props;
	const { text, useForAllProps, icon } = computed;

	return (
		<>
			<IconPicker path="icon" {...icon} />

			<TextareaControl label={__('Text', 'kubio')} {...text} />

			<ToggleControl
				label={__('Use this icon for all items', 'kubio')}
				{...useForAllProps}
			/>

			<LinkControlWithData />
		</>
	);
};

const useComputed = (dataHelper) => {
	const iconValue = dataHelper.getAttribute('icon');

	const useForAllProps = {
		value: dataHelper.getAttribute('useForAll'),
		onChange: (newValue) => {
			const siblings = dataHelper.withSiblings();
			siblings.forEach((itemHelper) => {
				if (newValue && iconValue) {
					itemHelper.setAttribute('icon', iconValue);
				}
				itemHelper.setAttribute('useForAll', newValue);
			});
		},
	};

	const text = {
		value: dataHelper.getAttribute('text'),
		onChange: (newContent) => {
			dataHelper.setAttribute('text', newContent);
		},
	};

	const icon = {
		value: dataHelper.getAttribute('icon'),
		onChange: (newIcon) => {
			const useForAll = dataHelper.getAttribute('useForAll');

			if (useForAll) {
				const siblings = dataHelper.withSiblings();

				siblings.forEach((itemHelper) => {
					itemHelper.setAttribute('icon', newIcon);
				});
			}
			dataHelper.setAttribute('icon', newIcon);
		},
		type: WithDataPathTypes.ATTRIBUTE,
	};

	const link = {
		value: dataHelper.getAttribute('link'),
		onChange: (newLink) => {
			dataHelper.setAttribute('link', newLink);
		},
	};

	return {
		text,
		icon,
		link,
		useForAllProps,
	};
};

const IconListItemProperties = withComputedData(useComputed)(
	IconListItemProperties_
);

export { IconListItemProperties };
