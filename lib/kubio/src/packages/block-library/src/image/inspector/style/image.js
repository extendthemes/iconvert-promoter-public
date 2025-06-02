import {
	BordersAndRadiusWithPath,
	BoxShadowWithPath,
	KubioPanelBody,
	RangeWithUnitWithPath,
	SeparatorHorizontalLine,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { properties } from '../../edit/config';
import { ElementsEnum } from '../../elements';

function isRadiusChange(value) {
	return _.find(value, function (i) {
		return undefined !== i.radius;
	});
}

const Panel_ = ({ computed } = props) => {
	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.IMAGE,
	};

	return (
		<KubioPanelBody title={__('Image', 'kubio')}>
			<RangeWithUnitWithPath
				label={__('Opacity', 'kubio')}
				path={'opacity'}
				capMin={true}
				capMax={true}
				defaultUnit={''}
				defaultValue={{ value: 1 }}
				{...properties.opacityOptions}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine />

			<BoxShadowWithPath path={'boxShadow'} {...commonOptions} />

			<SeparatorHorizontalLine />

			<BordersAndRadiusWithPath
				path={'border'}
				{...commonOptions}
				style={[
					ElementsEnum.IMAGE,					
					ElementsEnum.OVERLAY,
				]}
			/>
		</KubioPanelBody>
	);
};

// TODO: This should be removed
const useComputed = (dataHelper) => {
	return {
		dataHelper,
	};
};

const Panel = withComputedData(useComputed)(Panel_);

export default Panel;
