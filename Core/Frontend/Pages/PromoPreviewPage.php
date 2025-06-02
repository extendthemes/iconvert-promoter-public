<?php

namespace CSPromo\Core\Frontend\Pages;

use CSPromo\Core\Admin\Pages\Promos;
use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Traits\HasTemplate;
use CSPromo\Core\Frontend\PopupGenerate\PopupsListGenerator;
use CSPromo\Core\Services\TemplatesService;
use stdClass;

class PromoPreviewPage {

	use HasTemplate;

	private $separator = '#';

	public function __construct() {
		add_action( 'wp_loaded', array( $this, 'preview' ) );
		add_filter( 'single_template', array( $this, 'page_template' ) );
	}

	//Load template for specific page
	public function page_template( $page_template ) {
		global $post;

		if ( isset( $post->post_type ) && $post->post_type === 'cs-promo-popups' ) {
			$popup = PromoPopups::get( $post->ID );

			$this->maybe_preview_autosave( $post );

			wp_dequeue_style( 'admin-bar' );

			if ( $popup['popup_type'] === 'inline-promotion-bar' ) {
				return IC_PROMO_PATH . '/frontend/templates/preview-inline-promotion-bar.php';
			} else {
				return IC_PROMO_PATH . '/frontend/templates/preview-real.php';
			}
		}

		return $page_template;
	}

	private function maybe_preview_autosave( $post ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['iconvert-promoter-preview'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$preview_id  = sanitize_text_field( $_GET['iconvert-promoter-preview'] );
			$autoSavedID = PopupsListGenerator::getInstance()->getAutosaveID( $preview_id, $post->ID );
			if ( $autoSavedID > 0 ) {
				$new_post = get_post( $autoSavedID );
				global $wp_query, $more;
				$wp_query->posts[0] = $new_post;
				$more               = 1;
				setup_postdata( $new_post );

			}
		}
	}

	public function preview() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['__iconvert-promoter-preview-remote-template'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$image = isset( $_GET['image'] ) ? sanitize_url( urldecode( $_GET['image'] ) ) : '';
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$promoType = isset( $_GET['promoType'] ) ? sanitize_text_field( $_GET['promoType'] ) : 'simple-popup';
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$aligns = isset( $_GET['position'] ) ? sanitize_text_field( urldecode( $_GET['position'] ) ) : 'center#center';
			$inline = false;

			$template_id = isset( $_GET['template_id'] ) ? sanitize_text_field( $_GET['template_id'] ) : 0;

			if ( strpos( $aligns, $this->separator ) === false ) {
				$verticalAlign   = $aligns;
				$horizontalAlign = 'center';
			} else {
				list($verticalAlign, $horizontalAlign) = explode( $this->separator, $aligns );
			}

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$contentPosition = isset( $_GET['contentPosition'] ) && $verticalAlign === 'start' ? urldecode( $_GET['contentPosition'] ) : 'over-content';

			if ( $promoType === 'inline-promotion-bar' ) {
				$inline = true;
			}

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$animation_in = isset( $_GET['animationIn'] ) ? sanitize_text_field( $_GET['animationIn'] ) : '';
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$animation_out = isset( $_GET['animationOut'] ) ? sanitize_text_field( $_GET['animationOut'] ) : '';

			$args = array(
				'template_id'       => $template_id,

				'promoType'         => $promoType,
				'image'             => $image,
				'verticalAlign'     => $verticalAlign,
				'horizontalAlign'   => $horizontalAlign,
				'contentPosition'   => $contentPosition,

				'animationIn'       => $animation_in,
				'animationOut'      => $animation_out,

				'animationInClass'  => Promos::normalize_animation_class( $animation_in )['effect'],
				'animationOutClass' => Promos::normalize_animation_class( $animation_out )['effect'],
					// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				'animationDuration' => isset($_GET['animationDuration'] ) ? floatval( $_GET['animationDuration'] ) : 1,
			);

			$output = $this->wrapper( $args );

			$skeleton = self::template(
				'css-skeleton',
				array(
					'content' => $output,
					'inline'  => $inline,
				),
				false,
				'frontend'
			);

			self::template(
				'preview',
				array(
					'content'  => $output,
					'skeleton' => $skeleton,
					'inline'   => $inline,
				),
				true,
				'frontend'
			);
			die();
		}
	}

	public function wrapper( $args ) {
		$idPromo = 0;

		$promoType       = $args['promoType'];
		$image           = $args['image'];
		$verticalAlign   = $args['verticalAlign'];
		$horizontalAlign = $args['horizontalAlign'];
		$contentPosition = $args['contentPosition'];
		$animation_in    = $args['animationInClass'];
		$animation_out   = $args['animationOutClass'];

		$template_content = null;

		$align = $args['verticalAlign'] . $this->separator . $args['horizontalAlign'];

		if ( $promoType === 'floating-bar' ) {
			$align = $args['verticalAlign'];
		}

		$templateService = new TemplatesService(
			array(
				'promoType'         => $promoType,
				'position'          => $align,
				'contentPosition'   => $args['contentPosition'],
				'animationIn'       => $args['animationIn'],
				'animationOut'      => $args['animationOut'],
				'animationDuration' => $args['animationDuration'],
			)
		);

		$template = $templateService->getTemplate( $args['template_id'] );

		if ( $template ) {
			call_user_func( CSPromoBuilder . '\\FrontendAssets::loadKubioAssets' );
			$template_content = $templateService->importContent( $template->content, 'preview-' . $args['template_id'] );

			$script = sprintf(
				'<script type="text/javascript">window.promoTriggersSettings = %s;</script>',
				wp_json_encode(
					array(
						'params' => new stdClass(),
						'popups' => array(
							$idPromo => array(
								'preview' => array(),
							),
						),
					)
				)
			);

			$content = apply_filters( 'the_content', $template_content );

			return "$script $content";
		}

		ob_start(); ?>
		<div id="cs-popup-container-<?php echo esc_attr( $idPromo ); ?>" class="cs-popup-container-type-<?php echo esc_attr( $promoType ); ?> cs-popup-container-preview cs-fb-position-<?php echo esc_attr( $contentPosition ); ?> cs-v-pos-<?php echo esc_attr( $verticalAlign ); ?> cs-popup-container" data-cs-promoid="<?php echo esc_attr( $idPromo ); ?>">
			<div class="lcs-popup-content">
				<style>
					.cs-popup-image {
						display: block;
						opacity: 0;
					}

					.cs-popup-image.animate__animated {
						opacity: 1;
					}
				</style>
				<script>
					window.addAnimationClasses = function() {
						var img = document.querySelector('.cs-popup-image');
						const animation =  img.getAttribute('data-animation-in');
						if(animation){
							img.classList.add('animate__animated', img.getAttribute('data-animation-in'));
						}
					}
				</script>
				<div class="wp-block wp-block-cspromo-promopopup  position-relative wp-block-cspromo-promopopup__outer cs-popup align-items-<?php echo esc_attr( $verticalAlign ); ?> justify-content-<?php echo esc_attr( $horizontalAlign ); ?>">
				
			
				<?php //phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>	
				<img 
					class="cs-popup-image" 
					src="<?php echo esc_url( urldecode( $image ) ); ?>" 
					onload="addAnimationClasses()" 
					data-animation-in="<?php echo esc_attr( $animation_in ); ?>"
					data-animation-out="<?php echo esc_attr( $animation_out ); ?>"
					data-cs-promoid="<?php echo esc_attr( $idPromo ); ?>" />
				</div>
			</div>
		</div>
		<?php
		$str = ob_get_clean();

		return $str;
	}
}
