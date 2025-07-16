import { RichText } from '@wordpress/block-editor';

export const v1 = {
	attributes: {
		kubio: {
			type: 'object',
		},
		popup_id: {
			type: 'number',
		},
		showNotices: {
			type: 'boolean',
			default: true,
		},
		successNotice: {
			type: 'object',
			default: {
				label: 'Submitted successfully',
			},
		},
		infoNotice: {
			type: 'object',
			default: {
				label: 'This email is already registered!',
			},
		},
		errorNotice: {
			type: 'object',
			default: {
				label: 'Error! Form was not processed.',
			},
		},
		formUniqueId: {
			type: 'string',
		},
		formId: {
			type: 'number',
			default: 1,
		},
		formFields: {
			type: 'string',
			default: 'name-email',
		},
		formLayout: {
			type: 'string',
			default: 'vertical',
		},
		stackOnMobile: {
			type: 'boolean',
			default: true,
		},
		formConsent: {
			type: 'boolean',
			default: true,
		},
		nameLabelDisplay: {
			type: 'boolean',
			default: true,
		},
		nameLabel: {
			type: 'string',
			default: 'Name',
		},
		nameFieldPlaceholder: {
			type: 'string',
			default: 'Name',
		},
		emailLabelDisplay: {
			type: 'boolean',
			default: true,
		},
		emailLabel: {
			type: 'string',
			default: 'Email',
		},
		emailFieldPlaceholder: {
			type: 'string',
			default: 'Email',
		},
		termsIcon: {
			type: 'string',
			default: 'font-awesome/check',
		},
		termsLabelDisplay: {
			type: 'boolean',
			default: true,
		},
		termsLabel: {
			type: 'string',
			default: 'I agree to terms & conditions',
		},
		termsFieldChecked: {
			type: 'boolean',
			default: false,
		},
		termsDescription: {
			type: 'string',
			source: 'html',
			default:
				"By ticking this box you consent our <a href='#'>Privacy Policy</a> and <a href='#'>Terms and conditions</a>.",
		},
		submitText: {
			type: 'string',
			default: 'Subscribe',
		},
		submitIconEnabled: {
			type: 'boolean',
			default: true,
		},
		submitIcon: {
			type: 'string',
			default: 'font-awesome/envelope',
		},
		submitIconPosition: {
			type: 'string',
			default: 'before',
		},
		submitIconSpace: {
			type: 'object',
			default: {
				unit: 'px',
				value: 10,
			},
		},
		onSuccessAction: {
			type: 'string',
			default: 'showNotice',
		},
		onSuccessPopup: {
			type: 'string',
			default: '0',
		},
		link: {
			type: 'object',
			default: {
				typeOpenLink: 'sameWindow',
			},
		},
	},
	migrate: ( attributes, innerBlocks, extras = {} ) => {
		const { blockNode } = extras;
		return {
			...attributes,
			migrations: [ ...( attributes.migrations || [] ), 'v1' ],
			termsDescription: blockNode
				? blockNode.innerHTML
				: attributes.termsDescription,
		};
	},
	isEligible: ( attributes ) => {
		const { migrations = [] } = attributes;

		if ( ! migrations.includes( 'v1' ) ) {
			return true;
		}
	},
	save: ( { attributes } ) => (
		<RichText.Content value={ attributes.termsDescription } />
	),
};
