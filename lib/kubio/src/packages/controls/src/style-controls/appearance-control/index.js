import _ from 'lodash';
import { __ } from '@wordpress/i18n';
import { WithDataPathTypes } from '@kubio/core';
import { SelectControlWithPath } from '../wrappers/select-control';
import { BaseControl, Button } from '@wordpress/components';
import { RangeWithUnitWithPath } from '../wrappers/range-with-unit-wrapper';
import * as AppearanceControlUtils from './constants';
import { AvailableInPro } from '@kubio/pro';
import { useEffect } from '@wordpress/element';

const {
	effectTypeDefault,
	effectTypeOptions,
	animationDurationOptions,
	animationDelayOptions,
} = AppearanceControlUtils;

const urlArgs = {
	source: 'appearance-effect',
	content: 'appearance-effect',
};

const AppearanceControl = ( props ) => {
	const { dataHelper } = props;
	const styledComponent = dataHelper?.wrapperStyledComponent;

	const appearanceEffect = dataHelper.getAttribute(
		'appearanceEffect',
		effectTypeDefault
	);

	useEffect( () => {
		if (
			appearanceEffect &&
			appearanceEffect !== 'none' &&
			! dataHelper.getContextProp( 'appearanceEffectRefreshKey' )
		) {
			dataHelper.setContextProp(
				'appearanceEffectRefreshKey',
				Date.now()
			);
		}
	}, [ appearanceEffect ] );

	const showFields = appearanceEffect !== effectTypeDefault ? true : false;
	const triggerAOSRefresh = _.debounce( () => {
		dataHelper.setContextProp( 'appearanceEffectRefreshKey', Date.now() );
	}, 100 );

	return (
		<>
			<SelectControlWithPath
				options={ effectTypeOptions }
				label={ __( 'Animation', 'kubio' ) }
				type={ WithDataPathTypes.ATTRIBUTE }
				path={ 'appearanceEffect' }
				local={ true }
				defaultValue={ 'none' }
			/>
			{ showFields && (
				<>
					{
					}
					{
						<AvailableInPro
							displayModal={ false }
							urlArgs={ urlArgs }
						/>
					}
					<BaseControl>
						<Button
							isPrimary
							onClick={ triggerAOSRefresh }
							className={ 'kubio-button-100' }
						>
							{ __( 'Play animation', 'kubio' ) }
						</Button>
					</BaseControl>
				</>
			) }
		</>
	);
};

export { AppearanceControl, AppearanceControlUtils };
