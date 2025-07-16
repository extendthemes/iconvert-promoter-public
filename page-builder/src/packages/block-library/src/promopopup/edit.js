import { Base } from './component';
import { Content } from './inspector/content';
import { Style } from './inspector/style';

function DividerEdit( props ) {
	return (
		<>
			<Content { ...props } />
			<Style />
			<Base { ...props } />
		</>
	);
}

export default DividerEdit;
