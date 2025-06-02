import _ from 'lodash';
import { types } from '../../../types';

const defaultValue = _.merge( {}, types.props.background.video.default, {
	internal: {
		url: 'https://static-assets.kubiobuilder.com/defaults/demo-video.mp4',
		mime: 'video/mp4',
	},
	poster: {
		url: 'https://static-assets.kubiobuilder.com/defaults/demo-video-cover.jpg',
	},
} );
export { defaultValue };
