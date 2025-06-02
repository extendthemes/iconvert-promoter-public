import { __, sprintf } from '@wordpress/i18n';
import { SITE_MOOD_VALUES } from './site-mood';

const colorDefinitions = [
	{
		label: __( 'Kubio Default', 'kubio' ),
		mood: SITE_MOOD_VALUES.NEUTRAL,
		colors: [
			{ slug: 'kubio-color-1', color: [ 3, 169, 244 ] },
			{ slug: 'kubio-color-2', color: [ 247, 144, 7 ] },
			{ slug: 'kubio-color-3', color: [ 0, 191, 135 ] },
			{ slug: 'kubio-color-4', color: [ 102, 50, 255 ] },
			{ slug: 'kubio-color-5', color: [ 255, 255, 255 ] },
			{ slug: 'kubio-color-6', color: [ 0, 0, 0 ] },
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Neutral %s', 'kubio' ), 1 ),
		mood: SITE_MOOD_VALUES.NEUTRAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 0, 145, 234 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 255, 94, 91 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 29, 233, 182 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 219, 180, 255 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 23, 23, 24 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Neutral %s', 'kubio' ), 2 ),
		mood: SITE_MOOD_VALUES.NEUTRAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 17, 90, 78 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 250, 105, 47 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 255, 148, 106 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 192, 192, 192 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 30, 30, 30 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Neutral %s', 'kubio' ), 3 ),
		mood: SITE_MOOD_VALUES.NEUTRAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 48, 62, 122 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 247, 229, 151 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 246, 97, 97 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 158, 201, 226 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 246, 248, 250 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 32, 42, 84 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Neutral %s', 'kubio' ), 4 ),
		mood: SITE_MOOD_VALUES.NEUTRAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 61, 52, 139 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 118, 120, 237 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 247, 184, 1 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 241, 135, 1 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 244, 245, 249 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 11, 19, 43 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Neutral %s', 'kubio' ), 5 ),
		mood: SITE_MOOD_VALUES.NEUTRAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 41, 191, 18 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 8, 189, 189 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 242, 27, 63 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 255, 153, 20 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 23, 23, 24 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Neutral %s', 'kubio' ), 6 ),
		mood: SITE_MOOD_VALUES.NEUTRAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 0, 118, 255 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 255, 189, 31 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 84, 89, 95 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 13, 69, 153 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 23, 23, 24 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Neutral %s', 'kubio' ), 7 ),
		mood: SITE_MOOD_VALUES.NEUTRAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 28, 119, 195 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 255, 94, 91 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 237, 125, 58 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 12, 206, 107 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 246, 248, 250 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 65, 67, 71 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Professional %s', 'kubio' ), 1 ),
		mood: SITE_MOOD_VALUES.PROFESSIONAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 187, 190, 100 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 125, 132, 145 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 192, 197, 193 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 234, 240, 206 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 68, 56, 80 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Professional %s', 'kubio' ), 2 ),
		mood: SITE_MOOD_VALUES.PROFESSIONAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 154, 194, 197 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 194, 198, 167 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 219, 207, 150 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 236, 206, 142 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 11, 11, 11 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Professional %s', 'kubio' ), 3 ),
		mood: SITE_MOOD_VALUES.PROFESSIONAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 141, 153, 174 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 217, 4, 41 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 239, 35, 60 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 105, 118, 139 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 245, 246, 247 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 43, 45, 66 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Professional %s', 'kubio' ), 4 ),
		mood: SITE_MOOD_VALUES.PROFESSIONAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 2, 102, 127 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 0, 144, 183 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 180, 180, 180 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 230, 230, 230 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 246, 248, 250 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 58, 58, 58 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Professional %s', 'kubio' ), 5 ),
		mood: SITE_MOOD_VALUES.PROFESSIONAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 148, 159, 176 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 105, 118, 139 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 60, 72, 91 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 190, 197, 211 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 246, 248, 250 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 35, 45, 54 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Professional %s', 'kubio' ), 6 ),
		mood: SITE_MOOD_VALUES.PROFESSIONAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 242, 149, 89 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 242, 212, 146 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 184, 176, 141 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 40, 56, 69 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 32, 44, 57 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Professional %s', 'kubio' ), 7 ),
		mood: SITE_MOOD_VALUES.PROFESSIONAL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 203, 153, 126 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 221, 190, 169 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 183, 183, 164 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 165, 165, 141 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 249, 244 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 72, 69, 65 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Playful %s', 'kubio' ), 1 ),
		mood: SITE_MOOD_VALUES.PLAYFUL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 0, 64, 186 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 235, 185, 66 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 9, 195, 215 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 255, 0, 178 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 32, 34, 38 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Playful %s', 'kubio' ), 2 ),
		mood: SITE_MOOD_VALUES.PLAYFUL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 253, 62, 129 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 215, 36, 131 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 121, 35, 89 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 65, 41, 44 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 47, 45, 46 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Playful %s', 'kubio' ), 3 ),
		mood: SITE_MOOD_VALUES.PLAYFUL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 251, 133, 0 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 255, 183, 3 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 33, 158, 188 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 142, 202, 230 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 2, 48, 71 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Playful %s', 'kubio' ), 4 ),
		mood: SITE_MOOD_VALUES.PLAYFUL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 114, 9, 183 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 247, 37, 133 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 76, 201, 240 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 67, 97, 238 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 58, 12, 163 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Playful %s', 'kubio' ), 5 ),
		mood: SITE_MOOD_VALUES.PLAYFUL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 244, 172, 212 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 200, 130, 142 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 216, 226, 220 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 255, 229, 217 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 255, 255 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 157, 129, 137 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Playful %s', 'kubio' ), 6 ),
		mood: SITE_MOOD_VALUES.PLAYFUL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 0, 196, 154 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 21, 96, 100 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 251, 143, 103 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 255, 194, 180 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 255, 251, 227 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 11, 43, 33 ],
			},
		],
	},
	{
		// translators: %s is color palette number
		label: sprintf( __( 'Playful %s', 'kubio' ), 7 ),
		mood: SITE_MOOD_VALUES.PLAYFUL,
		colors: [
			{
				slug: 'kubio-color-1',
				color: [ 0, 206, 203 ],
			},
			{
				slug: 'kubio-color-2',
				color: [ 255, 94, 91 ],
			},
			{
				slug: 'kubio-color-3',
				color: [ 216, 216, 216 ],
			},
			{
				slug: 'kubio-color-4',
				color: [ 219, 180, 255 ],
			},
			{
				slug: 'kubio-color-5',
				color: [ 245, 245, 238 ],
			},
			{
				slug: 'kubio-color-6',
				color: [ 70, 70, 78 ],
			},
		],
	},
];

const colorPalettes = colorDefinitions.map( ( palette, index ) => ( {
	...palette,
	slug: `palette-${ palette.mood }-${ index }`,
} ) );

export { colorPalettes };
