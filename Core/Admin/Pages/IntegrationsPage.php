<?php

namespace CSPromo\Core\Admin\Pages;

use CSPromo\Core\Traits\HasTemplate;


class IntegrationsPage {

	use HasTemplate;

	const MAILCHIMP        = 'mailchimp';
	const CAMPAIGN_MONITOR = 'campaign_monitor';
	const SEND_IN_BLUE     = 'brevo';
	const MAIL_JET         = 'mailjet';

	const MAILER_LITE  = 'mailerlite';
	const GET_RESPONSE = 'get_response';
	const MOO_SEND     = 'moosend';

	const CONFIG_OPTION_KEY = 'cs_promoter_providers_config';

	public static function get_providers_descriptors() {
		return array(
			self::MAILCHIMP        => array(
				'title'  => 'MailChimp',
				'icon'   => ICONVERTPR_URL . '/admin/assets/integrations/mailchimp.png',
				'fields' => array(
					'api_key' => array(
						'type'        => 'text',
						'label'       => 'API Key',
						'placeholder' => 'Enter your MailChimp API Key',
						'description' => 'You can find your API key in your MailChimp account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
					'server'  => array(
						'type'        => 'text',
						'label'       => 'Server Prefix',
						'placeholder' => 'Enter your MailChimp server prefix',
						'description' => 'This is optional. The server prefix is the part of your API key that comes before the dash. For example, if your API key is "1234567890-us1", the server prefix is "us1".',
						'sanitize'    => 'sanitize_text_field',
						'required'    => false,
					),
				),
			),

			self::CAMPAIGN_MONITOR => array(
				'title'  => 'Campaign Monitor',
				'icon'   => ICONVERTPR_URL . '/admin/assets/integrations/campaign-monitor.png',
				'fields' => array(
					'api_key'   => array(
						'type'        => 'text',
						'label'       => 'API Key',
						'placeholder' => 'Enter your Campaign Monitor API Key',
						'description' => 'You can find your API key in your Campaign Monitor account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
					'client_id' => array(
						'type'        => 'text',
						'label'       => 'Client ID',
						'placeholder' => 'Enter your Campaign Monitor Client ID',
						'description' => 'You can find your Client ID in your Campaign Monitor account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
				),
			),

			self::SEND_IN_BLUE     => array(
				'title'  => 'Brevo (SendinBlue)',
				'icon'   => ICONVERTPR_URL . '/admin/assets/integrations/brevo.png',
				'fields' => array(
					'api_key' => array(
						'type'        => 'text',
						'label'       => 'API Key',
						'placeholder' => 'Enter your Brevo API Key',
						'description' => 'You can find your API key in your Brevo account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
				),
			),

			self::MAIL_JET         => array(
				'title'  => 'MailJet',
				'icon'   => ICONVERTPR_URL . '/admin/assets/integrations/mailjet.png',
				'fields' => array(
					'api_key'   => array(
						'type'        => 'text',
						'label'       => 'Secret Key',
						'placeholder' => 'Enter your MailJet Secret Key',
						'description' => 'You can find your Secret key in your MailJet account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
					'client_id' => array(
						'type'        => 'text',
						'label'       => 'API Key',
						'placeholder' => 'Enter your MailJet API Key',
						'description' => 'You can find your API Key in your MailJet account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
				),
			),

			self::MAILER_LITE      => array(
				'title'  => 'MailerLite',
				'icon'   => ICONVERTPR_URL . '/admin/assets/integrations/mailer-lite.png',
				'fields' => array(
					'api_key' => array(
						'type'        => 'text',
						'label'       => 'API Key',
						'placeholder' => 'Enter your MailerLite API Key',
						'description' => 'You can find your API key in your MailerLite account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
				),
			),

			self::MOO_SEND         => array(
				'title'  => 'MooSend',
				'icon'   => ICONVERTPR_URL . '/admin/assets/integrations/moosend.png',
				'fields' => array(
					'api_key' => array(
						'type'        => 'text',
						'label'       => 'API Key',
						'placeholder' => 'Enter your MooSend API Key',
						'description' => 'You can find your API key in your MooSend account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
				),
			),

			self::GET_RESPONSE     => array(
				'title'  => 'GetResponse',
				'icon'   => ICONVERTPR_URL . '/admin/assets/integrations/get-response.png',
				'fields' => array(
					'api_key' => array(
						'type'        => 'text',
						'label'       => 'API Key',
						'placeholder' => 'Enter your GetResponse API Key',
						'description' => 'You can find your API key in your GetResponse account settings',
						'sanitize'    => 'sanitize_text_field',
						'required'    => true,
					),
				),
			),
		);
	}


	public function __construct() {
		self::$_layout = '_layout_integrations_page';
	}


	public function index() {

		self::templateWithLayout(
			'blank',
			array(
				'mail_provider_fields' => self::get_providers_descriptors(),
			)
		);
	}
}
