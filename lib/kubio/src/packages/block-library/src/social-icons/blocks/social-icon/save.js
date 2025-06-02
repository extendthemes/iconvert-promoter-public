import { LinkSave } from './component';
import blockType from './block.json';

export default function save(props) {
	return <LinkSave blockType={blockType} save={true} {...props}></LinkSave>;
}
