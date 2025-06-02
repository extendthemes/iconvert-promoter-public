import { PRODUCT_NAME } from '@kubio/constants';

function useJSComponentProps( name, settings, { disabled = false } = {} ) {
	let props = {
		[ `data-${ PRODUCT_NAME }-component` ]: name,
		[ `data-${ PRODUCT_NAME }-settings` ]: JSON.stringify( settings ),
	};

	if ( disabled ) {
		props = {
			...props,
			'data-disabled': 'true',
		};
	}

	return props;
}

export { useJSComponentProps };
