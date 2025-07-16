<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="container-fluid page records-list-page">
	<div class="section-title"><?php esc_html_e( 'Templates', 'iconvert-promoter' ); ?></div>
	<div class="section-description"><?php esc_html_e( 'Choose from the template you want to start with', 'iconvert-promoter' ); ?></div>

	<div class="d-flex flex-column paper rounded p-4 mt-3">
		<div class="container-records">
			<?php if ( ! $records ) : ?>
				<div class="no-records"><?php esc_html_e( 'No templates found.', 'iconvert-promoter' ); ?></div>
			<?php else : ?>
				<div class="row">
					<?php foreach ( $records as $record ) : ?>
						<div class="col-lg-3 col-md-2">
							<div class="card">
								<?php if ( $record->image ) : ?>
									<?php //phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>
									<img class="card-img-top" src="<?php echo esc_url( $record->image ); ?>" alt="<?php echo esc_attr( $record->name ); ?>">
									<?php else : ?>
									<?php //phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>
									<img class="card-img-top" src="<?php echo esc_url( ICONVERTPR_URL . 'admin/assets/images/popup-templates/no-image.png' ); ?>" alt="<?php echo esc_attr( $record->name ); ?>">
								<?php endif; ?>

								<div class="card-body">
									<h5 class="card-title"><?php echo esc_html( $record->name ); ?></h5>
									<a href="#" class="btn btn-primary promo-select-template" data-template="<?php echo esc_attr( $record->id ); ?>" data-popup="<?php echo esc_attr( $popup['id'] ); ?>"><?php esc_html_e( 'Use this template', 'iconvert-promoter' ); ?></a>
								</div>
							</div>
						</div>
					<?php endforeach; ?>

					<?php wp_nonce_field( 'iconvertpr_promo_set_template' ); ?>
					<input type="hidden" name="editorUrl" id="promoEditorUrl" value=" <?php echo esc_attr( $popup['urls']['editorUrl'] ); ?>">
				</div>
			<?php endif; ?>
		</div>
		<?php
		// the pagination contains computed HTML, so we don't need to escape it here
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $pagination;
		?>
	</div>
</div>
