import { Icon } from './component';

import { Content } from './inspector/content';
import { Style } from './inspector/style';

function IconEdit(props) {
	return (
		<>
			<Content />
			<Style />
			<Icon {...props} />
		</>
	);
}

export default IconEdit;
