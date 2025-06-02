import { __ } from '@wordpress/i18n';

import { withComputedData } from '@kubio/core';
import { GutentagSelectControl, KubioPanelBody } from '@kubio/controls';
import { properties } from '../../config';
import HighlithedControl from './effects/highlighted';
import RotateControl from './effects/rotate';
import { stripTags } from '@kubio/utils';

const Panel_ = ({ computed }) => {
	const { typeStyleIs, typeStyle } = computed;

	return (
		<KubioPanelBody title={__('Effects', 'kubio')} initialOpen={false}>
			<GutentagSelectControl
				label={__('Effect Type', 'kubio')}
				options={properties.typeStyleOption}
				{...typeStyle}
			/>
			{typeStyleIs.highlighted && <HighlithedControl />}
			{typeStyleIs.rotating && <RotateControl />}
		</KubioPanelBody>
	);
};
const computed = (dataHelper) => {
	const setFancyWord = () => {
		const text = dataHelper.getAttribute('content');
		const words = stripTags(text)
			.trim()
			.split(/(\s+)/)
			.filter(function (e) {
				return e.trim().length > 0;
			});
		const fancyWord = dataHelper.getProp('fancy.fancyWord');

		//if the fancy word already exist in the text do nothing
		if (words.includes(fancyWord)) {
			return;
		}

		//set last word as the fancy word
		const lastWord = words[words.length - 1];
		dataHelper.setProp('fancy.fancyWord', lastWord);
	};
	const typeStyle = {
		value: dataHelper.getProp('fancy.typeStyle'),
		onChange: (event) => {
			const currentValue = dataHelper.getProp('fancy.typeStyle');
			if (event !== 'none' && currentValue === 'none') {
				setFancyWord();
			}
			dataHelper.setProp('fancy.typeStyle', event);
		},
	};

	const typeStyleIs = {
		rotating: typeStyle.value === properties.typeStyleValues.ROTATE,
		highlighted: typeStyle.value === properties.typeStyleValues.HIGHLIGHT,
	};

	return { typeStyleIs, typeStyle };
};
const Panel = withComputedData(computed)(Panel_);
export default Panel;
