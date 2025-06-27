<?php

namespace CSPromo\Core\Traits;

trait HasTemplate {
	//main template folder, used to separate admin and frontend in different folders
	private static $_layout = '_layout';
	/**
	 * template - load a HTML template
	 *
	 * @param  mixed $template
	 * @param  mixed $args
	 * @param  mixed $display
	 * @return mixed
	 */
	public static function template( $template, $args = array(), $display = true, $folder = 'admin' ) {
		// phpcs:ignore WordPress.PHP.DontExtract.extract_extract
		extract( $args );

		$template_file = apply_filters( 'iconvertpr_view_template', ICONVERTPR_PATH . '/' . $folder . '/templates/' . $template . '.php', $template, $args );
		ob_start();
		require $template_file;
		$str = ob_get_clean();

		do_action( 'iconvertpr_template_loaded', $template, $args, $str );

		if ( ! $display ) {
			return $str;
		}

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $str;
	}

	/**
	 * template - load a HTML template
	 *
	 * @param  mixed $template
	 * @param  mixed $args
	 * @param  mixed $echo
	 * @return void
	 */
	public static function templateWithoutLayout( $template, $args = array(), $echo = true, $folder = 'admin' ) {
		self::template( $template, $args, $echo, $folder );
	}


	/**
	 * template - load a HTML template
	 *
	 * @param  mixed $template
	 * @return void
	 */
	public static function templateWithLayout( $template, $args = array() ) {
		$breadcrumb_args    = self::getBreadcrumbsArgs();
		$args['breadcrumb'] = self::template( 'breadcrumbs', array( 'breadcrumbsArgs' => $breadcrumb_args ), false );
		$args['content']    = self::template( $template, $args, false );

		self::template( self::$_layout, $args );
	}

	public static function show404( $message = null ) {
		self::template( '_not_found', array( 'message' => $message ) );
	}

	public static function getBreadcrumbsArgs() {
		$args = array();

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$route = isset( $_GET['route'] ) ? sanitize_text_field( $_GET['route'] ) : '';
		switch ( $route ) {
			case 'settings.popup':
				$args['level1'] = __( 'Create new Popup', 'iconvert-promoter' );
				break;
			case 'settings.popup.edit':
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$post_id        = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
				$args['level1'] = '';

				if ( $post_id ) {
					$args['level1'] = get_the_title( $post_id );
				}
				break;
			default:
				$args['level1'] = '';
		}

		return $args;
	}
}
