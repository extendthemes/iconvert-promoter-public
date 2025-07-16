const StylesEnum = {
	BACKGROUND: 'background',
	BORDER: 'border',
	PADDING: 'padding',
	MARGIN: 'margin',
	APPEARANCE: 'appearance',
	RESPONSIVE: 'responsive',
	SPACING: 'spacing',
	BOX_SHADOW: 'boxShadow',
	TEXT_SHADOW: 'textShadow',
	SEPARATORS: 'separators',
	TYPOGRAPHY: 'typography',
	TYPOGRAPHY_FOR_HEADING: 'typography-for-heading',
	TYPOGRAPHY_FOR_CONTAINER: 'typographyContainer',
	TYPOGRAPHY_FOR_CONTAINER_ADVANCED: 'typographyContainerAdvanced',
	TRANSFORM: 'transform',
	TRANSITION: 'transition',
	MISC: 'misc',
};

const StylesPresetsEnum = {
	BASIC: [ StylesEnum.BACKGROUND, StylesEnum.BORDER ],
	CONTAINER_BASIC: [
		StylesEnum.BACKGROUND,
		StylesEnum.SPACING,
		StylesEnum.BORDER,
		StylesEnum.TYPOGRAPHY_FOR_CONTAINER,
	],
	CONTAINERS: [
		StylesEnum.BACKGROUND,
		StylesEnum.SEPARATORS,
		StylesEnum.SPACING,
		StylesEnum.BORDER,
		StylesEnum.TYPOGRAPHY_FOR_CONTAINER,
		StylesEnum.TRANSFORM,
	],
	ALL: [
		StylesEnum.BACKGROUND,
		StylesEnum.SPACING,
		StylesEnum.BORDER,
		StylesEnum.TEXT_SHADOW,
		StylesEnum.SEPARATORS,
		StylesEnum.TYPOGRAPHY,
	],
};

export { StylesEnum, StylesPresetsEnum };
