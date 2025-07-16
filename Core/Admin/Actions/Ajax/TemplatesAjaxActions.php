<?php

namespace CSPromo\Core\Admin\Actions\Ajax;

use CSPromo\Core\Admin\PopupService;
use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Services\TemplatesService;
use CSPromo\Core\Traits\HasAction;

class TemplatesAjaxActions {
	use HasAction;

	public function __construct() {
		add_action( 'wp_ajax_iconvertpr_promo_set_template', array( $this, 'setTemplate' ) );
		add_action( 'wp_ajax_iconvertpr_promo_get_template_by_type', array( $this, 'getTemplateByType' ) );
	}

	/**
	 * Set the default html template content
	 *
	 * @return void
	 */
	public function setTemplate() {
		if ( $this->checkNonce( 'iconvertpr_promo_set_template', false, '_wpnonce_set_template' ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$popupID = isset( $_POST['popup'] ) ? intval( $_POST['popup'] ) : 0;
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$template        = isset( $_POST['template'] ) ? intval( $_POST['template'] ) : 0;
			$templateService = new TemplatesService();
			$template        = $templateService->getTemplate( $template );
			$popupService    = new PopupService();

			if ( $template ) {
				$content = $templateService->parseContent( $template->content );
				$status  = $popupService->setTemplate( $content, $popupID );

				if ( $status ) {
					PromoPopups::saveSetting( $popupID, '_has_promo_content', 'yes' );

					wp_send_json_success(
						array(
							'body' => __( 'Template was set', 'iconvert-promoter' ),
						),
						200
					);
				} else {
					wp_send_json_error(
						array(
							'body' => $template,
						),
						200
					);
				}
			} else {
				wp_send_json_error(
					array(
						'body' => __( 'Template not found', 'iconvert-promoter' ),
					),
					404
				);
			}

			wp_die();
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	public function getTemplateByType() {
		if ( $this->checkNonce( 'iconvertpr_promo_get_template_by_type', false, '_wpnonce_get_template' ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$promoType       = isset( $_POST['promo_type'] ) ? sanitize_text_field( wp_unslash( $_POST['promo_type'] ) ) : '';
			$templateService = new TemplatesService();
			$records         = $templateService->getRecords( $promoType, 100 );

			if ( $records['total'] === 0 ) {
				// if no template is found don't send an error
				wp_send_json_success( array(), 200 );

				wp_die();
			}

			// a category is an array of items with this structure: {slug, label}. we will sort the categories by label
			$categories = $records['categories'];

			// sort the categories by label. categories with slug 'special-offer', 'newsletter-subscribe' and 'coupon' will be the first ones;
			$top_categories  = array(
				'newsletter-subscribe',
				'lead-magnet',
				'coupon',
				'special-offer',
				'countdown',
				'reduce-abandonment',
				'announcement',
				'age-consent',
				'feedback',
				'refer-a-friend',
				'audio-video',
			);
			$next_categories = array();

			foreach ( $top_categories as $top_category ) {
				foreach ( $categories as $key => $category ) {
					if ( $category['slug'] === $top_category ) {
						$next_categories[] = $category;
						unset( $categories[ $key ] );
					}
				}
			}

			usort(
				$categories,
				function ( $a, $b ) {
					return strnatcmp( $a['label'], $b['label'] );
				}
			);
			$next_categories = array_merge( $next_categories, $categories );

			$free_templates  = array();
			$pro_templates   = array();
			$blank_templates = array();

			foreach ( $records['records'] as $key => $template ) {

				if ( intval( $template['is_blank'] ) === 1 ) {
					$blank_templates[] = $template;
					continue;
				}

				if ( intval( $template['is_pro'] ) === 1 ) {
					$pro_templates[] = $template;
				} else {
					$free_templates[] = $template;
				}
			}

			wp_send_json_success(
				array(
					'templates'  => array_merge( $free_templates, $pro_templates, $blank_templates ),
					'categories' => $next_categories,
				),
				200
			);
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}
}
