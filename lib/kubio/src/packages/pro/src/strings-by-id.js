import { __ } from '@wordpress/i18n';
import _ from 'lodash';
const stringsById = {
	pro: {
		link: top.kubioUtilsData.homepage_url,
		pricing_link: top.kubioUtilsData.upgrade_url,
		typography: __( 'Available only in the PRO version', 'kubio' ),
		upgrade: {
			label: __( 'Upgrade to PRO', 'kubio' ),
		},
		try: {
			label: __( 'Try PRO Online', 'kubio' ),
			msg: __( 'Get unlimited options with iConvert Promoter PRO', 'kubio' ),
			link: top.kubioUtilsData.theme_try_online,
		},
		subscribe: {
			label: __( 'PRO version coming soon', 'kubio' ),
			msg: __(
				'The PRO version of Kubio will be available soon. Please enter your email below and we’ll announce you when it’s ready.',
				'kubio'
			),
		},
		popup: {
			option: __(
				'This option is available only in the PRO version.',
				'kubio'
			),
			innerpage: __(
				'Adding predefined blocks to inner pages is available only in the PRO version.',
				'kubio'
			),
			colorscheme: __(
				'Customizing color scheme colors is available only in the PRO version.',
				'kubio'
			),
			component: __(
				'This component is available only in the PRO version.',
				'kubio'
			),
			gradient: __(
				'Customizing gradient settings is available only in the PRO version.',
				'kubio'
			),
			buttonsLimit: __(
				'Adding more than 2 items is available only in the PRO version.',
				'kubio'
			),
		},
		infobox: {
			text: __(
				'Text customization options (font, color, etc) are only available in the PRO version.',
				'kubio'
			),
			default: __(
				'More customization options available in the PRO version.',
				'kubio'
			),
			icon: __(
				'More color options are available in the PRO version.',
				'kubio'
			),
			button: __(
				'More customization options available in the PRO version.',
				'kubio'
			),
			menu: __(
				'More menu design options are available in the PRO version.',
				'kubio'
			),
		},
		advanced: __(
			'Advanced options are only available in the PRO version.',
			'kubio'
		),
		footer: {
			msg: __(
				'Footer text and customization options are available in the PRO version',
				'kubio'
			),
		},
	},
};

const DISABLE_TRY_ONLY = window.kubioUtilsData?.enable_try_online !== true;

const getStringValueWithId = ( id ) => {
	return _.get( stringsById, id, '' );
};

export { stringsById, getStringValueWithId, DISABLE_TRY_ONLY };
