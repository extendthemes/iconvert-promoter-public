import { useDispatch } from '@wordpress/data';
import shortid from 'shortid';

const useKubioNotices = () => {
	const { createErrorNotice, createSuccessNotice, removeNotice } =
		useDispatch( 'core/notices' );

	const createKubioSuccesNotice = ( content, options ) => {
		const id = options ?? `kubio-notice-` + shortid.generate();

		const result = createSuccessNotice( content, {
			type: 'snackbar',
			...options,
			id,
		} );

		if ( options?.duration ) {
			setTimeout( () => {
				removeNotice( id );
			}, options.duration );
		}

		return result;
	};
	const createKubioErrorNotice = ( content, options ) => {
		const id = options ?? `kubio-notice-` + shortid.generate();

		const result = createErrorNotice( content, {
			type: 'snackbar',
			...options,
			id,
		} );

		if ( options?.duration ) {
			setTimeout( () => {
				removeNotice( id );
			}, options.duration );
		}

		return result;
	};
	return {
		createSuccessNotice: createKubioSuccesNotice,
		createErrorNotice: createKubioErrorNotice,
	};
};

export { useKubioNotices };
