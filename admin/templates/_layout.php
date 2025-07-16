<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="ic-promo-wrapper d-flex flex-column">
	<div class="header d-flex justify-content-between align-items-center">
		<div class="box-logo d-flex">
			<div class="logo align-self-center">
				<div class="d-flex">
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- This is a static SVG logo.
					echo file_get_contents( ICONVERTPR_PATH . '/admin/assets/images/iconvert-promoter-logo.svg' );
					?>
				</div>
			</div>
		</div>
		<div class="box-cta">
			<?php if ( iconvertpr_is_current_page( 'promos.list' ) ) : ?>
				<a class="ic-promo-button ic-promo-button-primary button-create-campaign" href="<?php echo esc_url( iconvertpr_generate_page_url( 'promo.create' ) ); ?>"><?php esc_html_e( 'New Campaign', 'iconvert-promoter' ); ?></a>
			<?php endif; ?>

			<?php if ( iconvertpr_is_current_page( 'promo.create' ) ) : ?>
				<button class="ic-promo-button ic-promo-button-primary button-create-campaign" data-loading="<?php esc_attr_e( 'Saving...', 'iconvert-promoter' ); ?>" data-save="<?php esc_attr_e( 'Create Campaign', 'iconvert-promoter' ); ?>" name="promo-create"><?php esc_html_e( 'Create Campaign', 'iconvert-promoter' ); ?></button>
				<?php wp_nonce_field( 'iconvertpr_create_popup' ); ?>
			<?php endif; ?>

			<?php if ( iconvertpr_is_current_page( 'promo.edit' ) ) : ?>
				<div class="submit-button">
					<input type="hidden" name="post_id" value="<?php echo esc_attr( $post->ID ); ?>">
					<button type="button" name="update-popup" class="ic-promo-button ic-promo-button-primary button-create-campaign button-edit-promo-settings" data-loading="<?php esc_attr_e( 'Saving...', 'iconvert-promoter' ); ?>" data-save="<?php esc_attr_e( 'Save', 'iconvert-promoter' ); ?>" disabled><?php esc_html_e( 'Save', 'iconvert-promoter' ); ?></button>
					<button 
						type="button" 
						name="save-and-activate-popup" 
						class="ml-2 ic-promo-button ic-promo-button-success button-create-campaign button-edit-promo-settings"
						data-loading="<?php esc_attr_e( 'Saving & activating...', 'iconvert-promoter' ); ?>" 
						data-save="<?php esc_attr_e( 'Save & Activate', 'iconvert-promoter' ); ?>" <?php echo $post->active ? 'hidden' : ''; ?>
						data-save-activate-redirect="<?php echo esc_url( iconvertpr_generate_page_url( 'promos.list' ) ); ?>"
						>
							<?php esc_html_e( 'Save & Activate', 'iconvert-promoter' ); ?>
						</button>
					<?php wp_nonce_field( 'iconvertpr_update-popup' ); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
	<div class="body
	<?php
	if ( iconvertpr_is_current_page( 'promos.list' ) && isset( $popups ) && ! $popups ) :
		?>
		icp-no-records<?php endif; ?>">
		<?php if ( isset( $content ) ) : ?>
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $content;
			?>
		<?php endif; ?>
	</div>
</div>