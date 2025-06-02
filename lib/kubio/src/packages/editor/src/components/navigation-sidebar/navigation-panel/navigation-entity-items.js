/**
 * WordPress dependencies
 */
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { __experimentalNavigationItem as NavigationItem } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { getPathAndQueryString } from '@wordpress/url';
import { STORE_NAME } from '../../../store/constants';

const getEntityTitle = (kind, entity) =>
	'taxonomy' === kind ? entity.name : entity?.title?.rendered;

export default function NavigationEntityItems({ kind, name, query = {} }) {
	const entities = useSelect(
		(select) => select('core').getEntityRecords(kind, name, query),
		[kind, name, query]
	);

	const { setPage } = useDispatch(STORE_NAME);

	if (!entities) {
		return null;
	}

	const onActivateItem = ({ type, slug, link, id }) => {
		setPage({
			type,
			slug,
			path: getPathAndQueryString(link),
			context: {
				postType: type,
				postId: id,
			},
		});
	};

	return entities.map((entity) => {
		const key = `content-${getPathAndQueryString(entity.link)}`;

		return (
			<NavigationItem
				key={key}
				item={key}
				title={getEntityTitle(kind, entity)}
				onClick={() => onActivateItem(entity)}
			/>
		);
	});
}
