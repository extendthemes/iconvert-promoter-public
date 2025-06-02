<?php

namespace KPromo\Blocks;

use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;
use KPromo\Core\Utils as CoreUtils;

class YesNoBlock extends BlockBase {
	const CONTAINER         = 'container';
	const BUTTONS_CONTAINER = 'buttons-container';
	const VIEWS_CONTAINER   = 'views-container';
	const YES_BUTTON        = 'yes-button';
	const YES_ICON          = 'yes-icon';
	const YES_TEXT          = 'yes-text';
	const NO_BUTTON         = 'no-button';
	const NO_ICON           = 'no-icon';
	const NO_TEXT           = 'no-text';

	public function computed() {

		$yesIcon         = $this->getAttribute( 'yesIcon' );
		$showYesIcon     = Arr::get( $yesIcon, 'show', false );
		$yesIconPosition = Arr::get( $yesIcon, 'position', 'after' );

		$noIcon         = $this->getAttribute( 'noIcon' );
		$showNoIcon     = Arr::get( $noIcon, 'show', false );
		$noIconPosition = Arr::get( $noIcon, 'position', 'after' );

		return array(
			'showYesIconBefore' => $showYesIcon && $yesIconPosition === 'before',
			'showYesIconAfter'  => $showYesIcon && $yesIconPosition === 'after',
			'showNoIconBefore'  => $showNoIcon && $noIconPosition === 'before',
			'showNoIconAfter'   => $showNoIcon && $noIconPosition === 'after',

		);
	}

	public function mapPropsToElements() {

		$containerProps = array_merge(
			array(
				'data-current-action' => '',
			),
			CoreUtils::useJSComponentProps( 'yesno', array() )
		);

		$yes_link = CoreUtils::getLinkAttributes( $this->getAttribute( 'yesLink' ) );
		$no_link  = CoreUtils::getLinkAttributes( $this->getAttribute( 'noLink' ) );

		$yes_action = $this->getAttribute( 'yesAction' );
		$no_action  = $this->getAttribute( 'noAction' );

		if ( $yes_action !== 'link' ) {
			$yes_link = array();
		} else {
			$yes_link['data-type'] = $this->getAttribute( 'yesLink.lightboxMedia' );
		}

		if ( $no_action !== 'link' ) {
			$no_link = array();
		} else {
			$no_link['data-type'] = $this->getAttribute( 'noLink.lightboxMedia' );
		}

		return array(

			self::CONTAINER  => $containerProps,

			// yes button

			self::YES_BUTTON => array_merge(
				array(
					'data-action'       => $this->getAttribute( 'yesAction' ),
					'data-content-type' => 'yes',
					'className'         => array(
						$yes_action === 'close' ? 'cs-popup-close' : null,
					),
				),
				$yes_link
			),

			self::YES_TEXT   => array(
				'innerHTML' => $this->getAttribute( 'yesText' ),
			),

			self::YES_ICON   => array(
				'name' => $this->getAttribute( 'yesIcon.name' ),
			),

			// no button

			self::NO_BUTTON  => array_merge(
				array(
					'data-action'       => $this->getAttribute( 'noAction' ),
					'data-content-type' => 'no',
					'className'         => array(
						$no_action === 'close' ? 'cs-popup-close' : null,
					),
				),
				$no_link
			),

			self::NO_TEXT    => array(
				'innerHTML' => $this->getAttribute( 'noText' ),
			),

			self::NO_ICON    => array(
				'name' => $this->getAttribute( 'noIcon.name' ),
			),

		);
	}
}

Registry::registerBlock(
	__DIR__,
	YesNoBlock::class
);
