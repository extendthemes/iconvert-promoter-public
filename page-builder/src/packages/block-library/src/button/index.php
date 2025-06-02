<?php
namespace KPromo\Blocks;
use CsPromoKubio\Utils as CSPromoUtils;
use KPromo\Core\Utils;
use KPromo\Core\Registry;

class CsPromoButtonBlock extends ButtonBlock {
	public function mapPropsToElements() {
		$parentMapProps = parent::mapPropsToElements();

		$buttonType     = $this->getAttribute( 'buttonType' );
		$buttonTracking = $this->getAttribute( 'buttonTracking' );
		$copyText       = $this->getAttribute( 'copyText' );
		$coupon         = $this->getAttribute( 'coupon' );

		if ( $buttonType === 'close' ) {
			$buttonTracking = false;
		}

		$buttonParams = array();

		$jsCounterProps = array();
		$jsCounterProps = Utils::useJSComponentProps( 'button', $jsCounterProps );

		if ( $buttonType !== 'link' ) {

			$buttonParams = array(
				'className' => array(
					( $buttonType === 'close' ? 'cs-popup-close' : '' ),
					( $buttonType === 'copy' ? 'cs-popup-copy' : '' ),
					( $buttonType === 'coupon' ? 'cs-popup-coupon' : '' ),
				),
			);

			if ( $buttonType === 'copy' && $copyText ) {
				$buttonParams['data-copy']    = $copyText;
				$buttonParams['data-success'] = $this->getAttribute( 'copyTextSuccess', 'Code copied' );
			}
			if ( $buttonType === 'coupon' && $coupon ) {
				$buttonParams['data-coupon'] = $coupon;
			}
		}

		$outerParams = array_merge(
			$jsCounterProps,
			array(
				'className'                  => array(
					( $buttonTracking ? 'cs-popup-action' : '' ),
					( $buttonType === 'link' || $buttonType === 'empty' ) ? 'cs-popup-action-link' : '',
				),
				'data-conversion-identifier' => sanitize_text_field( $parentMapProps[ self::TEXT ]['innerHTML'] ),
			)
		);

		if ( $buttonType !== 'close' ) {
			$outerParams['data-is-conversion'] = 'true';
		}

		//Map props
		$parentMapProps[ self::OUTER ] = $outerParams;

		$parentMapProps[ self::LINK ] = array_merge( $parentMapProps[ self::LINK ], $buttonParams );

		if ( $buttonType !== 'link' ) {
			$link                                 = $buttonType === 'empty' ? 'about:blank' : '#';
			$parentMapProps[ self::LINK ]['href'] = $link;
		}

		return $parentMapProps;
	}
}

Registry::registerBlock(
	__DIR__,
	CsPromoButtonBlock::class,
	array(
		'metadata'        => CSPromoUtils::getKubioBlockJsonPath( 'button' ),
		'metadata_mixins' => array( 'block.json' ),
	)
);
