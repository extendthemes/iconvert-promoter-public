<?php
namespace CSPromo\Core\Admin\Structure;

use CSPromo\Core\Traits\HasTemplate;

class Pagination {
	use HasTemplate;

	/**
	 * total
	 *
	 * @var int
	 */
	private $total = 0;

	/**
	 * totalPages
	 *
	 * @var int
	 */
	private $totalPages = 0;

	public function __construct( $total, $perPage = 10 ) {
		$this->total      = $total;
		$this->totalPages = ceil( $total / $perPage );
	}

	/**
	 * Render the pagination HTML
	 *
	 * @return string
	 */
	public function render( $route, $ns = false, $template = 'pagination' ) {
		$big = 999999999;

		$links = paginate_links(
			array(
				'base'         => str_replace( $big, '%#%', ( iconvertpr_generate_page_url( $route, array( 'paged' => $big ), $ns ) ) ),
				'total'        => $this->totalPages,
				'current'      => self::getPageNumber(),
				'format'       => '&paged=%#%',
				'show_all'     => false,
				'type'         => 'list',
				'end_size'     => 1,
				'mid_size'     => 2,
				'prev_next'    => true,
				'prev_text'    => '<i class="bi bi-chevron-left"></i>',
				'next_text'    => '<i class="bi bi-chevron-right"></i>',
				'add_args'     => false,
				'add_fragment' => '',
			)
		);

		$args = array(
			'total' => $this->total,
			'links' => $links,
		);

		return self::template( $template, $args, false );
	}

	/**
	 * Get page number
	 *
	 * @return void
	 */
	public static function getPageNumber() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		return isset( $_GET['paged'] ) ? intval( $_GET['paged'] ) : 1;
	}
}
