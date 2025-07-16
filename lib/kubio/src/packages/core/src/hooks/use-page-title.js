import { STORE_KEY } from '@kubio/constants';
import {
	useCurrentPageTitle,
	useGetGlobalSessionProp,
} from '@kubio/editor-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const usePageTitle = () => {
	const isEditorReady = useGetGlobalSessionProp( 'ready', false );
	const { title, postType, postId } = useSelect(
		( select ) => {
			if ( ! isEditorReady ) {
				return {
					title: __( 'Page', 'kubio' ),
				};
			}

			const {
				getCurrentPostType,
				getCurrentPostId,
				getEditedPostType,
				getEditedPostId,
			} = select( STORE_KEY );
			const { getEditedEntityRecord } = select( 'core' );

			const entityPostType = getCurrentPostType();
			const entityPostId = getCurrentPostId();

			let entityTitle = __( 'Page', 'kubio' );

			if ( entityPostType && entityPostId ) {
				entityTitle =
					getEditedEntityRecord(
						'postType',
						getCurrentPostType(),
						getCurrentPostId()
					).title || null;
			} else {
				entityTitle =
					getEditedEntityRecord(
						'postType',
						getEditedPostType(),
						getEditedPostId()
					).title || __( 'Page', 'kubio' );
			}

			return {
				title: entityTitle,
				postType: entityPostType,
				postId: entityPostId,
			};
		},
		[ isEditorReady ]
	);

	const pageTitle = useCurrentPageTitle( {
		title,
	} );

	if ( postType !== 'wp_template' && postType !== 'wp_template_part' ) {
		return title;
	}

	return pageTitle?.title || __( 'Page', 'kubio' );
};

export { usePageTitle };
