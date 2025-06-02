import { types } from '../../../types';
import _ from 'lodash';
import { defaultAssetURL } from '@kubio/utils';

const defaultValue = _.merge( {}, types.props.background.slideshow.default, {
	slides: [
		{
			id: 1,
			url: defaultAssetURL( 'background-image-1.jpg' ),
		},
		{
			id: 2,
			url: defaultAssetURL( 'background-image-2.jpg' ),
		},
		{
			id: 3,
			url: defaultAssetURL( 'background-image-3.jpg' ),
		},
	],
} );
export { defaultValue };
