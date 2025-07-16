import { STORE_KEY } from '@kubio/constants';
import {
	ControlNotice,
	RangeWithUnitControl,
	sizeUnitsOptions,
} from '@kubio/controls';
import { useGlobalDataStyle } from '@kubio/global-data';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import SubSidebarArea from '../../subsidebar-area';

const GlobalSpacingPanel = () => {
	const {
		globalStyle,
		getPropDefaultGlobalValue,
		getStyleDefaultGlobalValue,
	} = useGlobalDataStyle();

	const getPropValue = (path, fallback, options) =>
		globalStyle.getPropInMedia(path, fallback, {
			...options,
		});

	const setPropValue = (path, options) => (value) =>
		globalStyle.setPropInMedia(path, value, {
			...options,
		});
	const unsetPropValue = (path, options = {}) => () => {
		const defaultValue = getPropDefaultGlobalValue(path, options);
		globalStyle.setPropInMedia(path, defaultValue, options);
	};
	const sectionSpacingOptions = {
		styledComponent: 'sectionSpacing',
	};

	const setSectionSpacing = (value) => {
		globalStyle.setStyle('padding.top', value, sectionSpacingOptions);
		globalStyle.setStyle('padding.bottom', value, sectionSpacingOptions);
	};
	const unsetSectionSpacing = () => {
		const paddingTopDefaultValue = getStyleDefaultGlobalValue(
			'padding.top',
			sectionSpacingOptions
		);
		globalStyle.setStyle(
			'padding.top',
			paddingTopDefaultValue,
			sectionSpacingOptions
		);

		const paddingBottomDefaultValue = getStyleDefaultGlobalValue(
			'padding.bottom',
			sectionSpacingOptions
		);
		globalStyle.setStyle(
			'padding.bottom',
			paddingBottomDefaultValue,
			sectionSpacingOptions
		);
	};
	return (
		<>
			<PanelBody initialOpen={true} title={__('Spacing', 'kubio')}>
				<RangeWithUnitControl
					label={__(
						'Horizontal space between buttons/links',
						'kubio'
					)}
					units={sizeUnitsOptions}
					onChange={setPropValue('hSpace')}
					value={getPropValue('hSpace', { unit: 'px' })}
					onReset={unsetPropValue('hSpace')}
				/>

				<RangeWithUnitControl
					label={__('Column contents vertical spacing', 'kubio')}
					units={sizeUnitsOptions}
					onChange={setPropValue('vSpace')}
					value={getPropValue('vSpace', { unit: 'px' })}
					onReset={unsetPropValue('vSpace')}
				/>

				<RangeWithUnitControl
					label={__('Section vertical spacing', 'kubio')}
					units={sizeUnitsOptions}
					value={globalStyle.getStyle(
						'padding.top',
						{ unit: 'px' },
						sectionSpacingOptions
					)}
					onChange={setSectionSpacing}
					onReset={unsetSectionSpacing}
				/>
			</PanelBody>
		</>
	);
};

const GlobalSpacingPanelWrapper = ({ areaIdentifier }) => {
	const shouldRender = useSelect(
		(select) => select(STORE_KEY).isEditorSidebarOpened(areaIdentifier),
		[]
	);

	const isKubioTheme = useSelect((select) => {
		return select('kubio/edit-site')?.getSettings()?.isKubioTheme || null;
	});

	return (
		shouldRender && (
			<>
				<GlobalSpacingPanel />

				{!isKubioTheme && (
					<ControlNotice
						className={'notice-general-settings'}
						content={__(
							'These settings are applied to Kubio blocks and the blocks within.',
							'kubio'
						)}
					/>
				)}
			</>
		)
	);
};

const GlobalSpacingArea = ({ parentAreaIdentifier }) => {
	return (
		<SubSidebarArea
			title={__('Global Spacing', 'kubio')}
			label={__('Spacing', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/spacing`}
		>
			<GlobalSpacingPanelWrapper
				areaIdentifier={`${parentAreaIdentifier}/spacing`}
			/>
		</SubSidebarArea>
	);
};

export default GlobalSpacingArea;
