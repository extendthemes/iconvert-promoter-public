import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../elements';
import {
	ColorWithPath,
	RangeWithUnitWithPath,
	RangeWithUnitControl,
	GutentagSelectControl,
	KubioPanelBody,
} from '@kubio/controls';
import { useInheritedTypographyValue } from '@kubio/global-data';
import { properties } from '../../config';

const commonStoreOptions = {
	styledComponent: ElementsEnum.ICON,
};

const Component_ = ({ computed }) => {
	const { iconPosition, iconSpacing, showIcon, dataHelper } = computed;
	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.ICON,
	};

	const defaultColors = useInheritedTypographyValue('a');
	const linkColor = dataHelper.getStyle('typography.color', null, {
		styledComponent: ElementsEnum.LINK,
	});
	const linkHoverColor = dataHelper.getStyle('typography.color', null, {
		styledComponent: ElementsEnum.LINK,
		state: 'hover',
	});

	const iconColor =
		dataHelper.getStyle('fill') || linkColor || defaultColors.color;
	const iconHoverColor =
		dataHelper.getStyle('fill', null, { state: 'hover' }) ||
		linkHoverColor ||
		defaultColors.states.hover.color;

	return (
		<>
			{showIcon && (
				<KubioPanelBody title={__('Icon style', 'kubio')}>
					<RangeWithUnitWithPath
						label={__('Icon size', 'kubio')}
						path={'size'}
						max={30}
						capMax={false}
						capMin={true}
						{...commonOptions}
					/>
					<ColorWithPath
						label={__('Icon color', 'kubio')}
						path={'fill'}
						{...commonOptions}
						defaultValue={iconColor}
					/>
					<ColorWithPath
						label={__('Icon hover color', 'kubio')}
						path={'fill'}
						state={'hover'}
						{...commonOptions}
						defaultValue={iconHoverColor}
					/>
					<GutentagSelectControl
						label={__('Icon position', 'kubio')}
						path={'iconPosition'}
						options={properties.iconPosition.options}
						{...iconPosition}
					/>
					<RangeWithUnitControl
						label={__('Icon spacing', 'kubio')}
						capMax={false}
						max={50}
						{...iconSpacing}
					/>
				</KubioPanelBody>
			)}
		</>
	);
};

const useComputed = (dataHelper) => {
	const iconPositionValues = properties.iconPosition.values;

	const onChangeDataHelper = (event) => {
		dataHelper.setProp('iconPosition', event);
		const oldMargin = dataHelper.getStyle('margin', {}, commonStoreOptions);
		const none = {
			value: 0,
			unit: 'px',
		};

		const newMargin = {
			left: event === iconPositionValues.AFTER ? oldMargin?.right : none,
			right: event === iconPositionValues.BEFORE ? oldMargin?.left : none,
		};

		dataHelper.setStyle('margin', newMargin, commonStoreOptions);
	};

	const iconPosition = {
		value: dataHelper.getProp('iconPosition'),
		onChange: onChangeDataHelper,
	};

	let positionPath = null;
	if (iconPosition.value === iconPositionValues.AFTER) {
		positionPath = 'margin.left';
	} else {
		positionPath = 'margin.right';
	}

	const iconSpacing = {
		value: dataHelper.getStyle(positionPath, {}, commonStoreOptions),
		onChange: (event) =>
			dataHelper.setStyle(positionPath, event, commonStoreOptions),
	};

	return {
		showIcon: dataHelper.getProp('showIcon'),
		iconPosition,
		iconSpacing,
		dataHelper,
	};
};

const Component = withComputedData(useComputed)(Component_);
export default Component;
