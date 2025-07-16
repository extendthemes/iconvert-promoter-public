import { SidesControl } from '../components';

import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const PaddingsControl = compose(
	withSelect(() => {
		return { title: __('Paddings', 'kubio') };
	})
)(SidesControl);

export { PaddingsControl };
