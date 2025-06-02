import { createSlotFill } from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import _ from 'lodash';
import classnames from 'classnames';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const KubioSectionsTagsSlotFill = createSlotFill( 'KubioSectionsTagsSlotFill' );

const ALL_TAG = 'All';

const KubioSectionsTags = ( {
	activeTag,
	setActiveTag,
	availableTagSlugs = [],
} ) => {
	const [ internalActiveTag, setInternalActiveTag ] = useState();

	const { cloudTags } = useSelect( ( select ) => {
		const { getSettings = _.noop } = select( 'kubio/edit-site' ) || {};
		const settings = getSettings() || {};
		return {
			cloudTags: settings?.kubioBlockTags || [],
		};
	} );

	useEffect( () => {
		if ( activeTag !== internalActiveTag ) {
			setInternalActiveTag( activeTag );
		}
	}, [ activeTag, internalActiveTag ] );

	const tagsOptions = useMemo( () => {
		const tags = cloudTags
			.filter( ( { slug } ) => {
				return availableTagSlugs.includes( slug );
			} )
			.map( ( tag ) => {
				return {
					label: tag.label,
					slug: tag.slug,
				};
			} );

		tags.unshift( {
			slug: ALL_TAG,
			label: __( 'All', 'kubio' ),
		} );
		return tags;
	}, [ availableTagSlugs, cloudTags ] );

	const onSelectTag = ( newTag ) => {
		if ( newTag === activeTag ) {
			return;
		}

		setInternalActiveTag( newTag );
		setActiveTag( newTag );
	};

	return (
		<div className="kubio-inserter-section-tags">
			{ tagsOptions.map( ( { slug, label } ) => {
				const isActive = slug === internalActiveTag;
				return (
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
					<div
						key={ slug }
						onClick={ () => onSelectTag( slug ) }
						className={ classnames( 'kubio-inserter-section-tag', {
							'kubio-inserter-section-tag--active': isActive,
						} ) }
					>
						{ label }
					</div>
				);
			} ) }
		</div>
	);
};

export { KubioSectionsTags, KubioSectionsTagsSlotFill, ALL_TAG };
