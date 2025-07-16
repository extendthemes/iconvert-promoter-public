<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?><div class="cs-form-options">
	<h4><?php echo esc_html( $label ); ?></h4>

	<?php foreach ( $roles as $key => $value ) : ?>
		<div class="cs-switch-wrapper">
			<label class="cs-switch">
				<input type="checkbox" value="<?php echo esc_attr( $key ); ?>" id="cs-checkbox-<?php echo esc_attr( $key ); ?>" 
					<?php echo in_array( $key, $savedValues, true ) ? 'checked' : ''; ?> name="cs-roles[]">
				<span class="cs-active-slider"></span>
			</label>

			<label class="cs-switch-label" for="cs-checkbox-<?php echo esc_attr( $key ); ?>"><span><?php echo esc_html( $value ); ?></label>
		</div>
	<?php endforeach; ?>
</div>
