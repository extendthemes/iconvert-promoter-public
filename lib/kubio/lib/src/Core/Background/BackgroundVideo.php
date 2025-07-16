<?php

namespace KPromo\Core\Background;

use KPromo\Core\Element;
use KPromo\Core\ElementBase;
use KPromo\Core\Utils;
use function floatval;

class BackgroundVideo extends ElementBase {
	const YOUTUBE_MIME = 'video/x-youtube';
	public function __construct( $value ) {
		parent::__construct( $value, BackgroundDefaults::getDefaultVideo() );
	}

	public function wrapperComputedStyle() {
		$url   = $this->get( 'poster.url' );
		$style = array(
			'backgroundImage' => "url(\"$url\")",
		);
		return $style;
	}

	public function __toString() {
		$poster            = $this->get( 'poster.url' );
		$videoType         = $this->get( 'type' );
		$position          = $this->get( 'position' );
		$internalVideoMime = $this->get( 'internal.mimeType' );

		// fallback on the 'mime' path
		if ( empty( $internalVideoMimeType ) ) {
			$internalVideoMime = $this->get( 'internal.mime' );
		}

		$url       = $this->get( "{$videoType}.url" );
		$positionX = floatval( $position['x'] );
		$positionY = floatval( $position['y'] );

		$mimeType = $videoType === 'internal' ? $internalVideoMime : self::YOUTUBE_MIME;

		$id = 'background-video';

		$scriptData = Utils::useJSComponentProps(
			'video-background',
			array(
				'positionX' => $positionX,
				'positionY' => $positionY,
				'mimeType'  => $mimeType,
				'poster'    => $poster,
				'video'     => $url,
			)
		);

		$props = array_merge(
			array(
				'id'        => $id,
				'style'     => $this->wrapperComputedStyle(),
				'className' => array(
					'cp-video-bg',
					'background-layer',
					'kubio-video-background',
				),
			),
			$scriptData
		);

		return new Element( Element::DIV, $props ) . '';
	}
}
