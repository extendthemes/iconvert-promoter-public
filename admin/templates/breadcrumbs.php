<?php

use CSPromo\Core\PostTypes\PromoPopups;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


// phpcs:ignore WordPress.Security.NonceVerification.Recommended
if ( ! isset( $_GET['route'] ) || $_GET['route'] == 'list.popups' ) : ?>
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
<?php else : ?>
	<a href="<?php echo esc_url( iconvertpr_generate_page_url( 'list.popups' ) ); ?>" class="text-decoration-none">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	</a>
	<?php if ( isset( $breadcrumbsArgs['level1'] ) ) : ?>
		<h1 class="d-flex"><i class="bi bi-arrow-right align-self-center"></i><?php echo esc_html( $breadcrumbsArgs['level1'] ); ?></h1>
	<?php endif ?>
	<?php
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	if ( isset( $_GET['post_id'] ) ) :
		?>
		<div class="d-flex align-self-center breadcrumb-status-box">
			<?php
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if ( filter_var( PromoPopups::getSetting( 'active', intval( $_GET['post_id'] ) ), FILTER_VALIDATE_BOOLEAN ) ) :
				?>
				<i class="bi bi-circle-fill icon-status-active"></i> <?php esc_html_e( 'Active', 'iconvert-promoter' ); ?>
			<?php else : ?>
				<i class="bi bi-circle-fill icon-status-inactive"></i> <?php esc_html_e( 'Inactive', 'iconvert-promoter' ); ?>
			<?php endif ?>
		</div>
	<?php endif ?>
<?php endif ?>