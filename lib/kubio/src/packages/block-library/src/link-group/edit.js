import { Content } from './inspector/content';
import { LinkGroup } from './component';

function BlockEdit(props) {
	return (
		<>
			<Content />
			<LinkGroup {...props} />
		</>
	);
}

export default BlockEdit;
