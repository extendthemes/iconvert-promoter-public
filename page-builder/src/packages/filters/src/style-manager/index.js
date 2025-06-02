import { addFilter } from '@wordpress/hooks';
import _ from 'lodash';
addFilter(
	'kubio.styleManager.prefixSelectorsByType',
	'kubio-child',
	( prefixSelectorsByType ) => {
		const popupSelector =
			'html .wp-block-cspromo-promopopup__outer.position-relative';
		const data = {
			shared: '#kubio',
			local: '#kubio',
			dynamic: popupSelector,
			global: popupSelector,
		};

		//TODO @catalin investigate why the data from the filter is not read in the style manager. it may be because it is inside a worker
		_.set( top, 'kubioFilters.styleManager.prefixSelectorsByType', data );
		return data;
	}
);
