import { STORE_KEY } from '@kubio/constants';
import { ControlNotice, RangeWithUnitControl } from '@kubio/controls';
import { useGlobalDataStyle } from '@kubio/global-data';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import SubSidebarArea from '../../subsidebar-area';

function GlobalEffectsPanel() {
	const { globalStyle, getStyleDefaultGlobalValue } = useGlobalDataStyle();
	const defaultOptions = {
		styledComponent: 'transition',
	};

	const getPropValue = (path, fallback, options) =>
		globalStyle.getStyle(path, fallback, {
			...defaultOptions,
			...options,
		});

	const setPropValue = (path, value, options) =>
		globalStyle.setStyle(path, value, {
			...defaultOptions,
			...options,
		});
	const unsetPropValue = (path, options) => {
		const mergedOptions = {
			...defaultOptions,
			...options,
		};
		const defaultValue = getStyleDefaultGlobalValue(path, mergedOptions);
		if (defaultValue) {
			globalStyle.setStyle(path, defaultValue, mergedOptions);
		} else {
			globalStyle.setStyle(path, null, { ...mergedOptions, unset: true });
		}
	};
	return (
		<>
			<PanelBody initialOpen={true} title={__('Effects', 'kubio')}>
				<RangeWithUnitControl
					label={__('Transition Duration', 'kubio')}
					value={getPropValue('duration', {
						unit: 's',
					})}
					onChange={(value) => setPropValue('duration', value)}
					onReset={() => unsetPropValue('duration')}
					min={0}
					max={5}
					step={0.01}
				/>
			</PanelBody>
		</>
	);
}

const EffectsAreaWrapper = ({ areaIdentifier }) => {
	const isOpen = useSelect(
		(select) => select(STORE_KEY).isEditorSidebarOpened(areaIdentifier),
		[]
	);

	const isKubioTheme = useSelect((select) => {
		return select('kubio/edit-site')?.getSettings()?.isKubioTheme || null;
	});

	return (
		isOpen && (
			<>
				<GlobalEffectsPanel />
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

const GlobalEffectsArea = ({ parentAreaIdentifier }) => {
	return (
		<SubSidebarArea
			title={__('Global Effects', 'kubio')}
			label={__('Effects', 'kubio')}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/effects`}
		>
			<EffectsAreaWrapper
				areaIdentifier={`${parentAreaIdentifier}/effects`}
			/>
		</SubSidebarArea>
	);
};

export default GlobalEffectsArea;
