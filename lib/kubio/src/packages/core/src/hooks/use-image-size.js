import { useSelect } from '@wordpress/data';
import _ from 'lodash';
import { __ } from '@wordpress/i18n';

const useImageSize = ( id ) => {
	const image = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return id ? getMedia( id ) : null;
		},
		[ id ]
	);

	const { imageSizes } = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return _.pick( getSettings(), [ 'imageSizes' ] );
	} );

	if ( ! image ) {
		return [];
	}
	const imageSizeOptions = _.map(
		_.filter( imageSizes, ( { slug } ) =>
			_.get( image, [ 'media_details', 'sizes', slug, 'source_url' ] )
		),
		( { name, slug } ) => ( { value: slug, label: name } )
	);

	return imageSizeOptions;
};

export { useImageSize };
