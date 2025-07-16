import { Style } from './inspector/style';
import { Content } from './inspector/content';
import { Row } from './component';

function BlockEdit(props) {
	return (
		<>
			<Content />
			<Style />
			<Row {...props} />
		</>
	);
}

export default BlockEdit;
