import { useKubioBlockContext } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import BoxUnitValueControlWithPath from '../wrappers/box-control-unit-value-wrapper';

const SpacingControl = ({ filters }) => {
	const { supportsPadding = true, supportsMargin = true } = filters;
	// use customDataHelper because datahelper is not current block.
	const { dataHelper: customDataHelper } = useKubioBlockContext();

	return (
		<>
			{supportsPadding && (
				<BoxUnitValueControlWithPath
					label={__('Padding', 'kubio')}
					path={'padding'}
					capMin={true}
					min={0}
					dataHelper={customDataHelper}
				/>
			)}
			{supportsMargin && (
				<BoxUnitValueControlWithPath
					label={__('Margin', 'kubio')}
					path={'margin'}
					capMin={false}
					min={-9999999999999}
					dataHelper={customDataHelper}
				/>
			)}
		</>
	);
};
export { SpacingControl };
