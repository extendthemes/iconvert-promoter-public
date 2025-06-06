/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const MEDIA_TYPE_IMAGE = 'image';
export const MEDIA_TYPE_VIDEO = 'video';
export const MEDIA_TYPE_AUDIO = 'audio';
export const MEDIA_TYPE_ANY = 'any';

export const OPTION_TAKE_VIDEO = __( 'Take a Video', 'kubio' );
export const OPTION_TAKE_PHOTO = __( 'Take a Photo', 'kubio' );
export const OPTION_TAKE_PHOTO_OR_VIDEO = __(
	'Take a Photo or Video',
	'kubio'
);
export const OPTION_INSERT_FROM_URL = __( 'Insert from URL', 'kubio' );
export const OPTION_WORDPRESS_MEDIA_LIBRARY = __(
	'WordPress Media Library',
	'kubio'
);
