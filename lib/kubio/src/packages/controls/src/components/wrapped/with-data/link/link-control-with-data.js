// TODO fix this - move in style-controls
import { withComputedData } from '@kubio/core';
import _ from 'lodash';
import LinkConfig from '../../../link-control';
import { LinkControl } from '../../../link-control/link-control';

const computed = ( dataHelper, {__linkDataProp = 'link'} ) => {
	const link = dataHelper.getAttribute( __linkDataProp, {} );
	const mergedValue = _.merge( {}, LinkConfig.defaultValue, link );
	const linkOpenValues = LinkConfig.linkOpen.values;
	const linkIs = {
		sameWindow: mergedValue.typeOpenLink === linkOpenValues.SAME_WINDOW,
		newWindow: mergedValue.typeOpenLink === linkOpenValues.NEW_WINDOW,
		lightbox: mergedValue.typeOpenLink === linkOpenValues.LIGHT_BOX,
	};
	return {
		link: mergedValue,
		linkIs,
		linkDataProp: __linkDataProp,
	};
};

const LinkControlWithData = withComputedData( computed )( LinkControl );

export { LinkControlWithData };
