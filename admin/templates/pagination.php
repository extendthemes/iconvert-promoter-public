<?php if ( $links != '' ) : ?>
	<div class="icpm-pagination-wrapper d-flex justify-content-end">
		<div class="pagination-links d-flex justify-content-center align-items-center align-contents-center">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $links;
			?>
		</div>
	</div>
<?php endif; ?>
