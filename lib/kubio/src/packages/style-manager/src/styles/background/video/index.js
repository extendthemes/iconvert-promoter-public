import _ from 'lodash';
import { types } from '../../../types';

const defaultValue = _.merge( {}, types.props.background.video.default, {
	internal: {
		url: '#',
		mime: 'video/mp4',
	},
	poster: {
		url: '#',
	},
} );
export { defaultValue };
