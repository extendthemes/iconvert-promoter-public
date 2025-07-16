<?php

/**
 * Template canvas file to render the current 'wp_template'.
 *
 * @package WordPress
 */

use CSPromo\Core\Frontend\Pages\PromoPreviewPage;

if(! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/*
 * Get the template HTML.
 * This needs to run before <head> so that blocks can add scripts and styles in wp_head().
 */
$template_html = get_the_block_template_html();
PromoPreviewPage::registerInlineFonts($template_html);

$template_html = str_replace('entry-content wp-block-post-content', 'entry-content-iconvert-promoter', $template_html);
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>" />
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>

	<?php echo $template_html; // phpcs:ignore WordPress.Security.EscapeOutput 
	?>

	<?php wp_footer(); ?>
</body>

</html>