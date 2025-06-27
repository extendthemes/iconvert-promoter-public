<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?><div class="icpm-wrapper pt-3 ps-3">
	<div class="container-fluid">
		<header class="icpm-header d-flex flex-row justify-content-between align-items-center">
			<div class="icpm-plugin-title col-lg-8 d-flex flex-row align-items-center">
				<div class="icpm-breadcrumb p-2 d-flex flex-row align-items-center">
					<h1><?php esc_html_e( 'Choose a template', 'iconvert-promoter' ); ?></h1>
				</div>
			</div>			
		</header>
	</div>
	<div class="icpm-inner container-fluid">
		<div class="icpm-content d-flex">
			<?php if ( isset( $content ) ) : ?>
				<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo $content;
				?>
			<?php endif; ?>
		</div>
	</div>
</div>
