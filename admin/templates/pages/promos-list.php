<?php

/**
 * @var string|null $searchTerm
 * @var array|null $popups
 * @var array|null $sortByParams
 */


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="promo-page-list-search-campaign">
	<form action="<?php echo esc_url( iconvertpr_generate_page_url( 'promos.list', array(), ICONVERTPR_PAGE_ID ) ); ?>">
		<input type="hidden" name="page" value="<?php echo esc_attr( ICONVERTPR_PAGE_ID ); ?>" />
		<input type="hidden" name="route" value="promos.list" />
		<label>
			<input type="text" name="search-campaign" value="<?php echo esc_attr( $searchTerm ); ?>" id="cs-search-campaign" placeholder="<?php esc_attr_e( 'Search campaign…', 'iconvert-promoter' ); ?>">
			<button type="submit" class="dashicons dashicons-search"></button>
		</label>
	</form>
</div>
<div class="list-wrapper-scrollable">
	<div class="promo-page-list-wrapper <?php echo ( $popups ? 'has-popups-list-wrapper' : 'no-popups-list-wrapper' ); ?>">
	
		<div class="promo-page-list <?php echo ( $popups ? 'has-popups-list' : 'no-popups-list' ); ?>">
			<?php
			/**
			 * @var array|null $popups
			 * @var string $pagination
			 */
			if ( ! $popups ) :
				?>
				<div class="no-popups no-popups-created d-flex justify-content-center">
					<div class="no-popups-img">
						<?php // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>
						<img src="<?php echo esc_url( ICONVERTPR_URL ); ?>/admin/assets/images/no-campaigns.png" >
						<?php esc_html_e( 'No campaigns found.', 'iconvert-promoter' ); ?>
					</div>
				</div>
			<?php else : ?>
				<div class="table-header">
					<div class="row align-items-stretch no-gutters">
						<div class="col-4" data-col-group="name">
							<div class="d-flex h-100 justify-content-start align-items-center">
								<?php esc_html_e( 'Campaign name', 'iconvert-promoter' ); ?>
							</div>
						</div>
						<div class="col-4" data-col-group="details">
							<div class="row align-items-stretch h-100 no-gutters">
								<div class="col text-center" data-col-type="status">
									<div class="d-flex h-100 justify-content-center align-items-center">
										<?php esc_html_e( 'Status', 'iconvert-promoter' ); ?>
										<div class="sort">
											<a class="sort-action" data-placement="top" title="<?php esc_attr_e( 'Sort by status', 'iconvert-promoter' ); ?>" href="<?php echo esc_url( iconvertpr_generate_page_url( 'promos.list', $sortByParams['active'] ) ); ?>">
												<i class="dashicons-before dashicons-arrow-up <?php echo ( isset( $sortBy ) && $sortBy === 'active' && isset( $sortOrder ) && $sortOrder === 'ascending' ? ' active' : '' ); ?>"></i>
												<i class="dashicons-before dashicons-arrow-down <?php echo isset( $sortBy ) && $sortBy === 'active' && isset( $sortOrder ) && $sortOrder === 'descending' ? ' active' : ''; ?>"></i>
											</a>
										</div>
									</div>
								</div>
								<div class="col text-center" data-col-type="view">
									<div class="d-flex h-100 justify-content-center align-items-center">
										<?php esc_html_e( 'Views', 'iconvert-promoter' ); ?>
										<div class="sort">
											<a class="sort-action" data-placement="top" title="<?php esc_attr_e( 'Sort by views', 'iconvert-promoter' ); ?>" href="<?php echo esc_url( iconvertpr_generate_page_url( 'promos.list', $sortByParams['view'] ) ); ?>">
												<i class="dashicons-before dashicons-arrow-up <?php echo ( isset( $sortBy ) && $sortBy === 'view' && isset( $sortOrder ) && $sortOrder === 'ascending' ? ' active' : '' ); ?>"></i>
												<i class="dashicons-before dashicons-arrow-down <?php echo isset( $sortBy ) && $sortBy === 'view' && isset( $sortOrder ) && $sortOrder === 'descending' ? ' active' : ''; ?>"></i>
											</a>
										</div>
									</div>
								</div>
								<div class="col text-center" data-col-type="click">
									<div class="d-flex h-100 justify-content-center align-items-center">
										<?php esc_html_e( 'Clicks', 'iconvert-promoter' ); ?>
										<div class="sort">
											<a class="sort-action" data-placement="top" title="<?php esc_attr_e( 'Sort by clicks', 'iconvert-promoter' ); ?>" href="<?php echo esc_attr( iconvertpr_generate_page_url( 'promos.list', $sortByParams['click'] ) ); ?>">
												<i class="dashicons-before dashicons-arrow-up <?php echo ( isset( $sortBy ) && $sortBy === 'click' && isset( $sortOrder ) && $sortOrder === 'ascending' ? ' active' : '' ); ?>"></i>
												<i class="dashicons-before dashicons-arrow-down <?php echo isset( $sortBy ) && $sortBy === 'click' && isset( $sortOrder ) && $sortOrder === 'descending' ? ' active' : ''; ?>"></i>
											</a>
										</div>
									</div>
								</div>
								<div class="col-3 px-2 text-center" data-col-type="subscribe">
									<div class="d-flex h-100 justify-content-center align-items-center">
										<?php esc_html_e( 'Subscribers', 'iconvert-promoter' ); ?>
										<div class="sort">
											<a class="sort-action" data-placement="top" title="<?php esc_attr_e( 'Sort by subscribers', 'iconvert-promoter' ); ?>" href="<?php echo esc_url( iconvertpr_generate_page_url( 'promos.list', $sortByParams['subscribe'] ) ); ?>">
												<i class="dashicons-before dashicons-arrow-up <?php echo ( isset( $sortBy ) && $sortBy === 'subscribe' && isset( $sortOrder ) && $sortOrder === 'ascending' ? ' active' : '' ); ?>"></i>
												<i class="dashicons-before dashicons-arrow-down <?php echo isset( $sortBy ) && $sortBy === 'subscribe' && isset( $sortOrder ) && $sortOrder === 'descending' ? ' active' : ''; ?>"></i>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-4" data-col-group="actions">
							<div class="row align-items-stretch h-100 no-gutters">
								<div class="col-4 col-lg-3 px-2 separator-left-xs-none separator-left text-center" data-col-type="settings">
									<div class="d-flex h-100 justify-content-center align-items-center">
										<?php esc_html_e( 'Settings', 'iconvert-promoter' ); ?>
									</div>
								</div>
								<div class="col-4 col-lg-3 px-2 separator-left justify-content-center d-none d-lg-flex" data-col-type="customize">
									<div class="d-flex h-100 justify-content-center align-items-center">
										<?php esc_html_e( 'Customize', 'iconvert-promoter' ); ?>
									</div>
								</div>
								<div class="col-4 col-lg-3 px-2 separator-left text-center" data-col-type="preview">
									<div class="d-flex h-100 justify-content-center align-items-center">
										<?php esc_html_e( 'Preview', 'iconvert-promoter' ); ?>
									</div>
								</div>
								<div class="col-4 col-lg-3 px-2 separator-left text-center" data-col-type="more">
									<div class="d-flex h-100 justify-content-center align-items-center">
										<?php esc_html_e( 'More actions', 'iconvert-promoter' ); ?>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="table-body">
					<?php foreach ( $popups as $id => $post ) : ?>
						<div class="table-row">
							<div class="row align-items-stretch no-gutters">
								<div class="col-4" data-col-group="name">
									<div class="d-flex h-100 justify-content-start  align-items-center promo-title">
										<?php echo esc_html( $post['title'] ); ?>
									</div>
								</div>
								<div class="col-4" data-col-group="details">
									<div class="row align-items-stretch h-100 no-gutters">
										<div class="col-3 col-xl-3 separator-right text-center" data-col-type="status">
											<div class="d-flex h-100 justify-content-center align-items-center">
												<label class="cs-switch cs-toggle-status cs-list-popup-switch" data-no-content=<?php esc_attr_e( 'Popup without content.', 'iconvert-promoter' ); ?>">
													<input type="checkbox" <?php echo $post['active'] ? 'checked' : ''; ?> data-id="<?php echo esc_attr( $post['id'] ); ?>" data-nonce="<?php echo esc_attr( wp_create_nonce( 'iconvertpr_status_popup_' . $post['id'] ) ); ?>">
													<span class="cs-active-slider"></span>
												</label>
											</div>
										</div>
										<div class="col-3 col-xl-3 separator-right text-center" data-col-type="view">
											<div class="d-flex h-100 justify-content-center align-items-center">
												<?php
												if ( $post['stats']['first_view'] ) :
																	printf(
																		// translators: %1$s - total views, %2$s - unique views
																		esc_html__( '%1$s (%2$s unique)', 'iconvert-promoter' ),
																		intval( $post['stats']['view'] ),
																		intval( $post['stats']['first_view'] )
																	);
												else :
													echo esc_html( $post['stats']['view'] );
												endif;
												?>
											</div>
										</div>
										<div class="col-3 col-xl-3 separator-right text-center" data-col-type="click">
											<div class="d-flex h-100 justify-content-center align-items-center">
												<?php echo esc_html( $post['stats']['click'] ); ?>
											</div>
										</div>
										<div class="col-3 col-xl-3 text-center" data-col-type="subscribe">
											<div class="d-flex h-100 justify-content-center align-items-center">
												<?php echo esc_html( $post['stats']['subscribe'] ); ?>
											</div>
										</div>
									</div>
								</div>
								<div class="col-4 wrapper-actions" data-col-group="actions">
									<div class="row no-gutters h-100 align-content-center">
										<div class="col-4 col-lg-3 h-100 d-flex justify-content-center action" data-col-type="settings">
											<a class="settings" data-placement="top" title="<?php esc_attr_e( 'Settings', 'iconvert-promoter' ); ?>" href="<?php echo esc_html( iconvertpr_generate_page_url( 'promo.edit', array( 'post_id' => $post['id'] ) ) ); ?>">
												<i class="dashicons-before dashicons-admin-generic"></i>
											</a>
										</div>
										<div class="col-4 col-lg-3 h-100 justify-content-center action d-none d-lg-flex" data-col-type="customize">
											<a class="edit" data-placement="top" title="<?php esc_attr_e( 'Edit', 'iconvert-promoter' ); ?>" href="<?php echo esc_url( $post['urls']['editor'] ); ?>">
												<i class="dashicons-before dashicons-edit"></i>
											</a>
										</div>
										<div class="col-4 col-lg-3 h-100 d-flex justify-content-center action" data-col-type="preview">
											<a class="popup-preview modal-preview-popup js-disable-middle-click" data-placement="top" title="<?php esc_attr_e( 'View', 'iconvert-promoter' ); ?>" href="#" data-href="<?php echo esc_url( $post['urls']['previewUrl'] ); ?>">
												<i class="dashicons-before dashicons-visibility js-disable-middle-click"></i>
											</a>
										</div>
										<div class="col-4 col-lg-3 h-100 d-flex justify-content-center action" data-col-type="more">
											<div class="dropdown">
												<a class="js-disable-middle-click" href="#" role="button" id="iconvertpr-more-actions" data-bs-toggle="dropdown" data-bs-reference="parent" aria-haspopup="true" aria-expanded="false">
													<i class="dashicons-before dashicons-ellipsis js-disable-middle-click"></i>
												</a>
												<div class="dropdown-menu dropdown-menu-right" aria-labelledby="iconvertpr-more-actions">
													<a class="dropdown-item js-disable-middle-click" data-placement="top" data-type="delete" title="<?php esc_attr_e( 'Delete', 'iconvert-promoter' ); ?>" data-scope="confirm-dialog" href="#" data-post-id="<?php echo esc_attr( $post['id'] ); ?>" data-wpnonce="<?php echo esc_attr( wp_create_nonce( 'iconvertpr_delete_campaign' ) ); ?>" data-confirm-message="<p><?php esc_html_e( 'Are you sure you want to delete this campaign?', 'iconvert-promoter' ); ?></p>">
														<i class="dashicons-before dashicons-trash js-disable-middle-click"></i> <?php esc_html_e( 'Delete', 'iconvert-promoter' ); ?>
													</a>
													<a class="dropdown-item js-disable-middle-click" data-placement="top" data-type="duplicate" data-promo-type="<?php echo esc_attr( $post['popup_type'] ); ?>" title="<?php esc_attr_e( 'Duplicate', 'iconvert-promoter' ); ?>" data-scope="confirm-dialog" href="#" data-post-id="<?php echo esc_attr( $post['id'] ); ?>" data-wpnonce="<?php echo esc_attr( wp_create_nonce( 'iconvertpr_duplicate_campaign' ) ); ?>" data-confirm-message="<?php echo esc_html( self::template( 'pages/campaigns/duplicate', array(), false ) ); ?>">
														<i class="dashicons-before dashicons-admin-page js-disable-middle-click"></i><?php esc_html_e( 'Duplicate', 'iconvert-promoter' ); ?>
													</a>
													<a class="dropdown-item js-disable-middle-click" data-placement="top" data-type="reset-stats" title="<?php esc_attr_e( 'Reset stats', 'iconvert-promoter' ); ?>" data-scope="confirm-dialog" href="#" data-post-id="<?php echo esc_attr( $post['id'] ); ?>" data-wpnonce="<?php echo esc_attr( wp_create_nonce( 'iconvertpr_reset_stats_campaign' ) ); ?>" data-confirm-message="<p><?php esc_html_e( 'Are you sure you want to reset statistics for this campaign?', 'iconvert-promoter' ); ?></p>">
														<i class="dashicons-before dashicons-update js-disable-middle-click"></i><?php esc_html_e( 'Reset stats', 'iconvert-promoter' ); ?>
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
			<div>
				<?php
				// the pagination contains computed HTML, so we don't need to escape it here
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo $pagination;
				?>
			</div>
		</div>
		<div class="modal fade" id="modal_promo_preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="promo-title"></h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body"></div>
				</div>
			</div>
		</div>
	</div>
</div>
