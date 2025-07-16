<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
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
		<div class="ic-upgrade-page">
			<div class="ic-upgrade-page-header">
				<h2 class="ic-upgrade-page-title d-flex align-items-center">
					<?php esc_html_e( 'Upgrade to iConvert Promoter PRO', 'iconvert-promoter' ); ?>
				</h2>
				<p class="description"><?php esc_html_e( 'Get access to 100+ premium templates, advanced targeting, email integrations, and powerful customization tools to boost conversions .', 'iconvert-promoter' ); ?></p>
			</div>
			<div class="ic-upgrade-content">
				<div class="row">
					<div class="col col-auto">
						<div class="ic-upgrade-why-card">
							<h3><?php esc_html_e( 'Why Choose iConvert Promoter PRO?', 'iconvert-promoter' ); ?></h3>
							<p><?php esc_html_e( 'Upgrade now and take full control of your pop-up campaigns!', 'iconvert-promoter' ); ?></p>
							<div class="ic-upgrade-why-card-list">
								<ul>


									<?php
									$why_items = array(
										array(
											'title' => esc_html__( '380+ Premium Templates', 'iconvert-promoter' ),
											'desc'  => esc_html__( 'Access high-converting designs for any campaign.', 'iconvert-promoter' ),
										),
										array(
											'title' => esc_html__( 'Countdown campaigns', 'iconvert-promoter' ),
											'desc'  => esc_html__( 'Create time-limited, countdown campaigns that boost conversion.', 'iconvert-promoter' ),
										),
										array(
											'title' => esc_html__( 'Advanced targeting rules', 'iconvert-promoter' ),
											'desc'  => esc_html__( 'Show pop-ups based on visitor behavior, cart content, traffic source, location and many other rules.', 'iconvert-promoter' ),
										),
										array(
											'title' => esc_html__( 'Email marketing service integrations', 'iconvert-promoter' ),
											'desc'  => esc_html__( 'Integrate with top email marketing service providers.', 'iconvert-promoter' ),
										),
										array(
											'title' => esc_html__( 'Advanced customization', 'iconvert-promoter' ),
											'desc'  => esc_html__( 'Customize your popups to pixel perfection with advanced design options.', 'iconvert-promoter' ),
										),
									);

									foreach ( $why_items as $item ) :
										?>
										<li>
											<strong><?php echo esc_html( $item['title'] ); ?></strong> - <?php echo esc_html( $item['desc'] ); ?>
										</li>
									<?php endforeach; ?>
								</ul>
							</div>
						</div>
					</div>
					<div class="col ic-promo-upgrade-steps">
						<div>
							<h4><?php esc_html_e( 'Thank you for your interest in iConvert Promoter!', 'iconvert-promoter' ); ?></h4>
							<p><?php esc_html_e( 'Upgrading to iConvert Promoter PRO unlocks powerful features and tools to help you create high-converting website pop-ups—effortlessly.', 'iconvert-promoter' ); ?></p>
							<h5><?php esc_html_e( 'How to Upgrade in 3 Simple Steps', 'iconvert-promoter' ); ?></h5>
								<?php
								$upgrade_steps = array(
									array(
										'title' => esc_html__( 'Purchase an iConvert Promoter PRO License', 'iconvert-promoter' ),
										'desc'  => esc_html__( 'Select the plan that fits your needs.', 'iconvert-promoter' ),
									),

									array(
										'title' => esc_html__( 'Download the iConvert Promoter PRO Installer', 'iconvert-promoter' ),
										'desc'  => esc_html__( 'A download link will be provided after purchase.', 'iconvert-promoter' ),
									),
									array(
										'title' => esc_html__( 'Install & Activate', 'iconvert-promoter' ),
										'desc'  => esc_html__( 'Upload the ZIP file via WordPress > Plugins > Add New, then enter your license key to activate PRO features instantly.', 'iconvert-promoter' ),
									),
								);
								?>
							<ul>
								<?php foreach ( $upgrade_steps as $index => $step ) : ?>
									<li>
										<span class="ic-upgrade-step-number"><?php echo esc_html( $index + 1 ); ?></span>
										<strong><?php echo esc_html( $step['title'] ); ?></strong> - <?php echo esc_html( $step['desc'] ); ?>
									</li>
								<?php endforeach; ?>
							</ul>
						</div>
						<div class="ic-upgrade-steps-action">
							<a target="_blank" href="<?php echo esc_url( $upgrade_url ); ?>" class="ic-promo-button ic-promo-button-primary">
								<?php esc_html_e( 'Upgrade to iConvert Promoter PRO', 'iconvert-promoter' ); ?>
							</a>
						</div>
					</div>
				</div>
						
			</div>
			<div class="ic-upgrade-page-footer">
				<p>
				<?php
				echo sprintf(
					esc_html(
					// translators: %1$s and %2$s are opening and closing anchor tags respectively.
						__( 'Any questions or problems with your license? %1$sContact us%2$s!', 'iconvert-promoter' )
					),
					'<a target="_blank" href="' . esc_url( $contact_url ) . '">',
					'</a>'
				);
				?>
					</p>
			</div>
		</div>
	</div>
</div>