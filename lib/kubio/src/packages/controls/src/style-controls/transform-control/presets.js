const PRESETS = [
	{
		translate: [
			{
				axis: 'x',
				value: {
					value: 0,
					unit: 'px',
				},
			},
			{
				axis: 'y',
				value: {
					value: 0,
					unit: 'px',
				},
			}
		],
	},	
	{
		perspective: {
			value: 45,
			unit: 'em',
		},
		rotate: [
			{
				axis: 'x',
				value: {
					value: 18,
					unit: 'deg',
				},
			},
			{
				axis: 'y',
			},
			{
				axis: 'z',
			},
		],
	},
	{
		perspective: {
			value: 1500,
			unit: 'px',
		},
		rotate: [
			{
				axis: 'x',
			},
			{
				axis: 'y',
				value: {
					value: 15,
					unit: 'deg',
				},
			},
			{
				axis: 'z',
			},
		],
	},
	{
		perspective: {
			value: 1000,
			unit: 'px',
		},
		rotate: [
			{
				axis: 'x',
				value: {
					value: 4,
					unit: 'deg',
				},
			},
			{
				axis: 'y',
				value: {
					value: -16,
					unit: 'deg',
				},
			},
			{
				axis: 'z',
				value: {
					value: 4,
					unit: 'deg',
				},
			},
		],
	},
	{
		scale: [
			{
				axis: 'x',
				value: {
					value: 0.75,
					unit: '',
				},
			},
			{
				axis: 'y',
				value: {
					value: 0.75,
					unit: '',
				},
			},
			{
				axis: 'z',
				value: {
					value: 0.75,
					unit: '',
				},
			},
		],
		rotate: [
			{
				axis: 'x',
				value: {
					value: 45,
					unit: 'deg',
				},
			},
			{
				axis: 'y',
				value: {
					value: -30,
					unit: 'deg',
				},
			},
			{
				axis: 'z',
			},
		],
		translate: [
			{
				axis: 'x',
			},
			{
				axis: 'y',
			},
			{
				axis: 'z',
				value: {
					//the original value was 4.5rem. But the control does not support rem so I converted to px
					value: 72,
					unit: 'px',
				},
			},
		],
		origin: {
			x: {
				value: 'custom',
				customValue: {
					value: 50,
					unit: '%',
				},
			},
			y: {
				value: 'custom',
				customValue: {
					value: 100,
					unit: '%',
				},
			},
		},
	},
	{
		translate: [
			{
				axis: 'x',
			},
			{
				axis: 'y',
				value: {
					value: 15,
					unit: '%',
				},
			},
			{
				axis: 'z',
			},
		],
	},
	{
		rotate: [
			{
				axis: 'x',
				value: {
					value: 15,
					unit: 'deg',
				},
			},
			{
				axis: 'y',
			},
			{
				axis: 'z',
				value: {
					value: 45,
					unit: 'deg',
				},
			},
		],
	},
	{
		perspective: {
			value: 900,
			unit: 'px',
		},
		rotate: [
			{
				axis: 'x',
				value: {
					value: 60,
					unit: 'deg',
				},
			},
			{
				axis: 'y',
			},
			{
				axis: 'z',
			},
		],
		scale: [
			{
				axis: 'x',
				value: {
					value: 0.7,
					unit: '',
				},
			},
			{
				axis: 'y',
				value: {
					value: 0.7,
					unit: '',
				},
			},
			{
				axis: 'z',
			},
		],
	},
];

export { PRESETS };
