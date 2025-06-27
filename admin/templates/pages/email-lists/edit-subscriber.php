<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="page create-email-lists-page">
	<div class="icp-form-wrapper d-flex flex-column paper rounded">
		<form id="ic-create-list-form" action="#" onsubmit="return false;">
			<div class="icp-fields">
				<div class="form-group form-group">
					<label class="input-group">
						<span><?php esc_html_e( 'Name', 'iconvert-promoter' ); ?></span>
					</label>
					<input type="text" class="form-control" name="name" size="30" value="<?php echo esc_attr( wp_unslash( $subscriber->name ) ); ?>" spellcheck="true" autocomplete="off" placeholder="<?php esc_html_e( 'Name', 'iconvert-promoter' ); ?>">
				</div>

				<div class="icp-field form-group">
					<label class="input-group">
						<span><?php esc_html_e( 'Email', 'iconvert-promoter' ); ?></span>
					</label>
					<input type="email" class="form-control" name="email" size="30" value="<?php echo esc_attr( $subscriber->email ); ?>" spellcheck="true" autocomplete="off" placeholder="<?php esc_html_e( 'Email', 'iconvert-promoter' ); ?>" required>
				</div>
			</div>
		</form>
	</div>
</div>
