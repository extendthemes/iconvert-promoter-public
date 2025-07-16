<?php

if(! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Header file for the Twenty Twenty WordPress default theme.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since Twenty Twenty 1.0
 */

?>
<!DOCTYPE html>

<html class="no-js" <?php language_attributes(); ?>>

<head>

	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>

</head>

<body class="body-preview <?php echo esc_attr(implode(' ', get_body_class())); ?>">	
	<?php
	/** @var string $content */
	if(!$inline) {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $content;
	}

	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $skeleton;


	wp_footer();

	?>
</body>

</html>