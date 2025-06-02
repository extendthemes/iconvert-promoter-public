import {
	InnerSpacingWithPath,
	InputControlWithPath,
	KubioPanelBody,
	PopoverOptionsButton,
	RangeWithUnitControl,
	RangeWithUnitWithPath,
	SpacingSelect,
	ToggleControl,
} from '@kubio/controls';
import {
	useTransformStyle,
	withComputedData,
	WithDataPathTypes,
} from '@kubio/core';
import { useGlobalDataStyle } from '@kubio/global-data';
import { Utils } from '@kubio/style-manager';
import { BaseControl } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const { isNotEmptyButCanBeZero } = Utils;

const defaultValue = [
	{ axis: 'x', value: { value: 0, unit: 'px' } },
	{ axis: 'y', value: { value: 0, unit: 'px' } },
	{ axis: 'z' },
];

const ColumnOverlap = ({ computed, dataHelper }) => {
	const { isColumnOverlaped, translateX, translateY } = computed;

	const [isOverlapped, setIsOverlapped] = useState(isColumnOverlaped);

	const onToggleChange = useCallback(
		(value) => {
			dataHelper.setStyle(
				'transform.translate',
				value ? defaultValue : undefined,
				{
					unset: !value,
				}
			);

			setIsOverlapped(value);
		},
		[dataHelper]
	);

	const onPopoverClose = useCallback(() => {
		setIsOverlapped(isColumnOverlaped);
	}, [isColumnOverlaped]);

	const transformRangeOptions = {
		type: WithDataPathTypes.STYLE,
		units: ['px'],
		min: -100,
		capMin: false,
		capMax: false,
		max: 100,
	};

	return (
		<PopoverOptionsButton
			label={__('Overlap other columns', 'kubio')}
			toggable={true}
			onToggleChange={onToggleChange}
			enabled={isOverlapped}
			popoverWidth={300}
			onPopoverClose={onPopoverClose}
			popupContent={
				<>
					<div className="h-dummy-focus-control">
						<BaseControl>
							<ToggleControl />
							<BaseControl />
						</BaseControl>
					</div>
					<RangeWithUnitControl
						{...transformRangeOptions}
						label={__('Vertical overlap', 'kubio')}
						{...translateY}
					/>

					<RangeWithUnitControl
						{...transformRangeOptions}
						label={__('Horizontal overlap', 'kubio')}
						{...translateX}
					/>

					<InputControlWithPath
						label={__('Depth (z-index)', 'kubio')}
						type={WithDataPathTypes.STYLE}
						path="z-index"
						min={0}
						numeric={true}
						inline={true}
						allowReset={true}
						className={'column-depth-control'}
					/>
				</>
			}
		/>
	);
};

const SpacingSection_ = (props) => {
	const {
		computed,
		canOverlap,
		withContentElementsVerticalSpacing = true,
	} = props;
	const { row, vSpaceDefault } = computed;

	return (
		<KubioPanelBody
			initialOpen={false}
			title={__('Spacing and alignment', 'kubio')}
		>
			<SpacingSelect
				label={__('Horizontal space between columns', 'kubio')}
				{...row?.hSpacing}
			/>

			<SpacingSelect
				label={__('Vertical space between columns', 'kubio')}
				{...row?.vSpacing}
			/>

			<InnerSpacingWithPath
				path="layout.horizontalInnerGap"
				type="prop"
				media="current"
				label={__('Horizontal column inner spacing', 'kubio')}
			/>

			<InnerSpacingWithPath
				path="layout.verticalInnerGap"
				type="prop"
				media="current"
				label={__('Vertical column inner spacing', 'kubio')}
			/>

			{withContentElementsVerticalSpacing && (
				<RangeWithUnitWithPath
					label={__('Content elements vertical spacing', 'kubio')}
					type="prop"
					media="current"
					defaultValue={vSpaceDefault}
					path="layout.vSpace"
				/>
			)}

			{canOverlap && <ColumnOverlap {...props} />}
		</KubioPanelBody>
	);
};

const SpacingSection = compose(
	withComputedData((dataHelper) => {
		const { globalStyle } = useGlobalDataStyle();
		const parentDataHelper = dataHelper.withParent();

		const row = {
			hSpacing: parentDataHelper.usePropPath('layout.horizontalGap', {
				media: 'current',
			}),
			vSpacing: parentDataHelper.usePropPath('layout.verticalGap', {
				media: 'current',
			}),
		};

		const transformDataHelper = useTransformStyle(dataHelper);

		const translateX = transformDataHelper.useStylePath(
			'transform.translate.x',
			{},
			{ value: 0, unit: 'px' }
		);
		const translateY = transformDataHelper.useStylePath(
			'transform.translate.y',
			{},
			{ value: 0, unit: 'px' }
		);

		const zIndex = parseInt(dataHelper.getStyle('z-index'));

		return {
			row,
			vSpaceDefault: globalStyle.getPropInMedia('vSpace'),
			translateX,
			translateY,
			isColumnOverlaped: !!(
				translateX?.value?.value ||
				translateY?.value?.value ||
				zIndex
			),
		};
	})
)(SpacingSection_);

export { SpacingSection };
