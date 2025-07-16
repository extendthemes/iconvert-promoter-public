<?php

use CSPromo\Core\PostTypes\PromoPopupsSettings;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="icp-form-wrapper d-flex flex-column paper rounded">
	<form id="ic-create-list-form">
		<div class="icp-fields">
			<div class="form-group form-group">
				<label class="input-group">
					<span><?php esc_html_e( 'Campaign Name', 'iconvert-promoter' ); ?></span>
				</label>
				<input type="text" class="form-control" name="duplicate-campaign-name" size="30" value="" spellcheck="true" autocomplete="off" placeholder="<?php esc_html_e( 'Campaign Name', 'iconvert-promoter' ); ?>" required>
			</div>
			<?php if ( defined( 'ICONVERTPR_DUPLICATE_AS' ) && ICONVERTPR_DUPLICATE_AS ) : ?>
				<div class="form-group form-group">
					<label class="input-group">
						<span><?php esc_html_e( 'Duplicate As', 'iconvert-promoter' ); ?></span>
					</label>
					<select name="duplicate-as" class="form-control" required>
						<?php foreach ( PromoPopupsSettings::getTypes() as $key => $value ) : ?>
							<option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $value['name'] ); ?></option>
						<?php endforeach; ?>
					</select>
				</div>
			<?php endif; ?>
		</div>
	</form>
</div>
