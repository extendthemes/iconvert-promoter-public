import { ToggleGroup } from '../../components/toggle-group/toggle-group';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { horizontalAlignOptions } from '../ui-utils';

const HorizontalAlignBase = ( props ) => {
	// eslint-disable-next-line no-unused-vars
	const { styledComponent, ...rest } = props;

	return (
		<ToggleGroup
			className={ 'kubio-horizontal' }
			label={ __( 'Horizontal align', 'kubio' ) }
			options={ horizontalAlignOptions }
			allowReset
			{ ...rest }
		/>
	);
};

export { HorizontalAlignBase };
