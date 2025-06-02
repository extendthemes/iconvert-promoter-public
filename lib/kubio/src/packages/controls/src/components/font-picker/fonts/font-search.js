import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';

const FontSearch = ( { value, onChange } ) => {
	return (
		<>
			<TextControl
				placeholder={ __( 'Search font family', 'kubio' ) }
				value={ value }
				onChange={ onChange }
				autoComplete={ 'off' }
			/>
			<span className={ 'search-icon' }>{ search }</span>
		</>
	);
};

export { FontSearch };
