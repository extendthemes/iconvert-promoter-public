<?php

use IlluminateAgnostic\Arr\Support\Arr;

use function KPromo\kubio_get_site_urls;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$mail_provider_fields       = isset( $mail_provider_fields ) ? $mail_provider_fields : array();
$fully_configured_providers = array();

?>

<div class="ic-promo-wrapper d-flex flex-column">
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
	</div>
	<div class="body ">
		<div class="ic-integrations-page">
			<div class="ic-integrations-header">
				<h2 class="ic-integrations-page-title"><?php esc_html_e( 'Integrations', 'iconvert-promoter' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Connect your email marketing service to iConvert Promoter and sync your leads.', 'iconvert-promoter' ); ?></p>
			</div>
			<div class="ic-integrations-content">
				<div class="ic-integrations-list">
				<?php foreach ( $mail_provider_fields as $provider => $provider_config ) : ?>
					<div class="accordion section" data-mail-provider="<?php echo esc_attr( $provider ); ?>">
						<div class="d-flex flex-row justify-content-between accordion-head collapsed" id="accordion-head-date-interval" data-bs-toggle="collapse" data-bs-target="#accordion-integration-<?php echo esc_attr( $provider ); ?>">
							<div class="group-name">
									<div class="ic-integration-provider-icon">
										<?php //phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>
										<img src="<?php echo esc_attr( $provider_config['icon'] ); ?>" alt="<?php echo esc_attr( $provider_config['title'] ); ?>" />
									</div>
								<?php echo esc_html( $provider_config['title'] ); ?>
							</div>
							<div class="arrow-down-icon d-flex"><i class="dashicons-before dashicons-arrow-down-alt2"></i></div>
						</div>
						<div class="accordion-body collapse" id="accordion-integration-<?php echo esc_attr( $provider ); ?>">
							<div class="card-body">
								<div class="container-fluid">
									<div class="row">
										<div class="col">
											<div data-name="integration-form" method="POST" action="<?php echo esc_url( iconvertpr_generate_page_url( 'integrations.update', array(), ICONVERTPR_PAGE_INTEGRATIONS ) ); ?>">
												<input type="hidden" name="provider" value="<?php echo esc_attr( $provider ); ?>" />
												<div class="row">
													<div class="col">
														<div class="row">
															<?php foreach ( $provider_config['fields'] as $field => $field_config ) : ?>
															<div class="col subsection">
																<?php $is_required = Arr::get( $field_config, 'required', false ); ?>
																<div class="trigger element" data-pro="required">
																	<div class="wrapper-trigger-switch">
																		<div class="d-flex flex-row justify-content-between align-items-stretch">
																			<div class="d-flex flex-wrap align-items-center">
																					<span class="item-label">
																					<?php echo esc_html( $field_config['label'] ); ?>
																					<?php if ( $is_required ) : ?>
																						<span>*</span>
																					<?php endif; ?>
																				</span>
																			</div>
																		</div>
																	</div>
																	<div class="wrapper-trigger-value pt-2">
																		<label class="input-group mb-3 validation-wrapper">
																			<?php
																			switch ( $field_config['type'] ) {
																				case 'text':
																					printf(
																						'<input disabled type="text" class="form-control" name="fields[%1$s]" value="%2$s" placeholder="%3$s" %4$s>',
																						esc_attr( $field ),
																						esc_attr( isset( $field_config['value'] ) ? $field_config['value'] : '' ),
																						esc_attr( $field_config['placeholder'] ),
																						$is_required ? 'required' : ''
																					);
																					break;
																			}
																			?>
																		</label>
																	</div>
																	<?php if ( Arr::has( $field_config, 'description' ) ) : ?>
																		<div class="wrapper-trigger-description">
																			<p class="description small"><?php echo esc_html( $field_config['description'] ); ?></p>
																		</div>
																	<?php endif; ?>
																</div>
															</div>
															<?php endforeach; ?>
														</div>
													</div>
												
													<div class="col col-auto iconvert-provider-actions" data-pro="required">
														<button disabled type="button" class="ic-promo-button ic-promo-button-secondary inactive" data-action="test-connection" data-action-url="<?php echo esc_url( add_query_arg( 'provider', $provider, iconvertpr_generate_page_url( 'integrations.test_connection', array(), ICONVERTPR_PAGE_INTEGRATIONS ) ) ); ?>">
																<span class="spinner"></span>
																<?php esc_html_e( 'Test Connection', 'iconvert-promoter' ); ?>
														</button>
														<button disabled type="submit" class="ic-promo-button ic-promo-button-primary inactive">
															<?php esc_html_e( 'Save', 'iconvert-promoter' ); ?>
														</button>
														<button disabled type="reset" title="<?php esc_html_e( 'Clear settings', 'iconvert-promoter' ); ?>" class="ic-promo-button ic-promo-button-outline-danger icon-only inactive">
															<svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="currentColor"/>
															</svg>
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
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
<template id="icp-promo-available-in-pro-template">
	<div class="icp-promo-available-in-pro-template">
		<span data-text="<?php esc_attr_e( 'This option is available only in the PRO version.', 'iconvert-promoter' ); ?>"></span>
		<a class="ic-promo-button ic-promo-button-primary" href="<?php echo esc_url( kubio_get_site_urls()['upgrade_url'] ); ?>" target="_blank"><?php esc_html_e( 'Upgrade to PRO', 'iconvert-promoter' ); ?></a>
	</div>
</template>