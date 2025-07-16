import {
	KubioPanelBody,
	RangeWithUnitWithPath,
	SelectControlWithPath,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../elements';

const unitsOptions = [ { label: 'PX', value: 'px' } ];

const heightUnits = {
	px: {
		min: 100,
		max: 1000,
		step: 1,
	},
};

const trackWidthUnits = {
	px: {
		min: 1,
		max: 30,
		step: 1,
	},
};

const heightOptions = {
	units: unitsOptions,
	optionsByUnit: heightUnits,
};
const trackWidthOptions = {
	units: unitsOptions,
	optionsByUnit: trackWidthUnits,
};

const Panel = () => {
	const containerOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.INNER,
	};

	const outerOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.OUTER,
	};
	return (
		<>
			<KubioPanelBody title={ __( 'Properties', 'iconvert-promoter' ) }>
				<SelectControlWithPath
					label={ __( 'Scrollbar type', 'iconvert-promoter' ) }
					options={ [
						{ label: 'Auto', value: 'auto' },
						{ label: 'Visible', value: 'scroll' },
						{ label: 'Overlay', value: 'overlay' },
					] }
					path={ 'overflowY' }
					{ ...containerOptions }
				/>
				<RangeWithUnitWithPath
					label={ __( 'Container height', 'iconvert-promoter' ) }
					path={ 'height' }
					{ ...heightOptions }
					{ ...containerOptions }
				/>
				<RangeWithUnitWithPath
					label={ __( 'Scrollbar width', 'iconvert-promoter' ) }
					path={ '--scrollbar-width' }
					media={ 'desktop' }
					{ ...trackWidthOptions }
					{ ...outerOptions }
				/>
			</KubioPanelBody>
		</>
	);
};

const Options = withComputedData()( Panel );
export default Options;
