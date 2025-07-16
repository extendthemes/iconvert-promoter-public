<?php

/**
 * @var string $promoDefaultName // default name of promo
 * @var array|null $promoTypes // type of promo popup
 * @var string $defaultAlign // default align of promo
 * @var array $centeringOptions // centering options
 */

use CSPromo\Core\Admin\Pages\Promos;

use function KPromo\kubio_get_site_urls;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


$feature_available_only_in_pro = apply_filters( 'iconvertpr_feature_available_only_in_pro', true );


?>

<template id="icp-promo-available-in-pro-template">
	<div class="icp-promo-available-in-pro-template">
		<span data-text="<?php esc_attr_e( 'This option is available only in the PRO version.', 'iconvert-promoter' ); ?>"></span>
		<a class="ic-promo-button ic-promo-button-primary" href="<?php echo esc_url( kubio_get_site_urls()['upgrade_url'] ); ?>" target="_blank"><?php esc_html_e( 'Upgrade to PRO', 'iconvert-promoter' ); ?></a>
	</div>
</template>
<input type="hidden" id="icp-preview-url" value="<?php echo esc_url( add_query_arg( array( '__iconvert-promoter-preview-remote-template' => 1 ), site_url() ) ); ?>">
<div class="d-flex flex-column flex-md-row promo-page-create h-100">
	<div class="d-flex flex-column sidebar-create">
		<div class="box-promo-type">
			<div class="section-title"><?php esc_html_e( 'Choose element type:', 'iconvert-promoter' ); ?></div>
			<div class="d-flex flex-column flex-wrap wrapper-types justify-content-center justify-content-sm-start">
				<?php foreach ( $promoTypes as $keyPromoTypes => $valuePromoTypes ) : ?>
					<label class="d-flex flex-column item <?php echo $keyPromoTypes === 'simple-popup' ? 'active' : ''; ?>" data-preview-img="<?php echo esc_attr( $valuePromoTypes['image_preview'] ); ?>">
						<span class="d-flex flex-row justify-content-center wrapper-title">
							<span class="title"><?php echo esc_html( $valuePromoTypes['name'] ); ?></span>
							<span class="radio">
								<input type="radio" name="promo-type" value="<?php echo esc_attr( $keyPromoTypes ); ?>" <?php echo $keyPromoTypes === 'simple-popup' ? 'checked="checked"' : ''; ?> data-settings="<?php echo esc_attr( iconvertpr_data_to_json( $valuePromoTypes['settings'] ) ); ?>" />
							</span>
						</span>
					</label>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="promo-type-options">
			<div class="pto-position-wrapper position-matrix">
				<hr/>
				<h3><?php esc_html_e( 'Position', 'iconvert-promoter' ); ?></h3>
				<div class="position-matrix-options">
					<select name="toggle-options-position">
						<?php foreach ( $centeringOptions as $option => $data ) : ?>
							<option value="<?php echo esc_attr( $option ); ?>" 
														<?php
														if ( $option === $defaultAlign ) :
															?>
								selected="selected" <?php endif; ?>  data-effects-sides="<?php echo esc_attr( wp_json_encode( $data['effects-sides'] ) ); ?>" ><?php echo esc_html( $data['label'] ); ?></option>
						<?php endforeach; ?>
					</select>
				</div>
			</div>

			<div class="pto-position-wrapper position-toggle settings-floating-bar">
				<hr/>
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
				<hr/>
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
			</div>
		</div>

		
	</div>
	<div class="content-create">
		<div class="d-flex flex-column h-100">
			<div class="box-promo-name d-flex flex-row justify-content-start align-content-center">
				<div class="section-title align-self-center pr-4 "><?php esc_html_e( 'Name:', 'iconvert-promoter' ); ?></div>
				<label class="input-group flex-fill mb-0">
					<input type="text" name="promo-name" placeholder="<?php esc_attr_e( 'Campaign Name', 'iconvert-promoter' ); ?>" value="<?php echo esc_attr( $promoDefaultName ); ?>" />
				</label>
			</div>
			<div class="templates-categories in-progress">
				<span class="templates-cats-label"><?php echo esc_html( 'Category: ' ); ?></span>
				<div class="templates-categories-list">
					<button data-category="*" class="ic-promo-button ic-promo-button-primary ic-promo-button-sm active"><?php esc_html_e( 'All', 'iconvert-promoter' ); ?></button>
				</div>
			</div>
			<div class="wrapper-templates" <?php echo $feature_available_only_in_pro ? 'data-template-list-is-pro-preview' : ''; ?>>
				<div class="d-flex flex-wrap align-content-start templates"></div>
			</div>
		</div>
	</div>
</div>
<?php wp_nonce_field( 'iconvertpr_promo_get_template_by_type', '_wpnonce_get_template' ); ?>
<div class="modal fade" id="template-preview-modal" tabindex="-1" role="dialog" aria-labelledby="preview-template" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">
						<?php esc_html_e( 'Close', 'iconvert-promoter' ); ?>
					</span></button>
			</div>
			<div class="modal-body">
				<?php // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>
				<img alt="" src="" id="image-preview">
			</div>
		</div>
	</div>
</div>