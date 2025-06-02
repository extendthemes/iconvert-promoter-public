import { name as row } from './row/block.json';
import { name as column } from './column/block.json';
import { name as shortcode } from './shortcode/block.json';
import { name as image } from './image/block.json';
import { name as link } from './link/block.json';
import { name as linkGroup } from './link-group/block.json';
import { name as button } from './button/block.json';
import { name as buttonGroup } from './button-group/block.json';
import { name as text } from './text/block.json';
import { name as heading } from './heading/block.json';
import { name as video } from './video/block.json';
import { name as icon } from './icon/block.json';
import { name as iconList } from './icon-list/blocks/icon-list/block.json';
import { name as iconListItem } from './icon-list/blocks/icon-list-item/block.json';

import { name as socialIcons } from './social-icons/block.json';
import { name as socialIcon } from './social-icons/blocks/social-icon/block.json';

import { name as DIVIDER } from './divider/block.json';
import { name as SPACER } from './spacer/block.json';
import { name as content } from './post-content/block.json';

const NamesOfBlocks = {
	ROW: row,
	COLUMN: column,
	SHORTCODE: shortcode,
	IMAGE: image,
	LINK: link,
	LINK_GROUP: linkGroup,
	BUTTON: button,
	BUTTON_GROUP: buttonGroup,
	DIVIDER,
	SPACER,
	HEADING: heading,
	TEXT: text,
	VIDEO: video,
	ICON: icon,
	ICON_LIST: iconList,
	ICON_LIST_ITEM: iconListItem,
	SOCIAL_ICONS: socialIcons,
	SOCIAL_ICON: socialIcon,
	CONTENT: content,
};

export default NamesOfBlocks;
