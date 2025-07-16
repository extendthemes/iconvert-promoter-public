import { Image } from './component';
import { Content } from '../inspector/content';
import { Style } from '../inspector/style';
import { withPropsChecker } from '@kubio/core';

const ImageEdit = (props) => {
	return (
		<>
			<Content />
			<Style />
			<Image {...props} />
		</>
	);
};
export default withPropsChecker(ImageEdit);
