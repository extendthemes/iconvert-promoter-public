import { TextSave } from './component';

import blockType from './block.json';

export default function save(props) {
	return <TextSave blockType={blockType} save={true} {...props} />;
}
