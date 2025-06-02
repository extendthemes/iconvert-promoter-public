const composeElementSharedClass = (
	{ styleRef },
	elementName,
	asSelector = false
) => {
	const className =
		'style-' + styleRef + ( elementName ? '-' + elementName : '' );
	return asSelector ? '.' + className : className;
};

export { composeElementSharedClass };
