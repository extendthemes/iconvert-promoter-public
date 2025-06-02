import { DividerSave } from './component';
import { name } from './block.json';

export default function save(props) {
	return <DividerSave name={name} save={true} {...props} />;
}
