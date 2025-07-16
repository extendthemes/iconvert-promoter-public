import { SelectControl } from '@wordpress/components';
import { withColibriPath } from '@kubio/core';
import { GutentagSelectControl } from '../../components';

const SelectControlWithPath = withColibriPath((props) => {
	const { onChange, ...rest } = props;
	return <GutentagSelectControl {...rest} onChange={onChange} />;
});

export { SelectControlWithPath };
