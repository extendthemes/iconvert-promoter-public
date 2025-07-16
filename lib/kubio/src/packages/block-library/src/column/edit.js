import { Column } from './component';
import { Content } from './inspector/content';
import { Style } from './inspector/style';

function BlockEdit(props) {
	return (
		<>
			<Content />
			<Style />
			<Column {...props} />
		</>
	);
}

export default BlockEdit;
