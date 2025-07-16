export const getPopoverAnchorRef = ( anchorRef, contentRef ) => {
	const hasSelection = !! ( anchorRef?.endOffset - anchorRef?.startOffset );
	const anchorRefIsNode = anchorRef && anchorRef?.endOffset === undefined;

	let popoverAnchorRef = contentRef.current;

	if ( anchorRefIsNode || hasSelection ) {
		popoverAnchorRef = anchorRef;
	}

	return popoverAnchorRef;
};
