import { IconListItem } from './component';

import { withPropsChecker } from '@kubio/core';

function IconListItemEdit(props) {
	return (
		<>
			<IconListItem {...props} />
		</>
	);
}

export default withPropsChecker(IconListItemEdit);
