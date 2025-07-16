import { __ } from '@wordpress/i18n';
import subscribeDefaultVariation from '../../subscribe/default-variation';
export default {
	name: 'cspromo/yes-no',
	isDefault: true,
	title: __( 'Yes/No', 'iconvert-promoter' ),
	attributes: {
		yesAction: 'content',
		yesLink: { value: '', target: '_self', typeOpenLink: 'sameWindow' },
		yesIcon: { name: null, show: false, position: 'after' },
		yesText: __( 'I want to join', 'iconvert-promoter' ),
		noAction: 'close',
		noLink: { value: '', target: '_self', typeOpenLink: 'sameWindow' },
		noIcon: { name: null, show: false, position: 'after' },
		noText: __( 'Skip', 'iconvert-promoter' ),
	},
	innerBlocks: [
		{
			name: 'cspromo/yes-no-inner',
			attributes: {
				kubio: {
					props: {},
					style: {
						descendants: { container: { textAlign: 'center' } },
					},
				},
				action: 'yes',
			},
			innerBlocks: [
				{
					name: 'cspromo/subscribe',
					attributes: subscribeDefaultVariation.attributes,
				},
			],
		},
		{
			name: 'cspromo/yes-no-inner',
			attributes: {
				kubio: {
					props: {},
					style: {
						descendants: { container: { textAlign: 'center' } },
					},
				},
				action: 'no',
			},
			innerBlocks: [],
		},
	],
};
