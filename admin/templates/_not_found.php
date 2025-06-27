<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<h3 class="iwpa-page-header"><?php echo esc_html( get_admin_page_title() ); ?></h3>

<div class="iwpa-not-found">
	<h1><?php esc_html_e( '404 - Not found', 'iconvert-promoter' ); ?></h1>
	<?php if ( isset( $message ) && $message != null ) : ?>
		<h3>
		<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $message;
		?>
			</h3>
	<?php else : ?>
		<h3><?php esc_html_e( 'The route was not found.', 'iconvert-promoter' ); ?></h3>
	<?php endif; ?>
</div>
