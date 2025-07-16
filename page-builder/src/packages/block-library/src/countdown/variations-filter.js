import { __ } from '@wordpress/i18n';

const blockDescription = __( 'Use countdown to.', 'iconvert-promoter' );

const variationsFilter = ( variation ) => {
	if ( variation?.isDefault ) {
		return {
			...variation,
			description: blockDescription,
		};
	}
	return variation;
};

export { variationsFilter };
