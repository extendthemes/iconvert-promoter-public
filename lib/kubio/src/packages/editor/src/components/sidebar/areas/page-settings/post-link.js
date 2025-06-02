/**
 * External dependencies
 */
/**
 * Internal dependencies
 */
import { InputControl } from '@kubio/controls';
import { ExternalLink, PanelBody } from '@wordpress/components';
import { compose, ifCondition } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { withSelect } from '@wordpress/data';
import { cleanForSlug, store as editorStore } from '@wordpress/editor';
import { useState } from '@wordpress/element';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { safeDecodeURIComponent } from '@wordpress/url';
import { get } from 'lodash';

function PostLink({
	postLink,
	permalinkPrefix,
	permalinkSuffix,
	editPermalink,
	postSlug,
	postTypeLabel,
	isEditable,
}) {
	const [forceEmptyField, setForceEmptyField] = useState(false);
	let prefixElement, postNameElement, suffixElement;
	if (isEditable) {
		prefixElement = permalinkPrefix && (
			<span className="edit-post-post-link__link-prefix">
				{permalinkPrefix}
			</span>
		);
		postNameElement = postSlug && (
			<span className="edit-post-post-link__link-post-name">
				{postSlug}
			</span>
		);
		suffixElement = permalinkSuffix && (
			<span className="edit-post-post-link__link-suffix">
				{permalinkSuffix}
			</span>
		);
	}

	return (
		<PanelBody title={__('Permalink', 'kubio')}>
			{isEditable && (
				<div className="editor-post-link">
					<InputControl
						label={__('URL Slug', 'kubio')}
						value={forceEmptyField ? '' : postSlug}
						onChange={(newValue) => {
							editPermalink(newValue);
							// When we delete the field the permalink gets
							// reverted to the original value.
							// The forceEmptyField logic allows the user to have
							// the field temporarily empty while typing.
							if (!newValue) {
								if (!forceEmptyField) {
									setForceEmptyField(true);
								}
								return;
							}
							if (forceEmptyField) {
								setForceEmptyField(false);
							}
						}}
						onBlur={(event) => {
							editPermalink(cleanForSlug(event.target.value));
							if (forceEmptyField) {
								setForceEmptyField(false);
							}
						}}
					/>
					<p>
						{__('The last part of the URL.', 'kubio')}{' '}
						<ExternalLink href="https://wordpress.org/support/article/writing-posts/#post-field-descriptions">
							{__('Read about permalinks', 'kubio')}
						</ExternalLink>
					</p>
				</div>
			)}
			<h3 className="edit-post-post-link__preview-label">
				{postTypeLabel || __('View post', 'kubio')}
			</h3>
			<div className="edit-post-post-link__preview-link-container">
				<ExternalLink
					className="edit-post-post-link__link"
					href={postLink}
					target="_blank"
				>
					{isEditable ? (
						<>
							{prefixElement}
							{postNameElement}
							{suffixElement}
						</>
					) : (
						postLink
					)}
				</ExternalLink>
			</div>
		</PanelBody>
	);
}

export default compose([
	withSelect((select) => {
		const {
			isPermalinkEditable,
			getCurrentPost,
			isCurrentPostPublished,
			getPermalinkParts,
			getEditedPostAttribute,
			getEditedPostSlug,
		} = select(editorStore);

		const { getPostType } = select(coreStore);

		const { link } = getCurrentPost();

		const postTypeName = getEditedPostAttribute('type');
		const postType = getPostType(postTypeName);
		const permalinkParts = getPermalinkParts();

		return {
			postLink: link,
			isEditable: isPermalinkEditable(),
			isPublished: isCurrentPostPublished(),
			isViewable: get(postType, ['viewable'], false),
			postSlug: safeDecodeURIComponent(getEditedPostSlug()),
			postTypeLabel: get(postType, ['labels', 'view_item']),
			hasPermalinkParts: !!permalinkParts,
			permalinkPrefix: permalinkParts?.prefix,
			permalinkSuffix: permalinkParts?.suffix,
		};
	}),
	ifCondition(({ isEnabled, postLink, isViewable, hasPermalinkParts }) => {
		return isEnabled && postLink && isViewable && hasPermalinkParts;
	}),
])(PostLink);
