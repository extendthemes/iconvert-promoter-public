import { useSelect, useDispatch } from '@wordpress/data';
import { SnackbarList } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';

export const EditorSnackbars = () => {
	const notices = useSelect(
		(select) =>
			select(noticesStore)
				.getNotices()
				.filter((notice) => notice.type === 'snackbar')
				.map((notice) => ({
					...notice,
					className: `is-${notice.status}`,
				})),
		[]
	);
	const { removeNotice } = useDispatch(noticesStore);
	return (
		<SnackbarList
			className="components-editor-notices__snackbar edit-site-notices"
			notices={notices}
			onRemove={removeNotice}
		/>
	);
};
