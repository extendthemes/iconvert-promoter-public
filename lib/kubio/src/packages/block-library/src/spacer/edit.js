import { Content } from './inspector/content';
import { Spacer } from './component';

function LogoEdit(props) {
	return (
		<>
			<Content />
			<Spacer {...props} />
		</>
	);
}

export default LogoEdit;
