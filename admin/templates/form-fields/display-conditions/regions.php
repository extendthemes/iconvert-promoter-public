<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?><div class="cs-form-options">
	<h4><?php echo esc_html( $label ); ?></h4>
	
	<?php foreach ( $regions as $key => $value ) : ?>
		<div class="cs-switch-wrapper">
			<label class="cs-switch">
				<input type="checkbox" class="cs-regions-default" value="<?php echo esc_attr( $key ); ?>" id="cs-checkbox-<?php echo esc_attr( $key ); ?>" 
					<?php echo in_array( $key, $savedValues, true ) ? 'checked' : ''; ?> name="regions[]">
				<span class="cs-active-slider"></span>
			</label>

			<label class="cs-switch-label" for="cs-checkbox-<?php echo esc_attr( $key ); ?>"><span><?php echo esc_html( $value ); ?></label>
		</div>
	<?php endforeach; ?>

	<div class="cs-list-regions-wrapper">
		<select class="cs-list-regions"></select>
		<div class="cs-list-regions-selected">
			<?php foreach ( $savedValues as $region_id ) : ?>
				<?php if ( $region_id != 'cs-all-regions' ) : ?>
					<div class="cs-selected-region">
						<a href="#" class="button button-delete">
							<?php echo esc_html( 'Remove', 'iconvert-promoter' ); ?>
						</a>
						<input type="checkbox" checked id="cs-selected-region-<?php echo esc_attr( $region_id ); ?>" value="<?php echo esc_attr( $region_id ); ?>" name="regions[]" />
						<span><?php echo esc_html( $region_id ); ?></span>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</div>
