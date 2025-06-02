import {
	InputControlWithPath,
	RangeWithUnitWithPath,
	SelectControlWithPath,
	SeparatorHorizontalLine,
	TextareaControlWithPath,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { properties } from '../../../config';
import { __ } from '@wordpress/i18n';

const Component_ = ({ computed }) => {
	const { typeAnimationIsType } = computed;

	return (
		<>
			<SelectControlWithPath
				label={__('Type animation', 'kubio')}
				type={WithDataPathTypes.PROP}
				path="fancy.typeAnimation"
				options={properties.typeAnimationOptions}
			/>

			<SeparatorHorizontalLine />

			<InputControlWithPath
				label={__('Word', 'kubio')}
				type={WithDataPathTypes.PROP}
				path="fancy.fancyWord"
			/>
			<TextareaControlWithPath
				label={__('Rotating words', 'kubio')}
				type={WithDataPathTypes.PROP}
				path="fancy.fancyRotatingWords"
			/>

			{!typeAnimationIsType && (
				<RangeWithUnitWithPath
					label={__('Animation duration', 'kubio')}
					path={'fancy.animationDuration'}
					type={WithDataPathTypes.PROP}
					{...properties.animationDurationOptions}
				/>
			)}
			{typeAnimationIsType && (
				<>
					<RangeWithUnitWithPath
						label={__('Type speed', 'kubio')}
						path={'fancy.type.animationDuration.in'}
						type={WithDataPathTypes.PROP}
						{...properties.typeAnimationDurationOptions}
					/>
					<RangeWithUnitWithPath
						label={__('Back speed', 'kubio')}
						path={'fancy.type.animationDuration.out'}
						type={WithDataPathTypes.PROP}
						{...properties.typeAnimationDurationOptions}
					/>
				</>
			)}
		</>
	);
};
const computed = (dataHelper) => {
	const typeAnimation = dataHelper.getProp('fancy.typeAnimation');

	const typeAnimationIsType =
		typeAnimation === properties.typeAnimationValues.TYPE;

	return { typeAnimationIsType };
};
const Component = withComputedData(computed)(Component_);
export default Component;
