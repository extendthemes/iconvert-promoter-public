import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { SidesControl } from '../components/trbl-values-control';

const MarginsControl = compose(
	withSelect(() => {
		return { title: 'Margins' };
	})
)(SidesControl);
export { MarginsControl };
