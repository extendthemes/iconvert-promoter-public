import useGlobalDataEntity from './use-global-data-entity';
import { capitalizeFirstLetter } from '@kubio/utils';

const useGlobalPageTitleTemplates = () => {
	const { getPathValue, setPathValue } = useGlobalDataEntity();

	const titles = getPathValue('page_titles', {
		normalPage: '{TITLE}',
		normalResultsPage: 'Search results for: {TITLE}',
		errorPage: 'Sorry! Page Not Found!',
		singlePost: '{TITLE}',
		categoryArchive: 'Posts in {TITLE}',
		authorArchive: 'Posts by {TITLE}',
		tagArchive: 'Posts in {TITLE}',
		yearArchive: 'Posts from {TITLE}',
		monthArchive: 'Posts from {TITLE}',
		dayArchive: 'Posts from {TITLE}',
	});
	const setters = {};
	Object.keys(titles).forEach((title) => {
		const transformedTitle = capitalizeFirstLetter(title);
		setters[`set${transformedTitle}`] = (nextValue) => {
			setPathValue(`page_titles`, {
				...titles,
				[title]: nextValue,
			});
		};
	});

	return {
		...titles,
		...setters,
	};
};

export default useGlobalPageTitleTemplates;
