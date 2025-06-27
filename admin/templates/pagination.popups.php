<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="icpm-pagination-wrapper d-flex justify-content-end">
	<div class="pagination-links d-flex justify-content-center align-items-center align-contents-center">
		<div class="pagination-inner">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $links;
			?>
		</div>
	</div>
</div>
