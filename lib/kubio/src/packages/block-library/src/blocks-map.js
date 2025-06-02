import * as row from './row';
import * as column from './column';
import * as video from './video';

import * as image from './image';
import * as link from './link';
import * as linkGroup from './link-group';
import * as button from './button';
import * as buttonGroup from './button-group';
import * as heading from './heading';
import * as text from './text';
import * as icon from './icon';
import * as divider from './divider';
import * as socialIcons from './social-icons';
import * as socialIcon from './social-icons/blocks/social-icon';
import * as shortcode from './shortcode';
import * as spacer from './spacer';
import * as postContent from './post-content';
import { iconList } from './icon-list';

let blocksMap = {
	row,
	column,
	video,
	image,
	link,
	linkGroup,
	button,
	buttonGroup,
	heading,
	text,
	icon,
	divider,
	socialIcons,
	socialIcon,
	shortcode,
	spacer,
	postContent,
	...iconList,
};

export { blocksMap };
