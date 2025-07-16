<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?><div class="cs-form-options">
	<h4><?php echo esc_html( $label ); ?></h4>

	<div class="cs-form-row">
		<label>
			<span><?php echo esc_html( $options['start-time'] ); ?></span>
			<input type="datetime-local" name="start-time" value="<?php echo esc_attr( $savedValues['start-time'] ); ?>" />
		</label>
	</div>

	<div class="cs-form-row">
		<label>
			<span><?php echo esc_html( $options['end-time'] ); ?></span>
			<input type="datetime-local" name="end-time" value="<?php echo esc_attr( $savedValues['end-time'] ); ?>" />
		</label>
	</div>

	<div class="cs-form-row cs-label-in">
		<label>
			<span><?php echo esc_html( $options['recurring'] ); ?></span>
			<input type="number" name="recurring" class="cs-append-number" value="<?php echo esc_attr( $savedValues['recurring'] ); ?>" /><em><?php esc_html_e( 'days', 'iconvert-promoter' ); ?></em>
		</label>
	</div>
</div>
