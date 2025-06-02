import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../elements';
import { RangeWithUnitWithPath, KubioPanelBody } from '@kubio/controls';
import { __ } from '@wordpress/i18n';

const Panel = ({ computed }) => {
	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.CONTAINER,
	};

	return (
		<>
			<KubioPanelBody title={__('Spacer Properties', 'kubio')}>
				<RangeWithUnitWithPath
					label={__('Height', 'kubio')}
					path={'height'}
					max={300}
					min={1}
					capMin
					{...commonOptions}
				/>
			</KubioPanelBody>
		</>
	);
};

const useComputed = (dataHelper) => {};

const PanelWithData = withComputedData(useComputed)(Panel);

export default PanelWithData;
