import { Content } from './inspector/content';
import { ButtonGroup } from './component';

function BlockEdit(props) {
	return (
		<>
			<Content />
			<ButtonGroup {...props} />
		</>
	);
}

export default BlockEdit;
