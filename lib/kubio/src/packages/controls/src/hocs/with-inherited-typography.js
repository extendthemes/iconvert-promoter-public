import _ from 'lodash';
import { useInheritedTypographyValue } from '@kubio/global-data';
import { createHigherOrderComponent } from '@wordpress/compose';

const WithInheritedTypography = createHigherOrderComponent(
	( WrappedComponent ) => {
		return ( props ) => {
			const { nodeType = 'p', value: currentValue = {} } = props;

			const inherited = useInheritedTypographyValue( nodeType, '', {} );
			const readValue = _.merge( {}, inherited, currentValue );

			return <WrappedComponent { ...props } value={ readValue } />;
		};
	},
	'WithInheritedTypography'
);

export { WithInheritedTypography };
