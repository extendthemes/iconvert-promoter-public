<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="cs-form-options">
	<h4><?php echo esc_html( $label ); ?></h4>
	
	<?php foreach ( $countries as $key => $value ) : ?>
		<div class="cs-switch-wrapper">
			<label class="cs-switch">
				<input type="checkbox" class="cs-countries-default" value="<?php echo esc_attr( $key ); ?>" id="cs-checkbox-<?php echo esc_attr( $key ); ?>" 
					<?php echo in_array( $key, $savedValues ) ? 'checked' : ''; ?> name="countries[]">
				<span class="cs-active-slider"></span>
			</label>

			<label class="cs-switch-label" for="cs-checkbox-<?php echo esc_attr( $key ); ?>"><span><?php echo esc_html( $value ); ?></label>
		</div>
	<?php endforeach; ?>

	<div class="cs-list-countries-wrapper">
		<select class="cs-list-countries"></select>
		<div class="cs-list-countries-selected">
			<?php foreach ( $savedValues as $country_id ) : ?>
				<?php if ( $country_id != 'cs-all-countries' ) : ?>
					<div class="cs-selected-country">
						<a href="#" class="button button-delete"><?php esc_html_e( 'remove', 'iconvert-promoter' ); ?></a>
						<input type="checkbox" checked id="cs-selected-country-<?php echo esc_attr( $country_id ); ?>" value="<?php echo esc_attr( $country_id ); ?>" name="countries[]" />
						<span><?php echo esc_html( $countries_list->$country_id ); ?></span>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</div>
