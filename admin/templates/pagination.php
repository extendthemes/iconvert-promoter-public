<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<?php if ( $links ) : ?>
	<div class="icpm-pagination-wrapper d-flex justify-content-end">
		<div class="pagination-links d-flex justify-content-center align-items-center align-contents-center">
			<?php
			// the pagination links contains computed HTML, so we don't need to escape it here
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $links;
			?>
		</div>
	</div>
<?php endif; ?>
