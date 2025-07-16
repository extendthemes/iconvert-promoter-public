import { withPropsChecker } from '@kubio/core';
import { Content } from '../../inspector/content';
import { Style } from '../../inspector/style';
import { IconList } from './component';

function IconListEdit(props) {
	return (
		<>
			<Content {...props} />
			<Style {...props} />
			<IconList {...props} />
		</>
	);
}

export default withPropsChecker(IconListEdit);
