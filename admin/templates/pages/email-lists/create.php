<?php


use function KPromo\kubio_get_site_urls;
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
						<span><?php esc_html_e( 'Title', 'iconvert-promoter' ); ?></span>
					</label>
					<input type="text" class="form-control" name="name" size="30" value="" spellcheck="true" autocomplete="off" placeholder="<?php esc_html_e( 'Add a title', 'iconvert-promoter' ); ?>" required>
				</div>

				<div class="icp-field form-group">
					<label class="input-group">
						<span><?php esc_html_e( 'Description', 'iconvert-promoter' ); ?></span>
					</label>
					<textarea name="description" class="form-control field" value="" spellcheck="true" autocomplete="off" placeholder="<?php esc_html_e( 'Add a description', 'iconvert-promoter' ); ?>"></textarea>
				</div>
				
				<div class="bg-light border form-group icp-field p-2 text-center">
					<p class="mb-1"><?php echo esc_html( 'In the PRO version, you can automatically sync the list with various services.' ); ?></p>
					<a target="_blank" href="<?php echo esc_url( kubio_get_site_urls()['upgrade_url'] ); ?>"><?php esc_html_e( 'Upgrade to PRO', 'iconvert-promoter' ); ?></a>
				</div>
				<?php if ( iconvertpr_is_email_builder_active() ) : ?>
					<div class="form-group form-group">
						<label class="input-group">
							<span><?php esc_html_e( 'Choose template', 'iconvert-promoter' ); ?></span>
						</label>
						<select class="form-control" name="templateID" required>
							<option value="0"><?php esc_html_e( "Don't send any email", 'iconvert-promoter' ); ?>
								<?php foreach ( iceb_get_templates() as $template ) : ?>
									<option value="<?php echo esc_attr( $template->ID ); ?>"><?php echo esc_html( $template->post_title ); ?></option>
								<?php endforeach; ?>
						</select>
					</div>

					<div class="form-group form-group iwpa-subject">
						<label class="input-group">
							<span><?php esc_html_e( 'Email subject', 'iconvert-promoter' ); ?></span>
						</label>
						<input type="text" class="form-control" name="subject" size="30" value="<?php esc_attr_e( 'Welcome to our newsletter', 'iconvert-promoter' ); ?>" spellcheck="true" autocomplete="off" placeholder="<?php esc_attr_e( 'Add a subject', 'iconvert-promoter' ); ?>">
					</div>
				<?php endif; ?>
			</div>
		</form>
	</div>
</div>
