const isPreviewPage = () => {
	const searchQuery = window.location.search;

	if (
		searchQuery.includes( 'kubio-random=' ) ||
		searchQuery.includes( 'kubio-preview=' ) ||
		searchQuery.includes( '__iconvert-promoter-preview=' )
	) {
		return true;
	}
	return false;
};

export { isPreviewPage };
