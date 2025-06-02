import { compose } from '@wordpress/compose';
import { noop } from 'lodash';
import { withStyledElements } from './with-styled-elements';
import { withColibriData, withColibriDataAutoSave } from './with-colibri-data';

const withKubioDataAndStyle = (
	computedData = noop,
	styleMapper = noop,
	autosave = true
) =>
	compose( [
		autosave
			? withColibriDataAutoSave( computedData )
			: withColibriData( computedData ),
		withStyledElements( styleMapper ),
	] );

const composeWithKubioDataAndStyle = (
	Component,
	computedData = noop,
	styleMapper = noop,
	autosave = true
) => withKubioDataAndStyle( computedData, styleMapper, autosave )( Component );

export { composeWithKubioDataAndStyle, withKubioDataAndStyle };
