import _ from 'lodash';
import { Button } from '@wordpress/components';
import { STORE_KEY } from '@kubio/constants';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { desktop, mobile, tablet } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';
import { openPreviewWindow } from './preview-window';
import { useChangesetPost } from './use-changest-post';
import { usePrepareChangeset } from './use-prepare-changeset';
import shortid from 'shortid';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { getPreviewElementByModelId, getBackendData} from '@kubio/utils';
import { useBlocksOwnerDocument } from '@kubio/editor-data';
import { useEffect, useState } from '@wordpress/element';
import { getKubioUrlWithRestPrefix } from '@kubio/constants';

const PreviewOptions = () => {
	const { isDirty } = useSelect((select) => {
		const { __experimentalGetDirtyEntityRecords } = select('core');
		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();

		return {
			isDirty: dirtyEntityRecords.length > 0,
		};
	});

	const prepareChangeset = usePrepareChangeset();
	const { saveChangeset } = useChangesetPost();
	const { currentPageURL, postId } = useSelect((select) => {
		const page = select(STORE_KEY).getPage();
		const link = _.get(page, 'link');
		const path = _.get(page, 'path');
		const url = link ? link : path;

		return {
			postId: page?.context?.postId,
			currentPageURL: (url ?? '').replace(/\/$/, ''),
		};
	});

	const preparePreview = async ({ }) => {
		const window = openPreviewWindow();
	
		let url = getBackendData('previewUrl');
		if (isDirty) {
			const data = await prepareChangeset();
			const uuid = await saveChangeset(data);
			url = addQueryArgs(url, {
					'iconvert-promoter-preview': uuid,
				'iconvert-promoter-random'
				: `${shortid.generate()}-${shortid.generate()}`,
			});
		} else {
			url = addQueryArgs(url, {
				'iconvert-promoter-random'
				: `${shortid.generate()}-${shortid.generate()}`,
			});
		}

		window.location = url;
	};
	// const preparePreview = async ({}) => {
	// 	const window = openPreviewWindow();
	// 	if (isDirty) {
	// 		const data = await prepareChangeset();
	// 		const uuid = await saveChangeset(data);
	// 		window.location = addQueryArgs(currentPageURL, {
	// 			[getKubioUrlWithRestPrefix('kubio-preview')]: uuid,
	// 			[getKubioUrlWithRestPrefix(
	// 				'kubio-random'
	// 			)]: `${shortid.generate()}-${shortid.generate()}`,
	// 		});
	// 	} else {
	// 		window.location = addQueryArgs(currentPageURL, {
	// 			[getKubioUrlWithRestPrefix(
	// 				'kubio-random'
	// 			)]: `${shortid.generate()}-${shortid.generate()}`,
	// 		});
	// 	}
	// };

	return (
		<div className={'kubio-preview-options'}>
			{currentPageURL !== '' && (
				<Button onClick={preparePreview}>
					{__('Preview', 'kubio')}
				</Button>
			)}
		</div>
	);
};

export { PreviewOptions };
