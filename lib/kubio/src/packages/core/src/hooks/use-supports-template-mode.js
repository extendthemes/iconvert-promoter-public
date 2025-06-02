import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

const useSupportsTemplateMode = () => {
	const supportsTemplateMode = useSelect( ( select ) => {
		const { getCurrentPostType, getEditorSettings } = select( editorStore );
		const { getPostType } = select( coreStore );
		const postType = getCurrentPostType();
		const isViewable = postType
			? getPostType( postType )?.viewable ?? false
			: true;
		const _supportsTemplateMode =
			getEditorSettings().supportsTemplateMode && isViewable;

		return _supportsTemplateMode;
	}, [] );

	return supportsTemplateMode;
};

export { useSupportsTemplateMode };
