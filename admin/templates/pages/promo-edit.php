<?php

/**
 * @var array|null $metadata
 * @var string|null $type
 * @var array|null $displayConditions
 * @var array|null $triggers
 * @var array|null $promoTypes
 * @var array|null $popup
 * @var array|null $templates
 */

use CSPromo\Core\Admin\Pages\Promos;
use CSPromo\Core\Frontend\Actions\ShortcodeGenerator;

use function KPromo\kubio_get_site_urls;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


function iconvertpr_display_feature_requires_pro( $key = 'data-pro', $value = 'required' ) {

	static $feature_available_only_in_pro = null;

	if ( null === $feature_available_only_in_pro ) {
		$feature_available_only_in_pro = apply_filters( 'iconvertpr_feature_available_only_in_pro', true );
	}

	if ( $feature_available_only_in_pro ) {
		echo sprintf(
			' %s="%s"',
			esc_attr( $key ),
			esc_attr( $value )
		);
	}
}


$has_desktop_active = isset( $post ) && isset( $displayConditions['devices'] ) && in_array( 'desktop', $displayConditions['devices'], true );
$has_tablet_active  = isset( $post ) && isset( $displayConditions['devices'] ) && in_array( 'tablet', $displayConditions['devices'], true );
$has_mobile_active  = isset( $post ) && isset( $displayConditions['devices'] ) && in_array( 'mobile', $displayConditions['devices'], true );

$check_sts_direct         = ! isset( $displayConditions['specific-traffic-source'] ) || ( isset( $displayConditions['specific-traffic-source'] ) && $displayConditions['specific-traffic-source'][0] === 'direct' );
$check_sts_google_organic = isset( $displayConditions['specific-traffic-source'] ) && $displayConditions['specific-traffic-source'][0] === 'google_organic';
$check_sts_google_paid    = isset( $displayConditions['specific-traffic-source'] ) && $displayConditions['specific-traffic-source'][0] === 'google_paid';
$check_sts_fb_organic     = isset( $displayConditions['specific-traffic-source'] ) && $displayConditions['specific-traffic-source'][0] === 'facebook_organic';
$check_sts_fb_paied       = isset( $displayConditions['specific-traffic-source'] ) && $displayConditions['specific-traffic-source'][0] === 'facebook_paid';
$check_sts_referal        = isset( $displayConditions['specific-traffic-source'] ) && $displayConditions['specific-traffic-source'][0] === 'referrer';
$open_manually            = isset( $triggers['manually-open'] ) ? $triggers['manually-open'] : false;

$specificTrafficSource = isset( $displayConditions['specific-traffic-source'] ) ? $displayConditions['specific-traffic-source'] : '';
$specificUTMSource     = isset( $displayConditions['specific-utm'] ) ? $displayConditions['specific-utm'] : '';
$popup_type            = isset( $metadata['popup_type'][0] ) ? $metadata['popup_type'][0] : '';

global $iconvertpr_recurring_conditions;
$iconvertpr_recurring_conditions = isset( $displayConditions['recurring'] ) ? $displayConditions['recurring'] : array(
	'converted' => array(
		'when'  => 'never',
		'delay' => 1,
		'unit'  => 'm',
	),
	'closed'    => array(
		'when'  => 'always',
		'delay' => 1,
		'unit'  => 'm',
	),
);

function iconvertpr_print_recurring_when_options( $type ) {
	global $iconvertpr_recurring_conditions;
	$options = array(
		'never'      => esc_html__( 'Never', 'iconvert-promoter' ),
		'always'     => esc_html__( 'All the time', 'iconvert-promoter' ),
		'after'      => esc_html__( 'After some time', 'iconvert-promoter' ),
		'next_visit' => esc_html__( 'On the next website visit', 'iconvert-promoter' ),
	);

	echo '<select name="recurring-when">';

	$selected = isset( $iconvertpr_recurring_conditions[ $type ]['when'] ) ? $iconvertpr_recurring_conditions[ $type ]['when'] : 'never';

	foreach ( $options as $key => $value ) {
		$selected_attr = ( $key === $selected ) ? 'selected="selected"' : '';
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<option value="' . esc_attr( $key ) . '" ' . $selected_attr . '>' . esc_html( $value ) . '</option>';
	}

	echo '</select>';
}


function iconvertpr_print_recurring_after_time_options( $type ) {
	global $iconvertpr_recurring_conditions;
	$value = isset( $iconvertpr_recurring_conditions[ $type ]['delay'] ) ? $iconvertpr_recurring_conditions[ $type ]['delay'] : 1;
	$unit  = isset( $iconvertpr_recurring_conditions[ $type ]['unit'] ) ? $iconvertpr_recurring_conditions[ $type ]['unit'] : 's';

	$input_validation_message = $type === 'converted' ? __( 'Time for display after conversion is required.', 'iconvert-promoter' ) : __( 'Time for display after closing is required.', 'iconvert-promoter' );
	?>
	<div class="input-group group-append validation-wrapper">
		<label class="input-group">
			<input type="number" required data-text-validation="<?php echo esc_attr( $input_validation_message ); ?>" step="1" class="icp-integer-only" name="recurring-delay" id="time-<?php echo esc_attr( $type ); ?>" min="0" value="<?php echo esc_attr( $value ); ?>" />
		</label>
		<span class="input-group-append w-25">
			<select name="recurring-unit">
				<option value="m" <?php echo ( $unit === 'm' ) ? 'selected="selected"' : ''; ?>><?php esc_html_e( 'minutes', 'iconvert-promoter' ); ?></option>
				<option value="h" <?php echo ( $unit === 'h' ) ? 'selected="selected"' : ''; ?>><?php esc_html_e( 'hours', 'iconvert-promoter' ); ?></option>
				<option value="d" <?php echo ( $unit === 'd' ) ? 'selected="selected"' : ''; ?>><?php esc_html_e( 'days', 'iconvert-promoter' ); ?></option>
			</select>
		</span>
	</div>
	<?php
}

function iconvertpr_promo_option_is_true( $val ) {
	if ( isset( $val ) && isset( $val['checkbox'] ) && filter_var( $val['checkbox'], FILTER_VALIDATE_BOOLEAN ) ) {
		return true;
	}

	return false;
}

?>
<form action="#" id="promo-edit-form">
	<input type="hidden" name="promo-type" value="<?php echo esc_attr( $popup_type ); ?>" data-settings="<?php echo esc_attr( wp_json_encode( $popupSettings ) ); ?>" />
	<div class="d-flex flex-column flex-md-row promo-page-edit h-100">
		<div class="d-flex flex-column sidebar-edit">
			<div class="d-flex flex-column section-actions w-100 h-100">
				<div class="flex-grow-1">
					<div class="action-status d-flex flex-row justify-content-between ">
						<div class="label-action"><?php esc_html_e( 'Status', 'iconvert-promoter' ); ?></div>
						<label class="cs-switch cs-toggle-status cs-list-popup-switch d-inline-block" data-no-content="<?php esc_attr_e( 'Popup without content.', 'iconvert-promoter' ); ?>">
							<input type="checkbox" <?php echo $post->active ? 'checked' : ''; ?> data-id="<?php echo esc_attr( $post->ID ); ?>" data-nonce="<?php echo esc_attr( wp_create_nonce( 'iconvertpr_status_popup_' . $post->ID ) ); ?>">
							<span class="cs-active-slider"></span>
						</label>
					</div>
					<div class="action-preview d-flex flex-row justify-content-between">
						<div class="label-action"><?php esc_html_e( 'Preview', 'iconvert-promoter' ); ?></div>
						<a class="popup-preview modal-preview-popup d-inline-block js-disable-middle-click" data-bs-toggle="tooltip" href="#" data-placement="top" data-href="<?php echo esc_url( $popup['urls']['previewUrl'] ); ?>" data-title="<?php echo esc_attr( $post->post_title ); ?>">
							<i class="dashicons-before dashicons-visibility js-disable-middle-click"></i>
						</a>
					</div>
					<div class="action-edit-template align-content-center justify-content-center d-none d-lg-flex">
						<a class="ic-promo-button ic-promo-button-primary" href="<?php echo esc_url( $popup['urls']['editor'] ); ?>"><?php esc_html_e( 'Edit content', 'iconvert-promoter' ); ?></a>
						<a class="modal-change-template-popup ic-promo-button ic-promo-button-link" data-id="<?php echo esc_attr( $post->ID ); ?>" data-promo-type="<?php echo esc_attr( $popup_type ); ?>" href="#" <?php iconvertpr_display_feature_requires_pro( 'data-template-pro-preview', 'true' ); ?>><?php esc_html_e( 'Change template', 'iconvert-promoter' ); ?></a>
					</div>

					<div class="promo-type-options">
						<div class="pto-position-wrapper position-matrix">
							<hr />
							<h3><?php esc_html_e( 'Position', 'iconvert-promoter' ); ?></h3>
							<div class="position-matrix-options">
								<select name="toggle-options-position">
									<?php foreach ( $centeringOptions as $option => $data ) : ?>
										<option value="<?php echo esc_attr( $option ); ?>"
											<?php
											if ( $option === $defaultAlign ) :
												?>
											selected="selected" <?php endif; ?> data-effects-sides="<?php echo esc_attr( wp_json_encode( $data['effects-sides'] ) ); ?>"><?php echo esc_html( $data['label'] ); ?></option>
									<?php endforeach; ?>
								</select>
							</div>
						</div>

						<div class="pto-position-wrapper position-toggle settings-floating-bar">
							<h3><?php esc_html_e( 'Position', 'iconvert-promoter' ); ?></h3>
							<div class="icp-toggle-options">
								<div><input type="radio" value="start" name="toggle-options-position-tb" checked id="tpp-01"><label for="tpp-01"><?php esc_html_e( 'Top', 'iconvert-promoter' ); ?></label></div>
								<div><input type="radio" value="end" name="toggle-options-position-tb" id="tpp-02"><label for="tpp-02"><?php esc_html_e( 'Bottom', 'iconvert-promoter' ); ?></label></div>
							</div>

							<div class="icp-toggle-options icp-toggle-options-content">
								<div><input type="radio" value="over-content" name="toggle-options-content" checked id="tpc-1"><label for="tpc-1"><?php esc_html_e( 'Over content', 'iconvert-promoter' ); ?></label></div>
								<div><input type="radio" value="above-content" name="toggle-options-content" id="tpc-2"><label for="tpc-2"><?php esc_html_e( 'Push content', 'iconvert-promoter' ); ?></label></div>
							</div>
						</div>
						<div class="pto-animation-wrapper">
							<hr />
							<h3><?php esc_html_e( 'Animations', 'iconvert-promoter' ); ?></h3>
							<div class="animations-in-options">
								<h4><?php esc_html_e( 'Entrance animation', 'iconvert-promoter' ); ?></h4>
								<select name="toggle-options-animation-in">
									<?php foreach ( Promos::get_available_effects() as $effect ) : ?>
										<?php if ( isset( $effect['value'] ) ) : ?>
											<option value="<?php echo esc_attr( $effect['value'] ); ?>"><?php echo esc_html( $effect['label'] ); ?></option>
										<?php else : ?>
											<optgroup label="<?php echo esc_attr( $effect['label'] ); ?>">
												<?php foreach ( $effect['in'] as $animation => $effectLabel ) : ?>
													<option value="<?php echo esc_attr( $effect['type'] ); ?>#<?php echo esc_attr( $animation ); ?>"><?php echo esc_html( $effectLabel ); ?></option>
												<?php endforeach; ?>
											</optgroup>
										<?php endif; ?>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="animations-out-options">
								<h4><?php esc_html_e( 'Exit animation', 'iconvert-promoter' ); ?></h4>
								<select name="toggle-options-animation-out">
									<?php foreach ( Promos::get_available_effects() as $effect ) : ?>
										<?php if ( isset( $effect['value'] ) ) : ?>
											<option value="<?php echo esc_attr( $effect['value'] ); ?>"><?php echo esc_html( $effect['label'] ); ?></option>
										<?php else : ?>
											<optgroup label="<?php echo esc_attr( $effect['label'] ); ?>">
												<?php foreach ( $effect['out'] as $animation => $effectLabel ) : ?>
													<option value="<?php echo esc_attr( $effect['type'] ); ?>#<?php echo esc_attr( $animation ); ?>"><?php echo esc_html( $effectLabel ); ?></option>
												<?php endforeach; ?>
											</optgroup>
										<?php endif; ?>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="animations-duration-options">
								<h4><?php esc_html_e( 'Effect duration', 'iconvert-promoter' ); ?></h4>
								<div class="input-group">
									<input type="number" name="options-animation-duration" value="<?php echo esc_attr( $popupSettings['animationDuration'] ); ?>" min="0" step="0.1" class="form-control">
									<div class="input-group-append">
										<span class="input-group-text">
											<?php esc_html_e( 'seconds', 'iconvert-promoter' ); ?>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="action-edit-template align-content-center justify-content-center d-none d-lg-flex">
						<?php wp_nonce_field( 'iconvertpr_promo_get_template_by_type', '_wpnonce_get_template' ); ?>
						<?php wp_nonce_field( 'iconvertpr_change_popup_template', '_wpnonce_iconvertpr_change_popup_template' ); ?>
					</div>


				</div>
				<div>
					<div class="action-delete d-flex align-content-center justify-content-center">
						<a class="delete js-disable-middle-click" data-placement="top" data-type="delete" title="<?php esc_attr_e( 'Delete campaign', 'iconvert-promoter' ); ?>" data-scope="confirm-dialog" href="#" data-post-id="<?php echo esc_attr( $post->ID ); ?>" data-wpnonce="<?php echo esc_attr( wp_create_nonce( 'iconvertpr_delete_campaign' ) ); ?>" data-confirm-message="<p><?php esc_html_e( 'Are you sure you want to delete this campaign?', 'iconvert-promoter' ); ?></p>">
							<?php esc_html_e( 'Delete campaign', 'iconvert-promoter' ); ?>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="content-edit">
			<div class="d-flex flex-column h-100">
				<div class="box-promo-name d-flex flex-row justify-content-start align-content-center">
					<div class="col-12">
						<div class="row d-flex justify-content-between">
							<div class="col-12 col-lg-6 mb-3 mb-lg-0 d-flex flex-row justify-content-start align-content-center">
								<div class="mr-0 section-title promo-name w-100">
									<div class="input-group wrapper-trigger-value promo-name-group">
										<input
											class="editable-promo-name" name="promo-name" value="<?php echo esc_attr( $post->post_title ); ?>"
											placeholder="<?php esc_attr_e( 'Campaign name', 'iconvert-promoter' ); ?>"
											data-text-validation="<?php esc_attr_e( 'Campaign name is required.', 'iconvert-promoter' ); ?>" required />
									</div>
								</div>
							</div>
							<div class="col-12 col-lg-6 d-flex flex-row justify-content-start align-content-center">
								<?php if ( $type === 'inline-promotion-bar' ) : ?>
									<div class="section-shortcode" data-section="shortcode">
										<div class="shortcode">
											<div class="input-group align-items-stretch input-group-append-prepend">
												<div class="input-group-prepend">
													<span class="input-group-text">
														<i class="bi bi-code-slash"></i>
													</span>
												</div>
												<input type="text" class="form-control" readonly name="shortcode" value='[<?php echo esc_attr( ShortcodeGenerator::TYPE_INLINE_BAR ); ?> id="<?php echo esc_attr( $post->ID ); ?>"]' />
												<div class="input-group-append">
													<button class="button button-primary" name="copy-shortcode">
														<i class="d-flex dashicons-before dashicons-admin-page"></i>
													</button>
												</div>
											</div>
										</div>
									</div>
								<?php endif; ?>
							</div>
						</div>
					</div>
				</div>
				<div class="wrapper-content-edit">
					<div class="scrollable-content">
						<?php if ( $type !== 'inline-promotion-bar' ) : ?>
							<div class="col-12 no-gutters accordion section" data-row-order="1">
								<div class="d-flex flex-row justify-content-between px-2 accordion-head" id="accordion-head-site-content" data-bs-toggle="collapse" data-bs-target="#accordion-body-site-content" aria-expanded="true" aria-controls="accordion-body-site-content">
									<div class="group-name">
										<?php esc_html_e( 'Where do you want to show this campaign?', 'iconvert-promoter' ); ?>
										<span class="js-count-active count-active hidden"></span>
									</div>
									<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
								</div>
								<div class="collapse accordion-body show" id="accordion-body-site-content" aria-labelledby="accordion-head-site-content">
									<div class="card-body">
										<div class="container-fluid">
											<div class="row">
												<div class="col-lg-6 col-xl-4 subsection">
													<div class="display-condition condition element" data-row="which pages">
														<div class="d-flex justify-content-between align-content-center row">
															<div class="subsection-title item-label col-lg-12">
																<?php esc_html_e( 'Select where to show the campaign', 'iconvert-promoter' ); ?>
															</div>
															<div class="col-lg-12 selector-pages-type">
																<label class="input-group mb-0">
																	<select class="select2-dropdown js-active-field" name="which-pages-type">
																		<option value="all"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'all' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php esc_html_e( 'Entire website', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="all-no-homepage"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'all-no-homepage' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php esc_html_e( 'Entire website except homepage', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="homepage"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'homepage' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php esc_html_e( 'Only on homepage', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="posts"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'posts' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php esc_html_e( 'All single posts', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="pages"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'pages' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php esc_html_e( 'All pages ( except single posts )', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="products"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'products' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php esc_html_e( 'All single products', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="specific_pages"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'specific_pages' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php esc_html_e( 'Specific pages', 'iconvert-promoter' ); ?>
																		</option>

																		<option value="specific_posts"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'specific_posts' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php esc_html_e( 'Specific posts', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="specific_products" <?php echo ( ! function_exists( 'WC' ) ? 'disabled' : '' ); ?>
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'specific_products' ) ? 'selected="selected"' : '' );
																			?>
																			>
																			<?php
																			if ( function_exists( 'WC' ) ) {
																				esc_html_e( 'Specific products', 'iconvert-promoter' );
																			} else {
																				esc_html_e( 'Specific products (requires WooCommerce)', 'iconvert-promoter' );
																			}
																			?>
																		</option>
																	</select>
																</label>
															</div>
														</div>

														<div class="wrapper-trigger-value wrapper-display-condition-value pt-2" data-target="specific-pages" style="<?php echo ( ! isset( $displayConditions['pages'] ) || $displayConditions['pages'][0] !== 'specific_pages' ) ? 'display: none' : ''; ?>">
															<label class="input-group mb-0 wrapper-select2 validation-wrapper">
																<select class="select2-dropdown" required data-text-validation="<?php esc_attr_e( 'Specific pages is required.', 'iconvert-promoter' ); ?>" <?php echo ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'specific_pages' ) ? '' : 'disabled'; ?> name="which-pages-autocomplete" multiple="multiple" data-selected="<?php echo esc_attr( isset( $displayConditions['pages'][1] ) ? implode( ',', $displayConditions['pages'][1] ) : '' ); ?> ">
																</select>
															</label>
														</div>

														<div class="wrapper-trigger-value wrapper-display-condition-value pt-2" data-target="specific-posts" style="<?php echo ( ! isset( $displayConditions['pages'] ) || $displayConditions['pages'][0] !== 'specific_posts' ) ? 'display: none' : ''; ?>">
															<label class="input-group mb-0 wrapper-select2 validation-wrapper">
																<select class="select2-dropdown" required data-text-validation="<?php esc_attr_e( 'Specific posts is required.', 'iconvert-promoter' ); ?>" <?php echo ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'specific_posts' ) ? '' : 'disabled'; ?> name="which-posts-autocomplete" multiple="multiple" data-selected="<?php echo esc_attr( isset( $displayConditions['pages'][1] ) ? implode( ',', $displayConditions['pages'][1] ) : '' ); ?> ">
																</select>
															</label>
														</div>

														<div class="wrapper-trigger-value wrapper-display-condition-value pt-2" data-target="specific-products" style="<?php echo ( ! isset( $displayConditions['pages'] ) || $displayConditions['pages'][0] !== 'specific_products' ) ? 'display: none' : ''; ?>">
															<label class="input-group mb-0 wrapper-select2 validation-wrapper">
																<select class="select2-dropdown" required data-text-validation="<?php esc_attr_e( 'Specific pages is required.', 'iconvert-promoter' ); ?>" <?php echo ( isset( $displayConditions['pages'] ) && $displayConditions['pages'][0] === 'specific_products' ) ? '' : 'disabled'; ?> name="which-products-autocomplete" multiple="multiple" data-selected="<?php echo esc_attr( isset( $displayConditions['pages'][1] ) ? implode( ',', $displayConditions['pages'][1] ) : '' ); ?> ">
																</select>
															</label>
														</div>


													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						<?php endif; ?>
						<?php if ( $type !== 'inline-promotion-bar' ) : ?>
							<div class="col-12 no-gutters accordion section" data-row-order="2">
								<div class="d-flex flex-row justify-content-between align-items-center px-2 accordion-head" id="accordion-head-by-action" data-bs-toggle="collapse" data-bs-target="#accordion-body-by-action" aria-expanded="true" aria-controls="accordion-body-by-action">
									<div class="group-name">
										<?php esc_html_e( 'When do you  want to show this campaign?', 'iconvert-promoter' ); ?>
										<span class="js-count-active count-active hidden"></span>
									</div>
									<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
								</div>
								<div class="collapse accordion-body show" id="accordion-body-by-action" aria-labelledby="accordion-head-by-action">
									<div class="card-body">
										<div class="container-fluid">
											<div class="row">
												<div class="col-lg-6 col-xl-4 subsection">
													<div class="title-subsection"><?php esc_html_e( 'By action', 'iconvert-promoter' ); ?></div>



													<div class="trigger element" data-trigger="On element click">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between">
																<div class="d-flex flex-row align-items-center">
																	<span class="switch_label item-label">
																		<?php esc_html_e( 'On element click', 'iconvert-promoter' ); ?>
																	</span>
																</div>
																<div class="d-flex flex-row justify-content-start align-items-stretch">
																	<div class="d-flex align-items-center">
																		<label class="cs-switch-small cs-toggle-status">
																			<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_on_click" id="switch_on_click"
																				<?php
																				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																				echo ( iconvertpr_promo_option_is_true( $triggers['on-click'] ) ? 'checked="checked"' : '' );
																				?>
																				/>
																			<span class="cs-active-slider"></span>
																		</label>
																	</div>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="input-group group-prepend validation-wrapper">
																<div class="input-group-prepend w-50">
																	<label class="input-group wrapper-select2">
																		<select class="select2-dropdown" name="select_on_click" id="select_on_click">
																			<option value="class" <?php echo ( ( isset( $triggers['on-click'] ) && $triggers['on-click'][0] === 'class' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'class name', 'iconvert-promoter' ); ?>
																			</option>
																			<option value="id" <?php echo ( ( isset( $triggers['on-click'] ) && $triggers['on-click'][0] === 'id' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'id', 'iconvert-promoter' ); ?>
																			</option>
																			<option value="advanced" <?php echo ( ( isset( $triggers['on-click'] ) && $triggers['on-click'][0] === 'advanced' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'custom selector', 'iconvert-promoter' ); ?>
																			</option>
																		</select>
																	</label>
																</div>
																<input type="text" required data-text-validation="<?php esc_attr_e( 'On click field is empty.', 'iconvert-promoter' ); ?>" data-valid-selector="select_on_click" data-valid-selector-message="<?php esc_attr_e( 'On click selector is not valid.', 'iconvert-promoter' ); ?>" name="value_on_click" id="value_on_click" value="<?php echo esc_attr( isset( $triggers['on-click'], $triggers['on-click'][1] ) ? $triggers['on-click'][1] : '' ); ?>" />
															</div>
														</div>
													</div>
													<div class="trigger element" data-trigger="exit intent" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="on exit intent">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php esc_html_e( 'Exit intent', 'iconvert-promoter' ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_page_exit" id="switch_page_exit"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( iconvertpr_promo_option_is_true( $triggers['exit-intent'] ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
													</div>
													<div class="trigger element" data-trigger="on scroll percent" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="on scroll percent">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php esc_html_e( 'On scroll percent', 'iconvert-promoter' ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_scroll_percent" id="switch_scroll_percent"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( iconvertpr_promo_option_is_true( $triggers['scroll-percent'] ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<div class="input-group group-append validation-wrapper">
																		<label class="input-group">
																			<input type="number" required data-text-validation="<?php esc_attr_e( 'On scroll percent is required.', 'iconvert-promoter' ); ?>" name="scroll_percent" id="scroll_percent" min="0" value="<?php echo esc_attr( isset( $triggers['scroll-percent'][0] ) ? $triggers['scroll-percent'][0] : '' ); ?>" />
																		</label>
																		<span class="input-group-append">
																			<span class="input-group-text"><?php esc_html_e( '%', 'iconvert-promoter' ); ?></span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div class="trigger element" data-trigger="on scroll element" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="scroll to element">
														<div class="wrapper-trigger-switch 33">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label">
																		<?php esc_html_e( 'On scroll to element', 'iconvert-promoter' ); ?>
																	</span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_scroll_to_element" id="switch_scroll_to_element"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( iconvertpr_promo_option_is_true( $triggers['scroll-to-element'] ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="input-group group-prepend validation-wrapper">
																<div class="input-group-prepend w-50">
																	<label class="input-group wrapper-select2">
																		<select class="select2-dropdown" name="select_scroll_to_element">
																			<option value="class" <?php echo ( ( isset( $triggers['scroll-to-element'] ) && $triggers['scroll-to-element'][0] === 'class' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'class name', 'iconvert-promoter' ); ?>
																			</option>
																			<option value="id" <?php echo ( ( isset( $triggers['scroll-to-element'] ) && $triggers['scroll-to-element'][0] === 'id' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'id', 'iconvert-promoter' ); ?>
																			</option>
																			<option value="advanced" <?php echo ( ( isset( $triggers['scroll-to-element'] ) && $triggers['scroll-to-element'][0] === 'advanced' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'custom selector', 'iconvert-promoter' ); ?>
																			</option>
																		</select>
																	</label>
																</div>
																<input type="text" required data-text-validation="<?php esc_attr_e( 'On scroll to element is required.', 'iconvert-promoter' ); ?>" data-valid-selector="select_scroll_to_element" data-valid-selector-message="<?php esc_attr_e( 'On scroll to element selector is not valid.', 'iconvert-promoter' ); ?>" name="value_on_scroll_element" id="value_on_scroll_element" value="<?php echo esc_attr( isset( $triggers['scroll-to-element'][1] ) ? $triggers['scroll-to-element'][1] : '' ); ?>" />
															</div>
														</div>
													</div>

													<div class="trigger element" data-trigger="manually-open">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label">
																		<?php esc_html_e( 'Open from another campaign', 'iconvert-promoter' ); ?>
																		<i class="dashicons-before dashicons-editor-help" data-bs-toggle="tooltip" data-placement="top" title="Open this from another campaign. The other triggers will be ignored if you activate this."></i>
																	</span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_manually_open" id="switch_manually_open"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( iconvertpr_promo_option_is_true( $open_manually ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="col-lg-6 col-xl-4 subsection">
													<div class="title-subsection"><?php esc_html_e( 'By time', 'iconvert-promoter' ); ?></div>
													<div class="trigger element" data-trigger="on page load">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label">
																		<?php esc_html_e( 'On page load', 'iconvert-promoter' ); ?>
																	</span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_page_load" id="switch_page_load"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( iconvertpr_promo_option_is_true( $triggers['page-load'] ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<div class="input-group group-append validation-wrapper">
																		<label class="input-group">
																			<input type="number" required data-text-validation="<?php esc_attr_e( 'Page load value less than 0 seconds.', 'iconvert-promoter' ); ?>" step="1" class="icp-integer-only" name="page_load_seconds" id="page_load_seconds" min="0" value="<?php echo ( isset( $triggers['page-load'] ) ? esc_attr( $triggers['page-load'][0] ) : '' ); ?>" />
																		</label>
																		<span class="input-group-append">
																			<span class="input-group-text"><?php esc_html_e( 'seconds', 'iconvert-promoter' ); ?></span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div class="trigger element" data-trigger="after inactivity">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php esc_html_e( 'After inactivity', 'iconvert-promoter' ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_after_inactivity" id="switch_after_inactivity"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo iconvertpr_promo_option_is_true( $triggers['after-inactivity'] ) ? 'checked="checked"' : '';
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="input-group group-append validation-wrapper">
																<label class="input-group">
																	<input type="number" required data-text-validation="<?php esc_attr_e( 'After inactivity is required.', 'iconvert-promoter' ); ?>" class="icp-integer-only" name="after_inactivity" id="after_inactivity" min="1" value="<?php echo esc_attr( isset( $triggers['after-inactivity'][0] ) ? $triggers['after-inactivity'][0] : '' ); ?>" /></label>
																<span class="input-group-append">
																	<span class="input-group-text"><?php esc_html_e( 'seconds', 'iconvert-promoter' ); ?></span>
																</span>
															</div>
														</div>
													</div>
													<div class="trigger element" data-trigger="time spent on a single page" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="spend on page">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php esc_html_e( 'Time spent on a single page (current session)', 'iconvert-promoter' ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_time_spend_single_page" id="switch_time_spend_single_page"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( iconvertpr_promo_option_is_true( $triggers['time-spent-on-page'] ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<div class="input-group group-append validation-wrapper">
																		<label class="input-group">
																			<input type="number" required data-text-validation="<?php esc_attr_e( 'Time spent on a single page is required.', 'iconvert-promoter' ); ?>" name="time_spend_single_page" id="time_spend_single_page" min="0" value="<?php echo esc_attr( isset( $triggers['time-spent-on-page'][0] ) ? $triggers['time-spent-on-page'][0] : '' ); ?>" />
																		</label>
																		<span class="input-group-append">
																			<span class="input-group-text"><?php esc_html_e( 'seconds', 'iconvert-promoter' ); ?></span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div class="trigger element" data-trigger="time spent on site" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="spend on site">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<div class="switch_label item-label">
																		<span><?php esc_html_e( 'Time spent on site (current session)', 'iconvert-promoter' ); ?></span>
																	</div>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_time_spend_on_site" id="switch_time_spend_on_site"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo iconvertpr_promo_option_is_true( $triggers['time-spent-on-site'] ) ? 'checked="checked"' : '';
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<div class="input-group group-append validation-wrapper">
																		<label class="input-group">
																			<input type="number" required data-text-validation="<?php esc_attr_e( 'Time spent on site is required.', 'iconvert-promoter' ); ?>" name="time_spend_on_site" id="time_spend_on_site" min="0" value="<?php echo ( isset( $triggers['time-spent-on-site'][0] ) ? esc_attr( $triggers['time-spent-on-site'][0] ) : '' ); ?>" />
																		</label>
																		<span class="input-group-append">
																			<span class="input-group-text"><?php esc_html_e( 'seconds', 'iconvert-promoter' ); ?></span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="col-lg-6 col-xl-4 subsection">
													<div class="title-subsection"><?php esc_html_e( 'By number of views', 'iconvert-promoter' ); ?></div>
													<div class="trigger element" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="Target new or returning visitors">
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="item-label"><?php esc_html_e( 'Target new or returning visitors', 'iconvert-promoter' ); ?></span>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<label class="input-group wrapper-select2">
																		<select class="select2-dropdown" name="new-returning">
																			<?php $visitor_type = isset( $triggers['new-returning'][0] ) ? $triggers['new-returning'][0] : 'all'; ?>
																			<option value="all" <?php echo $visitor_type === 'all' ? 'selected="selected"' : ''; ?>><?php esc_html_e( 'All visitors', 'iconvert-promoter' ); ?></option>
																			<option value="new" <?php echo $visitor_type === 'new' ? 'selected="selected"' : ''; ?>><?php esc_html_e( 'New visitors', 'iconvert-promoter' ); ?></option>
																			<option value="returning" <?php echo $visitor_type === 'returning' ? 'selected="selected"' : ''; ?>><?php esc_html_e( 'Returning visitors', 'iconvert-promoter' ); ?></option>
																		</select>
																	</label>
																</div>
															</div>
														</div>
													</div>

													<div class="trigger element" data-row="sessions-number" data-trigger="After number of site visits" <?php iconvertpr_display_feature_requires_pro(); ?>>
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php esc_html_e( 'After number of site visits', 'iconvert-promoter' ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_after_sessions" id="switch_after_sessions"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( iconvertpr_promo_option_is_true( $triggers['x-sessions'] ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<div class="input-group group-append validation-wrapper">
																		<label class="input-group">
																			<input type="number" required data-text-validation="<?php esc_attr_e( 'After number of site visits is required.', 'iconvert-promoter' ); ?>" name="after_sessions" id="after_sessions" min="1" value="<?php echo ( isset( $triggers['x-sessions'][0] ) ? esc_attr( $triggers['x-sessions'][0] ) : '' ); ?>" />
																		</label>
																		<span class="input-group-append">
																			<span class="input-group-text"><?php esc_html_e( 'sessions', 'iconvert-promoter' ); ?></span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>


													<div class="trigger element" data-trigger="After seeing any target page repeatedly" <?php iconvertpr_display_feature_requires_pro(); ?>>
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php esc_html_e( 'After seeing any target page repeatedly', 'iconvert-promoter' ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_same_page_views" id="switch_same_page_views"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( isset( $triggers['same-page-views'] ) && ( iconvertpr_promo_option_is_true( $triggers['same-page-views'] ) ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<div class="input-group group-append validation-wrapper">
																		<label class="input-group">
																			<input type="number" required data-text-validation="<?php esc_attr_e( 'After seeing any target page repeatedly is required.', 'iconvert-promoter' ); ?>" name="same_page_views" id="same_page_views" min="0" value="<?php echo ( isset( $triggers['same-page-views'] ) ? esc_attr( $triggers['same-page-views'][0] ) : '' ); ?>" />
																		</label>
																		<span class="input-group-append">
																			<span class="input-group-text"><?php esc_html_e( 'times', 'iconvert-promoter' ); ?></span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div class="trigger element" data-trigger="After number of page views" <?php iconvertpr_display_feature_requires_pro(); ?>>
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php esc_html_e( 'After number of page views', 'iconvert-promoter' ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_page_views" id="switch_page_views"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( iconvertpr_promo_option_is_true( $triggers['page-views'] ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<div class="input-group group-append validation-wrapper">
																		<label class="input-group">
																			<input type="number" required data-text-validation="<?php esc_attr_e( 'After number of page views.', 'iconvert-promoter' ); ?>" name="page_views" id="page_views" min="0" value="<?php echo ( isset( $triggers['page-views'][0] ) ? esc_attr( $triggers['page-views'][0] ) : '' ); ?>" />
																		</label>
																		<span class="input-group-append">
																			<span class="input-group-text"><?php esc_html_e( 'views', 'iconvert-promoter' ); ?></span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>

													<div class="trigger element" data-trigger="After seeing several products" <?php iconvertpr_display_feature_requires_pro(); ?>>
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between align-items-stretch">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php esc_html_e( 'After seeing several products', 'iconvert-promoter' ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_after_products" id="switch_after_products"
																			<?php
																			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																			echo ( ( isset( $triggers['x-products'] ) && iconvertpr_promo_option_is_true( $triggers['x-products'] ) ) ? 'checked="checked"' : '' );
																			?>
																			/>
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
														<div class="wrapper-trigger-value pt-2">
															<div class="row">
																<div class="col-12">
																	<?php if ( ! function_exists( 'WC' ) ) : ?>
																		<div class="alert alert-warning iconvert-promoter-feature-requires-plugin">
																			<?php esc_html_e( 'This option requires WooCommerce plugin.', 'iconvert-promoter' ); ?>
																		</div>
																	<?php endif; ?>
																	<div class="input-group group-append validation-wrapper">
																		<label class="input-group">
																			<input type="number" required data-text-validation="<?php esc_attr_e( 'After seeing several products is required.', 'iconvert-promoter' ); ?>" name="after_products" id="after_products" min="0" value="<?php echo ( isset( $triggers['x-products'][0] ) ? esc_attr( $triggers['x-products'][0] ) : '' ); ?>" />
																		</label>
																		<span class="input-group-append">
																			<span class="input-group-text"><?php esc_html_e( 'products', 'iconvert-promoter' ); ?></span>
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						<?php endif; ?>
						<div class="col-12 no-gutters accordion section" data-row-order="3">
							<div class="d-flex flex-row justify-content-between px-2 accordion-head collapsed" id="accordion-head-recurrence" data-bs-toggle="collapse" data-bs-target="#accordion-body-recurrence" aria-expanded="true" aria-controls="accordion-body-recurrence">
								<div class="group-name">
									<?php esc_html_e( 'How often do you want visitors to see this campaign?', 'iconvert-promoter' ); ?>
									<span class="count-active"><?php esc_attr_e( '2 active', 'iconvert-promoter' ); ?></span>
								</div>
								<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
							</div>
							<div class="collapse accordion-body" id="accordion-body-recurrence" aria-labelledby="accordion-head-recurrence">
								<div class="card-body">
									<div class="container-fluid">
										<div class="row mb-3" data-row="recurring" data-recurring-type="converted">
											<div class="col-lg-6 col-xl-4 subsection">
												<div class="condition element">
													<div class="subsection-title item-label"><?php esc_html_e( 'If user converted', 'iconvert-promoter' ); ?></div>
													<div class="wrapper-display-condition-value">
														<label class="input-group mb-0 wrapper-select2">
															<?php iconvertpr_print_recurring_when_options( 'converted' ); ?>
														</label>
													</div>
												</div>
											</div>
											<div class="col-lg-6 col-xl-4 subsection d-none" data-name="recurring-after-time-section">
												<div class="condition element">
													<div class="subsection-title item-label"><?php esc_html_e( 'After time', 'iconvert-promoter' ); ?></div>
													<div class="wrapper-display-condition-value">
														<?php iconvertpr_print_recurring_after_time_options( 'converted' ); ?>
													</div>
												</div>
											</div>
										</div>


										<div class="row" data-row="recurring" data-recurring-type="closed">
											<div class="col-lg-6 col-xl-4 subsection">
												<div class="condition element">
													<div class="subsection-title item-label"><?php esc_html_e( 'If closed without converting', 'iconvert-promoter' ); ?></div>
													<div class="wrapper-display-condition-value">
														<label class="input-group mb-0 wrapper-select2">
															<?php iconvertpr_print_recurring_when_options( 'closed' ); ?>
														</label>
													</div>
												</div>
											</div>
											<div class="col-lg-6 col-xl-4 subsection d-none" data-name="recurring-after-time-section">
												<div class="condition element">
													<div class="subsection-title item-label"><?php esc_html_e( 'After time', 'iconvert-promoter' ); ?></div>
													<div class="wrapper-display-condition-value">
														<?php iconvertpr_print_recurring_after_time_options( 'closed' ); ?>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 no-gutters accordion section" data-row-order="4">
							<div class="d-flex flex-row justify-content-between px-2 accordion-head collapsed" id="accordion-head-date-interval" data-bs-toggle="collapse" data-bs-target="#accordion-body-date-interval" aria-expanded="true" aria-controls="accordion-body-date-interval">
								<div class="group-name">
									<?php esc_html_e( 'Is your campaign time limited?', 'iconvert-promoter' ); ?>
									<span class="js-count-active count-active hidden"></span>
								</div>
								<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
							</div>
							<div class="collapse accordion-body" id="accordion-body-date-interval" aria-labelledby="accordion-head-date-interval">
								<div class="card-body">
									<div class="container-fluid">
										<div class="row">
											<div class="col-lg-6 col-xl-4 subsection ">
												<div class="col-lg-12 condition element" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="When to start" data-row="when start">
													<div class="wrapper-display-condition-switch">
														<div class="d-flex flex-row justify-content-between align-items-stretch">
															<div class="d-flex flex-wrap align-items-center">
																<span class="switch_label item-label"><?php esc_html_e( 'When to start', 'iconvert-promoter' ); ?></span>
															</div>
															<div class="d-flex align-items-center">
																<label class="cs-switch-small cs-toggle-status">
																	<input type="checkbox" class="switch-input" name="switch_when_start" id="switch_when_start"
																		<?php
																		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																		echo ( iconvertpr_promo_option_is_true( $displayConditions['start-time'] ) ? 'checked="checked"' : '' );
																		?>
																		/>
																	<span class="cs-active-slider"></span>
																</label>
															</div>
														</div>
													</div>
													<div class="wrapper-display-condition-value pt-2 wrapper-trigger-value">
														<div class="input-group group-append">
															<label class="input-group validation-wrapper">
																<input type="text" required disabled="disabled" data-text-validation="<?php esc_attr_e( 'The start time is required.', 'iconvert-promoter' ); ?>" <?php iconvertpr_display_feature_requires_pro(); ?> class="form-control" name="when-start" value="<?php echo isset( $displayConditions['start-time'][0] ) ? esc_attr( $displayConditions['start-time'][0] ) : ''; ?>" />
															</label>
															<span class="input-group-append append-calendar-icon">
																<span class="input-group-text">
																	<i class="dashicons-before dashicons-calendar"></i>
																</span>
															</span>
														</div>
													</div>
												</div>
											</div>
											<div class="col-lg-6 col-xl-4 subsection">
												<div class="col-lg-12 condition element" <?php iconvertpr_display_feature_requires_pro(); ?> data-row="when end">
													<div class="wrapper-display-condition-switch">
														<div class="d-flex flex-row justify-content-between align-items-stretch">
															<div class="d-flex flex-wrap align-items-center">
																<span class="switch_label item-label"><?php esc_html_e( 'When to end', 'iconvert-promoter' ); ?></span>
															</div>
															<div class="d-flex align-items-center">
																<label class="cs-switch-small cs-toggle-status">
																	<input type="checkbox" class="switch-input" name="switch_when_end" id="switch_when_end"
																		<?php
																		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																		echo ( iconvertpr_promo_option_is_true( $displayConditions['end-time'] ) ? 'checked="checked"' : '' );
																		?>
																		/>
																	<span class="cs-active-slider"></span>
																</label>
															</div>
														</div>
													</div>
													<div class="wrapper-display-condition-value pt-2 wrapper-trigger-value">
														<div class="input-group group-append">
															<label class="input-group mb-0 validation-wrapper">
																<input type="text" required disabled="disabled" data-text-validation="<?php esc_attr_e( 'The end time is required.', 'iconvert-promoter' ); ?>" class="form-control" name="when-end" value="<?php echo isset( $displayConditions['end-time'][0] ) ? esc_attr( $displayConditions['end-time'][0] ) : ''; ?>" />
															</label>
															<span class="input-group-append append-calendar-icon">
																<span class="input-group-text">
																	<i class="dashicons-before dashicons-calendar"></i>
																</span>
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 accordion section" data-row-order="5">
							<div class="d-flex flex-row justify-content-between px-2 accordion-head collapsed" id="accordion-head-location" data-bs-toggle="collapse" data-bs-target="#accordion-body-location" aria-expanded="true" aria-controls="accordion-body-location">
								<div class="group-name">
									<?php esc_html_e( 'Show campaign only to visitors from a specific location.', 'iconvert-promoter' ); ?>
									<span class="js-count-active count-active hidden"></span>
								</div>
								<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
							</div>
							<div class="collapse accordion-body" id="accordion-body-location" aria-labelledby="accordion-head-location">
								<div class="card-body">
									<div class="container-fluid  wrapper-trigger-switch">
										<div class="row">
											<div class="col-lg-6 col-xl-4 subsection">
												<div class="col-lg-12 condition element" <?php iconvertpr_display_feature_requires_pro(); ?> data-row="location">

													<div class="wrapper-display-condition-switch">
														<div class="d-flex flex-row justify-content-between align-items-stretch">
															<div class="d-flex flex-wrap align-items-center">
																<span class="switch_label item-label"><?php esc_html_e( 'Show on specific locations', 'iconvert-promoter' ); ?></span>
															</div>
															<div class="d-flex align-items-center">
																<label class="cs-switch-small cs-toggle-status">
																	<input type="checkbox" class="switch-input" name="switch_location" id="switch_location"
																		<?php
																		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																		echo ( iconvertpr_promo_option_is_true( $triggers['location'] ) ? 'checked="checked"' : '' );
																		?>
																		/>
																	<span class="cs-active-slider"></span>
																</label>
															</div>
														</div>
													</div>

												</div>
											</div>
										</div>
										<div class="row wrapper-trigger-value mt-3">
											<div class="col-lg-6 col-xl-4 subsection">
												<div class="col-lg-12 condition element" <?php iconvertpr_display_feature_requires_pro(); ?> data-row="specific country">
													<div class="subsection-title item-label"><?php esc_html_e( 'Show on specific country', 'iconvert-promoter' ); ?></div>
													<div class="wrapper-display-condition-value">
														<label class="input-group mb-0 wrapper-select2  validation-wrapper">
															<select class="select2-dropdown"
															name="countries-autocomplete" 
															required
															disabled="disabled"
															data-text-validation="<?php esc_attr_e( 'The country is required.', 'iconvert-promoter' ); ?>"
															data-selected="<?php echo ( isset( $triggers['location'][0] ) ? esc_attr( $triggers['location'][0] ) : '' ); ?>">
														</select>
														</label>
													</div>
												</div>
											</div>
											<div class="col-lg-6 col-xl-4 subsection">
												<div class="col-lg-12 condition element" <?php iconvertpr_display_feature_requires_pro(); ?> data-row="specific city">
													<div class="subsection-title item-label"><?php esc_html_e( 'Show on specific city/state', 'iconvert-promoter' ); ?></div>
													<div class="wrapper-display-condition-value">
														<label class="input-group mb-0 wrapper-select2">
															<select
																class="select2-dropdown" name="cities-autocomplete"
																<?php echo ( ! isset( $triggers['location'][0] ) || $triggers['location'][0] === '' ) ? 'disabled="disabled" ' : ''; ?>
																multiple="multiple"
																data-selected="<?php echo ( isset( $triggers['location'][1] ) && ! empty( $triggers['location'][1] ) ? esc_attr( implode( ',', $triggers['location'][1] ) ) : '' ); ?>">
															</select>
														</label>
													</div>
												</div>
											</div>
											<div class="col-lg-6 col-xl-4 subsection">
												<div class="col-lg-12 condition element" <?php iconvertpr_display_feature_requires_pro(); ?> data-row="specific city">
													<div class="subsection-title item-label"><?php esc_html_e( 'Location Service', 'iconvert-promoter' ); ?></div>
													<div class="wrapper-display-condition-value">
														<label class="input-group mb-0 wrapper-select2">
															<?php $location_service = isset( $triggers['location'][2] ) ? $triggers['location'][2] : 'iconvert'; ?>
															<select class="select2-dropdown" name="location-service">
																<option value="browser" <?php echo ( $location_service === 'browser' ? 'selected="selected"' : '' ); ?>>
																	<?php esc_html_e( 'Browser Geolocation - Requires user permission', 'iconvert-promoter' ); ?>
																</option>
																<?php if ( defined( 'ICONVERTPR_ENABLE_BEACONDB' ) && ICONVERTPR_ENABLE_BEACONDB ) : ?>
																	<option value="beacondb" <?php echo ( $location_service === 'beacondb' ? 'selected="selected"' : '' ); ?>>
																		<?php esc_html_e( 'Beacondb.net - Public domain geolocation database', 'iconvert-promoter' ); ?>
																	</option>
																<?php endif; ?>
																<option value="iconvert" <?php echo ( $location_service === 'iconvert' ? 'selected="selected"' : '' ); ?>>
																	<?php esc_html_e( 'iConvert Geolocation Service', 'iconvert-promoter' ); ?>
																</option>
															</select>
														</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 no-gutters accordion section" data-row-order="6">
							<div class="d-flex flex-row justify-content-between px-2 accordion-head collapsed" id="accordion-head-by-arriving-from" data-bs-toggle="collapse" data-bs-target="#accordion-body-by-arriving-from" aria-expanded="true" aria-controls="accordion-body-by-arriving-from">
								<div class="group-name">
									<?php esc_html_e( 'Show campaign only to visitors from a specific traffic source.', 'iconvert-promoter' ); ?>
									<span class="js-count-active count-active hidden"></span>
								</div>
								<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
							</div>
							<div class="collapse accordion-body" id="accordion-body-by-arriving-from" aria-labelledby="accordion-head-by-arriving-from">
								<div class="card-body">
									<div class="container-fluid">
										<div class="row">
											<div class="col-lg-8 col-xl-4 subsection">
												<div class="trigger element" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="When arriving from a specific traffic source">
													<div class="wrapper-trigger-switch">
														<div class="d-flex flex-row justify-content-between align-items-stretch">
															<div class="d-flex flex-wrap align-items-center">
																<span class="switch_label item-label"><?php esc_html_e( 'When arriving from a specific traffic source', 'iconvert-promoter' ); ?></span>
															</div>
															<div class="d-flex align-items-center">
																<label class="cs-switch-small cs-toggle-status">
																	<input type="checkbox" class="switch-input" name="switch_arriving_from_source" id="switch_arriving_from_source"
																		<?php
																		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																		echo ( iconvertpr_promo_option_is_true( $specificTrafficSource ) ? 'checked="checked"' : '' );
																		?>
																		/>
																	<span class="cs-active-slider"></span>
																</label>
															</div>
														</div>
													</div>
													<div class="wrapper-trigger-value pt-2">
														<div class="row">
															<div class="col-12">
																<label class="input-group mb-3 wrapper-select2">
																	<select class="select2-dropdown" name="select_arriving_from_source">
																		<option value="direct" <?php echo ( $check_sts_direct ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'Direct', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="google_organic" <?php echo ( $check_sts_google_organic ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'Google (organic)', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="google_paid" <?php echo ( $check_sts_google_paid ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'Google (paid)', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="facebook_organic" <?php echo ( $check_sts_fb_organic ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'Facebook (organic)', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="facebook_paid" <?php echo ( $check_sts_fb_paied ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'Facebook (paid)', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="referrer" <?php echo ( $check_sts_referal ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'Referrer', 'iconvert-promoter' ); ?>
																		</option>
																	</select>
																</label>
															</div>
															<div class="box-referrer-value col-12" style="<?php echo ( ( ( isset( $displayConditions['specific-traffic-source'] ) && $displayConditions['specific-traffic-source'][0] === 'referrer' ) || ! $check_sts_referal ) ? 'display: none' : '' ); ?>">
																<label class="align-items-center d-flex input-group mb-3 validation-wrapper">
																	<input type="text" class="" required disabled="disabled" data-text-validation="<?php esc_attr_e( 'When arriving from a specific traffic source referrer is required.', 'iconvert-promoter' ); ?>" name="referrer_value" id="referrer_value" value="<?php echo ( isset( $displayConditions['specific-traffic-source'][1] ) ? esc_attr( $displayConditions['specific-traffic-source'][1] ) : '' ); ?>" />
																	<i class="dashicons-before dashicons-editor-help ml-2" data-bs-toggle="tooltip" data-placement="top" title="<?php esc_html_e( "If caching is detected, the script will compare only the domain part. In all instances, we strongly recommend that you thoroughly test your campaign's functionality when configuring referrer detection", 'iconvert-promoter' ); ?>"></i>

																</label>
															</div>
														</div>
													</div>
												</div>

											</div>
										</div>

										<div class="row mt-2">
											<div class="col-12 subsection">
												<div class="trigger element validate-at-least-one" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="When arriving with specific UTMs" data-text-validation="When arriving  with specific UTMs requires at least one field configured">
													<div class="wrapper-trigger-switch">
														<div class="row">
															<div class="col-lg-6 col-xl-4">
																<div class="align-items-stretch d-flex flex-grow-1 flex-row justify-content-between position-relative">
																	<div class="d-flex align-items-center">
																		<span class="switch_label item-label"><?php esc_html_e( 'When arriving with specific UTMs', 'iconvert-promoter' ); ?></span>
																	</div>
																	<div class="d-flex align-items-center">
																		<label class="cs-switch-small cs-toggle-status">
																			<input type="checkbox" class="switch-input" name="switch_arriving_from_utm" id="switch_arriving_from_utm"
																				<?php
																				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																				echo ( iconvertpr_promo_option_is_true( $specificUTMSource ) ? 'checked="checked"' : '' );
																				?>
																				/>
																			<span class="cs-active-slider"></span>
																		</label>
																	</div>
																</div>
															</div>
														</div>
													</div>

													<div class="row mt-2">
														<div class="col-lg-6 col-xl-4 subsection">

															<div class="wrapper-trigger-value pt-2">
																<?php $disp_cond_value = isset( $displayConditions['specific-utm'][0] ) ? $displayConditions['specific-utm'][0] : ''; ?>
																<label class="input-group validation-wrapper">
																	<div class="input-group-prepend">
																		<span class="input-group-text"><?php esc_html_e( 'Source', 'iconvert-promoter' ); ?></span>
																	</div>
																	<input
																		type="text"
																		class="form-control"
																		name="arriving_from_utm_source" id="arriving_from_utm_source" value="<?php echo esc_attr( $disp_cond_value ); ?>" />
																</label>
															</div>

														</div>
														<div class="col-lg-6 col-xl-4 subsection">

															<div class="wrapper-trigger-value pt-2">
																<?php $disp_cond_value = isset( $displayConditions['specific-utm'][1] ) ? $displayConditions['specific-utm'][1] : ''; ?>
																<label class="input-group validation-wrapper">
																	<div class="input-group-prepend">
																		<span class="input-group-text"><?php esc_html_e( 'Medium', 'iconvert-promoter' ); ?></span>
																	</div>
																	<input
																		type="text"
																		class="form-control"
																		name="arriving_from_utm_medium" id="arriving_from_utm_medium" value="<?php echo esc_attr( $disp_cond_value ); ?>" />
																</label>
															</div>
														</div>
														<div class="col-lg-6 col-xl-4 subsection">

															<div class="wrapper-trigger-value pt-2">
																<?php $disp_cond_value = isset( $displayConditions['specific-utm'][2] ) ? $displayConditions['specific-utm'][2] : ''; ?>
																<label class="input-group validation-wrapper">
																	<div class="input-group-prepend">
																		<span class="input-group-text"><?php esc_html_e( 'Campaign', 'iconvert-promoter' ); ?></span>
																	</div>
																	<input
																		type="text"
																		class="form-control"
																		name="arriving_from_utm_campaign" id="arriving_from_utm_campaign" value="<?php echo esc_attr( $disp_cond_value ); ?>" />
																</label>
															</div>
														</div>
													</div>
													<div class="row">
														<div class="col-lg-6 col-xl-4 subsection">

															<div class="wrapper-trigger-value pt-2">
																<?php $disp_cond_value = isset( $displayConditions['specific-utm'][3] ) ? $displayConditions['specific-utm'][3] : ''; ?>
																<label class="input-group validation-wrapper">
																	<div class="input-group-prepend">
																		<span class="input-group-text"><?php esc_html_e( 'Term', 'iconvert-promoter' ); ?></span>
																	</div>
																	<input
																		type="text"
																		class="form-control"
																		name="arriving_from_utm_term" id="arriving_from_utm_term" value="<?php echo esc_attr( $disp_cond_value ); ?>" />
																</label>
															</div>
														</div>
														<div class="col-lg-6 col-xl-4 subsection">

															<div class="wrapper-trigger-value pt-2">
																<?php $disp_cond_value = isset( $displayConditions['specific-utm'][4] ) ? $displayConditions['specific-utm'][4] : ''; ?>
																<label class="input-group validation-wrapper">
																	<div class="input-group-prepend">
																		<span class="input-group-text"><?php esc_html_e( 'Content', 'iconvert-promoter' ); ?></span>
																	</div>
																	<input
																		type="text"
																		class="form-control"
																		name="arriving_from_utm_content" id="arriving_from_utm_content" value="<?php echo esc_attr( $disp_cond_value ); ?>" />
																</label>
															</div>
														</div>

													</div>
												</div>


											</div>
										</div>

									</div>
								</div>
							</div>
						</div>
						<div class="col-12 no-gutters accordion section" data-row-order="7">
							<div class="d-flex flex-row justify-content-between px-2 accordion-head collapsed" id="accordion-head-by-cart-attr" data-bs-toggle="collapse" data-bs-target="#accordion-body-by-cart-attr" aria-expanded="true" aria-controls="accordion-body-by-cart-attr">
								<div class="group-name">
									<?php esc_html_e( 'Show campaign based on the visitor\'s cart content.', 'iconvert-promoter' ); ?>
									<span class="js-count-active count-active hidden"></span>
								</div>
								<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
							</div>
							<div class="collapse accordion-body" id="accordion-body-by-cart-attr" aria-labelledby="accordion-head-by-cart-attr">
								<div class="card-body">
									<div class="container-fluid">
										<div class="row">
											<div class="col-lg-8 col-xl-4 subsection">
												<?php if ( ! function_exists( 'WC' ) ) : ?>
													<div class="alert alert-warning iconvert-promoter-feature-requires-plugin">
														<?php esc_html_e( 'These options require WooCommerce plugin.', 'iconvert-promoter' ); ?>
													</div>
												<?php endif; ?>
												<div class="trigger element" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="Number of items in Cart">
													<div class="wrapper-trigger-switch">
														<div class="d-flex flex-row justify-content-between align-items-stretch">
															<div class="d-flex flex-wrap align-items-center">
																<span class="switch_label item-label"><?php esc_html_e( 'Number of items in Cart', 'iconvert-promoter' ); ?></span>
															</div>
															<div class="d-flex align-items-center">
																<label class="cs-switch-small cs-toggle-status <?php echo ( ! function_exists( 'WC' ) ? 'disabled' : '' ); ?>">
																	<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_total_number_in_cart" id="switch_total_number_in_cart"
																		<?php
																		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																		echo ( iconvertpr_promo_option_is_true( $triggers['total-number-in-cart'] ) ? 'checked="checked"' : '' );
																		?>
																		/>
																	<span class="cs-active-slider"></span>
																</label>
															</div>
														</div>
													</div>
													<div class="wrapper-trigger-value pt-2">
														<div class="row">
															<div class="col-12">

																<div class="input-group group-append validation-wrapper">
																	<label class="input-group">
																		<input type="number" required data-text-validation="<?php esc_attr_e( 'Number of items in Cart is required.', 'iconvert-promoter' ); ?>" name="total_number_in_cart" id="total_number_in_cart" min="0" value="<?php echo ( isset( $triggers['total-number-in-cart'][1] ) ? esc_attr( $triggers['total-number-in-cart'][1] ) : '' ); ?>" />
																	</label>
																	<div class="input-group-append">
																		<label class="input-group wrapper-select2">
																			<select class="select2-dropdown" name="select_items_in_cart">
																				<option value="less" <?php echo ( ( isset( $triggers['total-number-in-cart'][0] ) && $triggers['total-number-in-cart'][0] === 'more' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'less than', 'iconvert-promoter' ); ?></option>
																				<option value="more" <?php echo ( ( isset( $triggers['total-number-in-cart'][0] ) && $triggers['total-number-in-cart'][0] === 'less' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'more than', 'iconvert-promoter' ); ?></option>
																				<option value="equal" <?php echo ( ( isset( $triggers['total-number-in-cart'][0] ) && $triggers['total-number-in-cart'][0] === 'equal' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'equal', 'iconvert-promoter' ); ?></option>
																			</select>
																		</label>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="trigger element" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="Cart Total">
													<div class="wrapper-trigger-switch">
														<div class="d-flex flex-row justify-content-between align-items-stretch">
															<div class="d-flex flex-wrap align-items-center">
																<span class="switch_label item-label"><?php esc_html_e( 'Cart Total Amount', 'iconvert-promoter' ); ?></span>
															</div>
															<div class="d-flex align-items-center">
																<label class="cs-switch-small cs-toggle-status <?php echo ( ! function_exists( 'WC' ) ? 'disabled' : '' ); ?>">
																	<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_total_amount_cart" id="switch_total_amount_cart"
																		<?php
																		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																		echo ( isset( $triggers['total-amount-cart'] ) && iconvertpr_promo_option_is_true( $triggers['total-amount-cart'] ) ? 'checked="checked"' : '' );
																		?>
																		/>
																	<span class="cs-active-slider"></span>
																</label>
															</div>
														</div>
													</div>
													<div class="wrapper-trigger-value pt-2">
														<div class="input-group group-append validation-wrapper">
															<label class="input-group">
																<input type="number" required data-text-validation="<?php esc_attr_e( 'Cart Total Amount is required.', 'iconvert-promoter' ); ?>" name="total_amount_cart" id="total_amount_cart" min="0" value="<?php echo ( isset( $triggers['total-amount-cart'][1] ) ? esc_attr( $triggers['total-amount-cart'][1] ) : '' ); ?>" />
															</label>
															<div class="input-group-append">
																<label class="input-group wrapper-select2">
																	<select class="select2-dropdown" name="select_total_amount_cart">
																		<option value="less" <?php echo ( ( isset( $triggers['total-amount-cart'][0] ) && $triggers['total-amount-cart'][0] === 'less' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'less than', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="more" <?php echo ( ( isset( $triggers['total-amount-cart'][0] ) && $triggers['total-amount-cart'][0] === 'more' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'more than', 'iconvert-promoter' ); ?>
																		</option>
																	</select>
																</label>
															</div>
														</div>
													</div>
												</div>
												<div class="trigger element" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="Cart Contains">
													<div class="wrapper-trigger-switch">
														<div class="d-flex flex-row justify-content-between align-items-stretch">
															<div class="d-flex flex-wrap align-items-center">
																<span class="switch_label item-label"><?php esc_html_e( 'Cart Contains', 'iconvert-promoter' ); ?></span>
															</div>
															<div class="d-flex align-items-center">
																<label class="cs-switch-small cs-toggle-status <?php echo ( ! function_exists( 'WC' ) ? 'disabled' : '' ); ?>">
																	<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_product_in_cart" id="switch_product_in_cart"
																		<?php
																		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																		echo ( iconvertpr_promo_option_is_true( $triggers['product-in-cart'] ) ? 'checked="checked"' : '' );
																		?>
																		/>
																	<span class="cs-active-slider"></span>
																</label>
															</div>
														</div>
													</div>
													<div class="wrapper-trigger-value pt-2">
														<div class="input-group group-append validation-wrapper">
															<label class="input-group wrapper-select2 validation-wrapper" for="product_in_cart">
																<select class="select2-dropdown" required data-text-validation="<?php esc_attr_e( 'Cart Contains is required.', 'iconvert-promoter' ); ?>" name="product_in_cart" id="product_in_cart" multiple="multiple" data-selected="<?php echo ( isset( $triggers['product-in-cart'][1] ) ? esc_attr( implode( ',', $triggers['product-in-cart'][1] ) ) : '' ); ?>"></select>
															</label>
															<div class="input-group-append">
																<label class="input-group wrapper-select2">
																	<select class="select2-dropdown" name="select_product_in_cart">
																		<option value="all" <?php echo ( ( isset( $triggers['product-in-cart'][0] ) && $triggers['product-in-cart'][0] === 'all' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'must all', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="one" <?php echo ( ( isset( $triggers['product-in-cart'][0] ) && $triggers['product-in-cart'][0] === 'one' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'at least one', 'iconvert-promoter' ); ?>
																		</option>
																	</select>
																</label>
															</div>
														</div>
													</div>
												</div>
												<div class="trigger element" <?php iconvertpr_display_feature_requires_pro(); ?> data-trigger="Cart Does Not Contain">
													<div class="wrapper-trigger-switch">
														<div class="d-flex flex-row justify-content-between align-items-stretch">
															<div class="d-flex flex-wrap align-items-center">
																<span class="switch_label item-label"><?php esc_html_e( 'Cart Does Not Contain', 'iconvert-promoter' ); ?></span>
															</div>
															<div class="d-flex align-items-center">
																<label class="cs-switch-small cs-toggle-status <?php echo ( ! function_exists( 'WC' ) ? 'disabled' : '' ); ?>">
																	<input type="checkbox" class="switch-input optrix-at-least-one" name="switch_product_not_in_cart" id="switch_product_not_in_cart"
																		<?php
																		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																		echo ( ( isset( $triggers['product-not-in-cart'] ) && iconvertpr_promo_option_is_true( $triggers['product-not-in-cart'] ) ) ? 'checked="checked"' : '' );
																		?>
																		/>
																	<span class="cs-active-slider"></span>
																</label>
															</div>
														</div>
													</div>
													<div class="wrapper-trigger-value pt-2">
														<div class="input-group group-append validation-wrapper">
															<label class="input-group wrapper-select2 validation-wrapper" for="product_not_in_cart">
																<select class="select2-dropdown" required data-text-validation="<?php esc_attr_e( 'Cart Does Not Contain is required.', 'iconvert-promoter' ); ?>" name="product_not_in_cart" id="product_not_in_cart" multiple="multiple" data-selected="<?php echo ( isset( $triggers['product-not-in-cart'][1] ) ? esc_attr( implode( ',', $triggers['product-not-in-cart'][1] ) ) : '' ); ?>"></select>
															</label>
															<div class="input-group-append">
																<label class="input-group wrapper-select2">
																	<select class="select2-dropdown" name="select_product_not_in_cart">
																		<option value="all" <?php echo ( ( isset( $triggers['product-not-in-cart'][0] ) && $triggers['product-not-in-cart'][0] === 'all' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'must all', 'iconvert-promoter' ); ?>
																		</option>
																		<option value="one" <?php echo ( ( isset( $triggers['product-not-in-cart'][0] ) && $triggers['product-not-in-cart'][0] === 'one' ) ? 'selected="selected"' : '' ); ?>><?php esc_html_e( 'at least one', 'iconvert-promoter' ); ?>
																		</option>
																	</select>
																</label>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 no-gutters accordion section" data-row-order="8">
							<div class="d-flex flex-row justify-content-between px-2 accordion-head collapsed" id="accordion-head-device" data-bs-toggle="collapse" data-bs-target="#accordion-body-device" aria-expanded="true" aria-controls="accordion-body-device">
								<div class="group-name">
									<?php esc_html_e( 'Show only on specific devices.', 'iconvert-promoter' ); ?>
									<span class="js-count-active count-active hidden"></span>
								</div>
								<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
							</div>
							<div class="collapse accordion-body" id="accordion-body-device" aria-labelledby="accordion-head-device">
								<div class="card-body">
									<div class="container-fluid">
										<div class="row">
											<div class="col-lg-6 col-xl-4 subsection">
												<div class="col-lg-12 condition element" <?php iconvertpr_display_feature_requires_pro(); ?> data-row="specific display">
													<div class="d-flex flex-row justify-content-between">
														<div class="subsection-title py-2 item-label specific-devices"><?php esc_html_e( 'Enable on', 'iconvert-promoter' ); ?></div>
														<div class="d-flex justify-content-around validate-at-least-one" data-text-validation="<?php esc_attr_e( 'At least one device must be selected.', 'iconvert-promoter' ); ?>">
															<div class="container-specific-device <?php echo $has_desktop_active ? 'active' : ''; ?>">
																<label class="d-block">
																	<span class="cs-device-icon"><i class="bi bi-laptop primary"></i></span>
																	<input type="checkbox" class="switch-input" name="switch_device_desktop" id="switch_device_desktop" <?php echo $has_desktop_active ? 'checked="checked"' : ''; ?> />
																</label>
															</div>
															<div class="container-specific-device <?php echo $has_tablet_active ? 'active' : ''; ?>">
																<label class="d-block">
																	<span class="cs-device-icon"><i class="bi bi-tablet primary"></i></span>
																	<input type="checkbox" class="switch-input" name="switch_device_tablet" id="switch_device_tablet" <?php echo $has_tablet_active ? 'checked="checked"' : ''; ?> />
																</label>
															</div>
															<div class="container-specific-device <?php echo $has_mobile_active ? 'active' : ''; ?>">
																<label class="d-block">
																	<span class="cs-device-icon"><i class="bi bi-phone primary"></i></span>
																	<input type="checkbox" class="switch-input" name="switch_device_mobile" id="switch_device_mobile" <?php echo $has_mobile_active ? 'checked="checked"' : ''; ?> />
																</label>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 no-gutters accordion section" data-row-order="9">
							<div class="d-flex flex-row justify-content-between px-2 accordion-head collapsed" id="accordion-head-user-type" data-bs-toggle="collapse" data-bs-target="#accordion-body-user-type" aria-expanded="true" aria-controls="accordion-body-user-type">
								<div class="group-name">
									<?php esc_html_e( 'Hide campaign for logged users.', 'iconvert-promoter' ); ?>
									<span class="js-count-active count-active hidden"></span>
								</div>
								<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
							</div>
							<div class="collapse accordion-body" id="accordion-body-user-type" aria-labelledby="accordion-head-user-type">
								<div class="card-body">
									<div class="container-fluid">
										<div class="row">
											<div class="col-lg-8 col-xl-4 subsection">
												<?php foreach ( $hcLoggedUsers as $hcLoggedUser ) : ?>
													<div class="trigger element"
														data-trigger="<?php echo esc_attr( $hcLoggedUser['label'] ); ?>"
														data-trigger="on <?php echo esc_attr( $hcLoggedUser['label'] ); ?>"
														<?php
														if ( $hcLoggedUser['isPro'] ) {
															iconvertpr_display_feature_requires_pro();
														}
														?>
														>
														<div class="wrapper-trigger-switch">
															<div class="d-flex flex-row justify-content-between">
																<div class="d-flex flex-wrap align-items-center">
																	<span class="switch_label item-label"><?php echo esc_html( $hcLoggedUser['label'] ); ?></span>
																</div>
																<div class="d-flex align-items-center">
																	<label class="cs-switch-small cs-toggle-status">
																		<input type="checkbox" class="switch-input" data-checkbox-group="hide-user" value="<?php echo esc_attr( $hcLoggedUser['role'] ); ?>" name="<?php echo esc_attr( $hcLoggedUser['input_name'] ); ?>" id="<?php echo esc_attr( $hcLoggedUser['input_name'] ); ?>" <?php echo ( isset( $displayConditions['cs-roles'] ) && in_array( $hcLoggedUser['role'], $displayConditions['cs-roles'] ) ) ? 'checked="checked"' : ''; ?> />
																		<span class="cs-active-slider"></span>
																	</label>
																</div>
															</div>
														</div>
													</div>
												<?php endforeach; ?>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>

</form>
<?php wp_nonce_field( 'iconvertpr_posts-search', '_wpnonce_iconvertpr_search' ); ?>
<?php wp_nonce_field( 'iconvertpr_product-search', '_wpnonce_iconvertpr_product_search' ); ?>
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
<template id="icp-promo-available-in-pro-template">
	<div class="icp-promo-available-in-pro-template">
		<span data-text="<?php esc_attr_e( 'This option is available only in the PRO version.', 'iconvert-promoter' ); ?>"></span>
		<a class="ic-promo-button ic-promo-button-primary" href="<?php echo esc_url( kubio_get_site_urls()['upgrade_url'] ); ?>" target="_blank"><?php esc_html_e( 'Upgrade to PRO', 'iconvert-promoter' ); ?></a>
	</div>
</template>