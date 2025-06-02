import { svgIcons } from '@kubio/constants';
import { useMemo } from '@wordpress/element';
import _ from 'lodash';

const CanvasIcon_ = ( {
	name,
	className,
	htmlTag: Tag = 'span',
	...rest
} = {} ) => {
	const html = useMemo( () => {
		let iconName = name || 'font-awesome/star';

		// trim the icon name and replace all spaces with a dash
		iconName = iconName.trim().replace( /\s/g, '-' );
		return {
			__html: _.get( svgIcons, iconName ),
		};
	}, [ name ] );
	return (
		<Tag
			{ ...rest }
			className={ `${ className } h-svg-icon` }
			dangerouslySetInnerHTML={ html }
		/>
	);
};

const CanvasIcon = CanvasIcon_;

export { CanvasIcon };
