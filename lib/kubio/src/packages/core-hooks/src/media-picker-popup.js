import { __ } from '@wordpress/i18n';

const { wp } = window;

const slimImageObject = (img) => {
	const attrSet = [
		'sizes',
		'mime',
		'type',
		'subtype',
		'id',
		'url',
		'alt',
		'link',
		'caption',
	];
	return attrSet.reduce((result, key) => {
		if (img?.hasOwnProperty(key)) {
			result[key] = img[key];
		}
		return result;
	}, {});
};

const getAttachmentsCollection = (ids) => {
	return wp.media.query({
		order: 'ASC',
		orderby: 'post__in',
		post__in: ids,
		posts_per_page: -1,
		query: true,
		type: 'image',
	});
};

let mediaPickerFrame = null;

const openMediaPickerPopup = (
	value,
	{
		multiple = false,
		allowedTypes = ['image'],
		title = __('Select', 'kubio'),
		mode = null,
	} = {}
) => {
	const isGallery = false; // currently not implemented for gallery

	return new Promise((resolve, reject) => {
		if (mediaPickerFrame) {
			mediaPickerFrame?.remove?.();
		}

		const onFrameSelect = () => {
			const attachment = mediaPickerFrame
				.state()
				.get('selection')
				.toJSON();
			resolve(multiple ? attachment : attachment[0]);
		};

		const onFrameUpdate = (selections) => {
			const state = mediaPickerFrame.state();
			const selectedImages = selections || state.get('selection');

			if (!selectedImages || !selectedImages.models.length) {
				return;
			}

			if (multiple) {
				resolve(
					selectedImages.models.map((model) =>
						slimImageObject(model.toJSON())
					)
				);
			} else {
				resolve(slimImageObject(selectedImages.models[0].toJSON()));
			}
		};

		const onFrameOpen = () => {
			const frameContent = mediaPickerFrame.content.get();
			if (frameContent && frameContent.collection) {
				const collection = frameContent.collection;

				// Clean all attachments we have in memory.
				collection
					.toArray()
					.forEach((model) => model.trigger('destroy', model));

				// Reset has more flag, if library had small amount of items all items may have been loaded before.
				collection.mirroring._hasMore = true;

				// Request items.
				collection.more();
			}

			if (mode) {
				frameContent.mode(mode);
			}

			const hasMedia = Array.isArray(value) ? !!value?.length : !!value;
			const valueArray = Array.isArray(value) ? value : [value];

			if (!hasMedia) {
				return;
			}

			const selection = mediaPickerFrame.state().get('selection');
			valueArray.forEach((id) => {
				selection.add(wp.media.attachment(id));
			});

			// Load the images so they are available in the media modal.
			const attachments = getAttachmentsCollection(valueArray);

			// Once attachments are loaded, set the current selection.
			attachments.more().done(function () {
				if (isGallery && attachments?.models?.length) {
					selection.add(attachments.models);
				}
			});
		};

		const onClose = () => {
			reject(null);
		};

		mediaPickerFrame = wp.media({
			title,
			multiple,
			library: {
				type: allowedTypes,
			},
		});

		mediaPickerFrame.on('select', onFrameSelect);
		mediaPickerFrame.on('update', onFrameUpdate);
		mediaPickerFrame.on('update', onFrameOpen);
		mediaPickerFrame.on('update', onClose);
		mediaPickerFrame.open();
	});
};

export { openMediaPickerPopup };
