import { ButtonGroup } from './component';
import { Content } from './inspector/content';

function BlockEdit( props ) {
	return (
		<>
			<Content />
			<ButtonGroup { ...props } />
		</>
	);
}

export default BlockEdit;
