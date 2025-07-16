import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../elements';
import { useInheritedTypographyValue } from '@kubio/global-data';
import { TypographyControlPopupWithPath, ColorWithPath } from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';

const Panel_ = () => {
	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.LINK,
	};

	const textColor = useInheritedTypographyValue('a', 'color');
	const textColorHover = useInheritedTypographyValue(
		'a',
		'states.hover.color'
	);
	const textColorVisited = useInheritedTypographyValue(
		'a',
		'states.visited.color'
	);

	return (
		<PanelBody title={__('Link style', 'kubio')}>
			<TypographyControlPopupWithPath
				path={'typography'}
				nodeType={'a'}
				{...commonOptions}
			/>
			<ColorWithPath
				label={__('Text color', 'kubio')}
				path={'typography.color'}
				{...commonOptions}
				defaultValue={textColor}
			/>
			<ColorWithPath
				label={__('Hover text color', 'kubio')}
				path={'typography.color'}
				state={'hover'}
				{...commonOptions}
				defaultValue={textColorHover}
			/>
			<ColorWithPath
				label={__('Visited text color', 'kubio')}
				path={'typography.color'}
				state={'visited'}
				{...commonOptions}
				defaultValue={textColorVisited}
			/>
		</PanelBody>
	);
};

const useComputed = (dataHelper) => {
	return {};
};

const Panel = withComputedData(useComputed)(Panel_);
export default Panel;
