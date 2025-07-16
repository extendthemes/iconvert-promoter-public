<?php
namespace KPromo;
use KPromo\Core\Utils;
use IlluminateAgnostic\Arr\Support\Arr;

add_action(
	'template_redirect',
	function () {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( Arr::has( $_REQUEST, '__kubio-page-title' ) && Utils::canEdit() ) {

			// translators: %s - year month or day
			$posts_from = __( 'Posts from %s', 'iconvert-promoter' );
			$titles     = array(
				'normalPage'        => '{TITLE}',
				// translators: %s - search term
				'normalResultsPage' => sprintf( __( 'Search results for: %s', 'iconvert-promoter' ), '{TITLE}' ),
				'errorPage'         => __( 'Sorry! Page Not Found!', 'iconvert-promoter' ),
				'singlePost'        => '{TITLE}',
				// translators: %s - category
				'categoryArchive'   => sprintf( __( 'Posts in %s', 'iconvert-promoter' ), '{TITLE}' ),
				// translators: %s - author
				'authorArchive'     => sprintf( __( 'Posts by %s', 'iconvert-promoter' ), '{TITLE}' ),
				// translators: %s - tag
				'tagArchive'        => sprintf( __( 'Posts about %s', 'iconvert-promoter' ), '{TITLE}' ),

				'yearArchive'       => sprintf( $posts_from, '{TITLE}' ),
				'monthArchive'      => sprintf( $posts_from, '{TITLE}' ),
				'dayArchive'        => sprintf( $posts_from, '{TITLE}' ),
			);

			ob_start();
			$final_title = '';
			$title_type  = '';
			$title       = '';

			if ( is_404() ) {
				$title_type  = 'errorPage';
				$final_title = $titles['errorPage'];
			} elseif ( is_search() ) {
				$title      = get_search_query();
				$title_type = 'normalResultsPage';
			} elseif ( is_home() ) {
				if ( is_front_page() ) {
					$title = get_bloginfo( 'name' );
				} else {
					$title = get_the_title( get_option( 'page_for_posts', true ) );
				}
				$title_type = 'normalPage';

			} elseif ( is_archive() ) {
				if ( is_post_type_archive() ) {
					$title = post_type_archive_title( '', false );
				} else {
					if ( is_category() ) {
						/* translators: Category archive title. 1: Category name */
						$title      = single_cat_title( '', false );
						$title_type = 'categoryArchive';
					} elseif ( is_tag() ) {
						/* translators: Tag archive title. 1: Tag name */
						$title      = single_tag_title( '', false );
						$title_type = 'tagArchive';
					} elseif ( is_author() ) {
						/* translators: Author archive title. 1: Author name */
						$title      = '<span class="vcard">' . get_the_author() . '</span>';
						$title_type = 'authorArchive';
					} elseif ( is_year() ) {
						/* translators: Yearly archive title. 1: Year */
						$title      = get_the_date( _x( 'Y', 'yearly archives date format', 'iconvert-promoter' ) );
						$title_type = 'yearArchive';
					} elseif ( is_month() ) {
						/* translators: Monthly archive title. 1: Month name and year */
						$title      = get_the_date( _x( 'F Y', 'monthly archives date format', 'iconvert-promoter' ) );
						$title_type = 'monthArchive';
					} elseif ( is_day() ) {
						/* translators: Daily archive title. 1: Date */
						$title      = get_the_date( _x( 'F j, Y', 'daily archives date format', 'iconvert-promoter' ) );
						$title_type = 'dayArchive';
					} elseif ( is_tax( 'post_format' ) ) {
						if ( is_tax( 'post_format', 'post-format-aside' ) ) {
							$title = _x( 'Asides', 'post format archive title', 'iconvert-promoter' );
						} elseif ( is_tax( 'post_format', 'post-format-gallery', 'iconvert-promoter' ) ) {
							$title = _x( 'Galleries', 'post format archive title', 'iconvert-promoter' );
						} elseif ( is_tax( 'post_format', 'post-format-image', 'iconvert-promoter' ) ) {
							$title = _x( 'Images', 'post format archive title', 'iconvert-promoter' );
						} elseif ( is_tax( 'post_format', 'post-format-video', 'iconvert-promoter' ) ) {
							$title = _x( 'Videos', 'post format archive title', 'iconvert-promoter' );
						} elseif ( is_tax( 'post_format', 'post-format-quote', 'iconvert-promoter' ) ) {
							$title = _x( 'Quotes', 'post format archive title', 'iconvert-promoter' );
						} elseif ( is_tax( 'post_format', 'post-format-link', 'iconvert-promoter' ) ) {
							$title = _x( 'Links', 'post format archive title', 'iconvert-promoter' );
						} elseif ( is_tax( 'post_format', 'post-format-status', 'iconvert-promoter' ) ) {
							$title = _x( 'Statuses', 'post format archive title', 'iconvert-promoter' );
						} elseif ( is_tax( 'post_format', 'post-format-audio', 'iconvert-promoter' ) ) {
							$title = _x( 'Audio', 'post format archive title', 'iconvert-promoter' );
						} elseif ( is_tax( 'post_format', 'post-format-chat' ) ) {
							$title = _x( 'Chats', 'post format archive title', 'iconvert-promoter' );
						}
					} elseif ( is_post_type_archive() ) {
						/* translators: Post type archive title. 1: Post type name */
						$title = sprintf( __( 'Archives: %s', 'iconvert-promoter' ), post_type_archive_title( '', false ) );
					} elseif ( is_tax() ) {
						$tax = get_taxonomy( get_queried_object()->taxonomy );
						/* translators: Taxonomy term archive title. 1: Taxonomy singular name, 2: Current taxonomy term */
						$title = sprintf( __( '%1$s: %2$s', 'iconvert-promoter' ), $tax->labels->singular_name, single_term_title( '', false ) );
					} else {
						$title = __( 'Archives', 'iconvert-promoter' );
					}
				}
			} elseif ( is_single() ) {
				$title = get_bloginfo( 'name' );

				global $post;
				if ( $post ) {
					// apply core filter
					$title = apply_filters( 'single_post_title', $post->post_title, $post );
				}
				$title_type = 'singlePost';
			} else {
				$title      = get_the_title();
				$title_type = 'normalPage';
			}

			$final_title = $title_type ? str_replace( '{TITLE}', $title, $titles[ $title_type ] ) : $title;

			return wp_send_json_success(
				array(
					'type'     => $title_type,
					'title'    => $title,
					'computed' => $final_title,
				)
			);
		}
	},
	PHP_INT_MAX
);
