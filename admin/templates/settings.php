<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="ic-promo-card">
	<div class="ic-promo-content">
		<?php if ( $selectedPopup ) : ?>
			<div class="cs-selected-header">
				<h3><?php echo esc_html( $selectedPopup['title'] ); ?></h3>
				<span class="cs-selected-header-actions">

					<label class="cs-switch cs-toggle-status">
						<input type="checkbox" <?php echo $selectedPopup['active'] ? 'checked' : ''; ?> data-id="<?php echo esc_attr( $selectedPopup['id'] ); ?>" data-nonce="<?php echo esc_attr( wp_create_nonce( 'iconvertpr_status_popup_' . $selectedPopup['id'] ) ); ?>">
						<span class="cs-active-slider"><em>Active</em></span>
					</label>

					<a href="<?php echo esc_url( $selectedPopup['urls']['edit'] ); ?>" class="button button-secondary"><?php esc_html_e( 'Edit content', 'iconvert-promoter' ); ?></a>

					<a href="<?php echo esc_url( $selectedPopup['urls']['delete'] ); ?>" class="button button-delete"><?php esc_html_e( 'Delete', 'iconvert-promoter' ); ?></a>
				</span>

			</div>
		<?php endif; ?>

		<div class="ic-promo-tabs-wrapper">
			<div class="ic-tabs">
				<ul>
					<?php foreach ( $tabs as $key => $tab ) : ?>
						<li>
							<button class="tablinks 
							<?php
							if ( $key == 0 ) :
								?>
								active<?php endif; ?>" data-country="ic-tab-<?php echo esc_attr( $key ); ?>">
								<p data-title="<?php echo esc_attr(); ?>"><?php echo esc_html( $tab['name'] ); ?></p>
							</button>

						</li>
					<?php endforeach; ?>
				</ul>
			</div>

			<div class="ic-tab-content-wrapper">
				<?php foreach ( $tabs as $key => $tab ) : ?>
					<div id="ic-tab-<?php echo esc_attr( $key ); ?>" class="ic-tab-content <?php echo $key === 0 ? 'active' : ''; ?>">
						<div class="ic-tab-content-inner">
							<?php
							// Render the content of the tab.
							// The render method is expected to return the tab computed HTML content.
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							echo ! empty( $tab['content'] ) ? $tab['content']->render() : '';
							?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</div>
<!-- /.iconvert-card -->