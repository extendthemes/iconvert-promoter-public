import linkConfig, { getLinkAttributes } from '../../../link-control';
import _ from 'lodash';

const LinkWrapper = ( { className, link, children } ) => {
	const mergedValue = _.merge( {}, linkConfig.defaultValue, link );
	const linkAttributes = getLinkAttributes( mergedValue );
	const href = linkAttributes?.href;
	if ( className ) {
		linkAttributes.className = className;
	}
	const newLinkAttributes = _.omit( linkAttributes, 'href' ); // disable href attribute in editor
	return (
		<>
			{ href && <a { ...newLinkAttributes }>{ children }</a> }
			{ ! href && <>{ children } </> }
		</>
	);
};

export { LinkWrapper };
