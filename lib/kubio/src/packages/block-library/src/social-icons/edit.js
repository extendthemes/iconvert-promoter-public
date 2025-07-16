import { withPropsChecker } from '@kubio/core';
import { compose } from '@wordpress/compose';
import { useState, useMemo } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { Content } from './inspector/content';
import { LinkGroup } from './component';
import { Style } from './inspector/style';
import { SocialIconsContext } from './context';

function BlockEdit(props) {
	const [currentActiveItem, setCurrentActiveItem] = useState();

	const context = useMemo(
		() => ({
			currentActiveItem,
			setCurrentActiveItem,
			socialIconsClientId: props.clientId,
		}),
		[currentActiveItem]
	);

	return (
		<SocialIconsContext.Provider value={context}>
			<Content />
			<Style />
			<LinkGroup {...props} />
		</SocialIconsContext.Provider>
	);
}

export default compose(
	withSelect((select, ownProps) => {
		const { clientId } = ownProps;
		const { getBlockOrder } = select('core/block-editor');

		return {
			hasChildBlocks: getBlockOrder(clientId).length > 0,
		};
	}),
	withPropsChecker
)(BlockEdit);
