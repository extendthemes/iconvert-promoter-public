import { ShapesValues } from './shapes';

const overlayShapes = [
	{
		label: 'None',
		value: ShapesValues.NONE,
		isTile: false,
	},
	{
		label: 'Circles',
		value: ShapesValues.CIRCLES,
		isTile: false,
	},
	{
		label: '10deg Stripes',
		value: ShapesValues.DEGREE_STRIPES,
		isTile: false,
	},
	{
		label: 'Rounded Square Blue',
		value: ShapesValues.ROUNDED_SQUARE_BLUE,
		isTile: false,
	},
	{
		label: 'Many Rounded Squares Blue',
		value: ShapesValues.MANY_ROUNDED_SQUARE_BLUE,
		isTile: false,
	},
	{
		label: 'Two Circles',
		value: ShapesValues.TWO_CIRCLES,
		isTile: false,
	},
	{
		label: 'Circles 2',
		value: ShapesValues.CIRCLES_TWO,
		isTile: false,
	},
	{
		label: 'Circles 3',
		value: ShapesValues.CIRCLES_THREE,
		isTile: false,
	},
	{
		label: 'Circles Gradient',
		value: ShapesValues.CIRCLES_GRADIENT,
		isTile: false,
	},
	{
		label: 'Circles White Gradient',
		value: ShapesValues.CIRCLES_WHITE_GRADIENT,
		isTile: false,
	},
	{
		label: 'Waves',
		value: ShapesValues.WAVES,
		isTile: false,
	},
	{
		label: 'Waves Inverted',
		value: ShapesValues.WAVES_INVERTED,
		isTile: false,
	},
	{
		label: 'Dots',
		value: ShapesValues.DOTS,
		isTile: true,
	},
	{
		label: 'Left Tilted Lines',
		value: ShapesValues.LEFT_TILTED_LINES,
		isTile: true,
	},
	{
		label: 'Right Tilted Lines',
		value: ShapesValues.RIGHT_TILTED_LINES,
		isTile: true,
	},
	{
		label: 'Right Tilted Strips',
		value: ShapesValues.RIGHT_TILTED_STRIPES,
		isTile: false,
	},
];

const properties = {
	overlayTypes: [
		{ label: 'Color', value: 'color' },
		{ label: 'Gradient', value: 'gradient' },
		{ label: 'Shape Only', value: 'shapeOnly' },
	],
	shapes: {
		values: ShapesValues,
		items: overlayShapes,
	},
};
