<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?><div class="cs-form-options">
	<h4><?php echo esc_html( $label ); ?></h4>
	
	<?php foreach ( $pages as $key => $value ) : ?>
		<div class="cs-switch-wrapper">
			<label class="cs-switch">
				<input type="checkbox" class="cs-pages-default" value="<?php echo esc_attr( $key ); ?>" id="cs-checkbox-<?php echo esc_attr( $key ); ?>" 
					<?php echo in_array( $key, $savedValues, true ) ? 'checked' : ''; ?> name="pages[]">
				<span class="cs-active-slider"></span>
			</label>

			<label class="cs-switch-label" for="cs-checkbox-<?php echo esc_attr( $key ); ?>"><span><?php echo esc_html( $value ); ?></span></label>
		</div>
	<?php endforeach; ?>

	<div class="cs-list-pages-wrapper">
		<select class="cs-list-pages"></select>
		<div class="cs-list-pages-selected">
			<?php foreach ( $savedValues as $page_id ) : ?>
				<?php if ( is_numeric( $page_id ) ) : ?>
					<div class="cs-selected-page">
						<a href="#" class="button button-delete"><?php esc_html_e( 'remove', 'iconvert-promoter' ); ?></a>
						<input type="checkbox" checked id="cs-selected-page-<?php echo esc_attr( $page_id ); ?>" value="<?php echo esc_attr( $page_id ); ?>" name="pages[]" />
						<span><?php echo esc_html( \get_the_title( $page_id ) ); ?></span>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</div>
