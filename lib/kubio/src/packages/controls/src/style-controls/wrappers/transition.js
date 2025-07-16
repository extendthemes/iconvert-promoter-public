import { TransitionControl } from '../transition';

const TransitionControlOnHover = (props) => {
	if (props?.state === 'hover') {
		return <TransitionControl {...props} />;
	}
	return null;
};

export { TransitionControlOnHover };
