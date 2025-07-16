import { useKubioBlockContext } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { SeparatorHorizontalLine } from '../../components';
import BordersAndRadiusWithPath from './border-and-radiuses-wrapper';
import { BoxShadowWithPath } from './box-shadow-with-wrapper';

const BorderAndShadowControl = (props) => {
	const { filters, styledElement } = props;
	const {
		supportsBorder = true,
		supportsBoxShadow = true,
		allowInset = true,
		showReset = false,
		styleOthers = [],
	} = filters;

	// use customDataHelper because datahelper is not current block.
	const { dataHelper: customDataHelper } = useKubioBlockContext();

	const styledElements = _.concat(_.castArray(styledElement), styleOthers);

	return (
		<>
			{supportsBorder && (
				<BordersAndRadiusWithPath
					path={'border'}
					dataHelper={customDataHelper}
					style={styledElements}
				/>
			)}
			{supportsBorder && supportsBoxShadow && <SeparatorHorizontalLine />}
			{supportsBoxShadow && (
				<>
					<BoxShadowWithPath
						label={__('Box shadow', 'kubio')}
						path={'boxShadow'}
						allowInset={allowInset}
						showReset={showReset}
						dataHelper={customDataHelper}
					/>
				</>
			)}
		</>
	);
};

export { BorderAndShadowControl };
