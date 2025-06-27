<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<div class="container-fluid pt-4 px-4 promo-page-list">

	<div class="container-records list-records">
		<?php if ( $records || $isSearchResultsPage ) : ?>
			<div class="cs-email-lists-search-subscribers">
				<form action="<?php echo esc_url( iconvertpr_generate_page_url( 'subscribers.lists.emails', array( 'post_id' => $listID ), ICONVERTPR_PAGE_SUBSCRIBERS ) ); ?>">
					<input type="hidden" name="page" value="<?php echo esc_attr( ICONVERTPR_PAGE_SUBSCRIBERS ); ?>" />
					<input type="hidden" name="route" value="subscribers.lists.emails" />
					<input type="hidden" name="post_id" value="<?php echo esc_attr( $listID ); ?>" />
					<label>
						<input type="text" name="search-email" value="<?php echo esc_attr( $searchTerm ); ?>" id="cs-search-email" placeholder="<?php esc_attr_e( 'Search email address…', 'iconvert-promoter' ); ?>">
						<button type="submit" class="dashicons dashicons-search"></button>
					</label>
				</form>
			</div>
		<?php endif; ?>

		<?php if ( ! $records ) : ?>
			<div class="no-popups d-flex justify-content-center"><?php esc_html_e( 'No subscribers found.', 'iconvert-promoter' ); ?></div>
		<?php else : ?>
			<div class="row py-4 no-gutters cs-email-lists-subscribers">
				<table class="table-responsive-sm table-responsive-md">
					<thead>
						<th class="cs-el-email"><?php esc_html_e( 'Email', 'iconvert-promoter' ); ?></th>
						<th class="cs-el-name"><?php esc_html_e( 'Name', 'iconvert-promoter' ); ?></th>
						<th class="cs-el-edit"><?php esc_html_e( 'Edit', 'iconvert-promoter' ); ?></th>
						<th class="cs-el-remove"><?php esc_html_e( 'Remove from list', 'iconvert-promoter' ); ?></th>
					</thead>
					<tbody>
						<?php foreach ( $records as $record ) : ?>
							<tr>
								<td><?php echo esc_html( $record->email ); ?></td>
								<td><?php echo esc_html( wp_unslash( $record->name ) ); ?></td>
								<td>
									<a class="cs-el-edit js-disable-middle-click" href="#" data-id="<?php echo esc_attr( $record->id ); ?>" data-bs-toggle="tooltip" data-placement="top" title="<?php esc_attr_e( 'Edit', 'iconvert-promoter' ); ?>">
										<i class="dashicons-before dashicons-edit js-disable-middle-click"></i>
									</a>
								</td>
								<td class="cs-el-remove">
									<a class="cs-el-delete js-disable-middle-click" href="#" data-id="<?php echo esc_attr( $record->id ); ?>" data-bs-toggle="tooltip" data-placement="top" title="<?php esc_attr_e( 'Remove from list', 'iconvert-promoter' ); ?>">
										<i class="dashicons-before dashicons-remove js-disable-middle-click"></i>
									</a>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			</div>
		<?php endif; ?>

	</div>

	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $pagination;
	?>

</div>
