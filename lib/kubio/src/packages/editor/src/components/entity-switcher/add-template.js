import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { cleanForSlug } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { Button, Modal, TextControl } from '@wordpress/components';

const AddTemplate = ({ ids, onAddTemplateId, onRequestClose, isOpen }) => {
	const slugs = useSelect(
		(select) => {
			const { getEntityRecord } = select('core');
			return ids.reduce((acc, id) => {
				const template = getEntityRecord('postType', 'wp_template', id);
				acc[template ? template.slug : 'loading'] = true;
				return acc;
			}, {});
		},
		[ids]
	);
	const { saveEntityRecord } = useDispatch('core');

	const [slug, _setSlug] = useState();
	const [help, setHelp] = useState();
	const setSlug = useCallback(
		(nextSlug) => {
			_setSlug(nextSlug);
			const cleanSlug = cleanForSlug(nextSlug);
			setHelp(
				slugs[cleanSlug]
					? __('Template already exists, edit it instead.', 'kubio')
					: cleanSlug
			);
		},
		[slugs]
	);
	const add = useCallback(async () => {
		_setSlug('');
		const cleanSlug = cleanForSlug(slug);

		try {
			const template = await saveEntityRecord('postType', 'wp_template', {
				title: cleanSlug,
				status: 'publish',
				slug: cleanSlug,
			});
			onAddTemplateId(template.id);
			onRequestClose();
		} catch (err) {
			setHelp(__('Error adding template.', 'kubio'));
		}
	}, [slug, onRequestClose]);
	return (
		!slugs.loading &&
		isOpen && (
			<Modal
				title={__('Add Template', 'kubio')}
				onRequestClose={onRequestClose}
			>
				<TextControl
					label={__('Add Template', 'kubio')}
					placeholder={__('template-slug', 'kubio')}
					value={slug}
					onChange={setSlug}
					help={help}
				/>
				<Button
					isPrimary
					disabled={!slug || slugs[cleanForSlug(slug)]}
					onClick={add}
				>
					{__('Add', 'kubio')}
				</Button>
			</Modal>
		)
	);
};

export { AddTemplate };
