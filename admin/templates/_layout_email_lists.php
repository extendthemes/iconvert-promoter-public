<?php

use function KPromo\kubio_get_site_urls;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>

<div class="ic-promo-wrapper d-flex flex-column ic-email-lists-layout">
	<div class="header d-flex justify-content-between align-items-center">
		<div class="box-logo d-flex">
			<div class="logo align-self-center">
				<div class="d-flex">
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- This is a static SVG logo.
					echo file_get_contents( ICONVERTPR_PATH . '/admin/assets/images/iconvert-promoter-logo.svg' );
					?>
				</div>
			</div>
		</div>
		<div class="box-cta">
			<a class="ic-promo-button ic-promo-button-primary js-disable-middle-click" data-pro="required" href="#"><?php esc_html_e( 'Create new list', 'iconvert-promoter' ); ?></a>
		</div>
	</div>
	<div class="body">
		<div id="promo-email-lists">
			<div class="d-flex h-100 no-gutters ic-email-lists-layout">
				<div class="ic-my-left-sidebar">
					<div class="ic-left-sidebar">
						<div class="ic-ls-content">
							<h3><?php esc_html_e( 'My Email lists', 'iconvert-promoter' ); ?></h3>
							<div class="ic-ls-lists">
								<div class="ic-ls-lists-content">
									<?php if ( $emailLists ) : ?>
										<ul>
											<?php foreach ( $emailLists as $emailList ) : ?>
												<li>
													<a href="<?php echo esc_url( iconvertpr_generate_page_url( 'subscribers.lists.emails', array( 'post_id' => $emailList->id ), ICONVERTPR_PAGE_SUBSCRIBERS ) ); ?>" class="js-disable-middle-click ic-promo-button w-100 text-left <?php echo ( $listID == $emailList->id ) ? ' ic-promo-button-primary active' : 'ic-promo-button-secondary '; ?>"><?php echo esc_html( wp_unslash( $emailList->name ) ); ?> <span>(<?php echo esc_html( $emailList->subscribers ); ?>)</span></a>
												</li>
											<?php endforeach; ?>
										</ul>
									<?php else : ?>
										<?php esc_html_e( 'No email lists found!', 'iconvert-promoter' ); ?>
									<?php endif; ?>
								</div>
							</div>
						</div>
						<!-- /.ic-ls-content -->
					</div>
					<!-- /.ic-left-sidebar -->
				</div>

				<div class="ic-layout-content">
					<?php if ( $list ) : ?>
						<input type="hidden" name="listID" id="ic-listid" value="<?php echo esc_attr( $list->id ); ?>">
						<div class="ic-header">
							<div class="row ic-header-content">
								<div class="col col-12 col-xl-6 ic-title <?php echo ! empty( $list->description ) ? 'ic-has-description' : ''; ?>">
									<h4><span><?php echo esc_html( wp_unslash( $list->name ) ); ?></span> 
									<a href="#" class="ic-edit-list js-disable-middle-click ic-promo-button-sm ic-promo-button ic-promo-button-secondary" data-id="<?php echo esc_attr( $list->id ); ?>"><?php esc_html_e( 'Edit configuration', 'iconvert-promoter' ); ?></a></h4>
									<div class="ic-description"><?php echo esc_html( wp_unslash( $list->description ) ); ?></div>
								</div>
								<?php
									$list_dld_url = add_query_arg(
										array(
											'_wpnonce' => wp_create_nonce( 'iconvertpr_download_email_list' ),
											'action'   => 'iconvertpr_download_email_list',
											'post_id'  => $list->id,
										),
										admin_url( 'admin-post.php' )
									);
								?>
								<div class="col col-12 col-xl-6 ic-actions">
									<a class="ic-promo-button ic-promo-button-link ic-promo-button-sm" href="<?php echo esc_url( $list_dld_url ); ?>" class="js-disable-middle-click">
										<?php esc_html_e( 'Download list', 'iconvert-promoter' ); ?></a>
									<a href="#" data-placement="left" data-pro='required' class="ic-promo-button ic-promo-button-primary ic-promo-button-sm"><?php esc_html_e( 'Sync list', 'iconvert-promoter' ); ?></a>
									<?php if ( $list->listtype != 1 ) : ?>
										<a href="#" class="ic-delete-list ic-promo-button ic-promo-button-outline-danger ic-promo-button-sm" data-id="<?php echo esc_attr( $list->id ); ?>"><?php esc_html_e( 'Delete list', 'iconvert-promoter' ); ?></a>
									<?php endif; ?>
								</div>
							</div>
						</div>
					<?php endif; ?>

					<div class="ic-content wrapper-content-edit">
						<div class="scrollable-content">
							<?php if ( $list ) : ?>
								<?php if ( isset( $content ) ) : ?>
									<?php
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									echo $content;
									?>
								<?php endif; ?>
							<?php else : ?>
								<div class="container-records pt-4 list-records">
									<div class="no-popups d-flex justify-content-center"><?php esc_html_e( 'Please select an email list from the left.', 'iconvert-promoter' ); ?></div>
								</div>
							<?php endif; ?>
						</div>
					</div>
				</div>
			</div>


		</div>
	</div>
</div>
<?php wp_nonce_field( 'iconvertpr_list_management' ); ?>
<template id="ic-lists-create">
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $createFormTemplate;
	?>
</template>

<template id="ic-subscriber-edit">
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $createFormTemplate;
	?>
</template>

<template id="icp-promo-available-in-pro-template">
	<div class="icp-promo-available-in-pro-template">
		<span data-text="<?php esc_attr_e( 'This option is available only in the PRO version.', 'iconvert-promoter' ); ?>"></span>
		<a class="ic-promo-button ic-promo-button-primary" href="<?php echo esc_url( kubio_get_site_urls()['upgrade_url'] ); ?>" target="_blank"><?php esc_html_e( 'Upgrade to PRO', 'iconvert-promoter' ); ?></a>
	</div>
</template>

<div class="hidden" id="ic-flash-messages">
	<?php iconvert_flash_messages_show(); ?>
</div>