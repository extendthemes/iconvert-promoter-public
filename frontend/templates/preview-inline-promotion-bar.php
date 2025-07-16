<?php


if(! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Template canvas file to render the current 'wp_template'.
 *
 * @package WordPress
 */

/*
 * Get the template HTML.
 * This needs to run before <head> so that blocks can add scripts and styles in wp_head().
 */
if(function_exists('materialis_gutenberg_keep_comment_before')){
	remove_filter( 'the_content', 'materialis_gutenberg_keep_comment_before', 5);
	remove_filter( 'the_content', 'materialis_gutenberg_keep_comment_after', 6);
}
$template_html = get_the_block_template_html();

if(function_exists('materialis_gutenberg_keep_comment_before')) {
	add_filter( 'the_content', 'materialis_gutenberg_keep_comment_before', 5 );
	add_filter( 'the_content', 'materialis_gutenberg_keep_comment_after', is_customize_preview() ? 20 : 6 );
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <div class="search-skeleton">
        <div class="search-ssc-lg ssc">
            <div class="ssc-wrapper">
                <div class="ssc-line mb w-40"></div>
            </div>
            <div class="ssc-card ssc-wrapper">
                <div class="flex mbs">
                    <div class="search-ssc-lg__tag ssc-square"></div>
                    <div class="search-ssc-lg__tag ssc-square"></div>
                    <div class="search-ssc-lg__tag ssc-square"></div>
                    <div class="search-ssc-lg__tag ssc-square"></div>
                    <div class="search-ssc-lg__tag ssc-square"></div>
                    <div class="search-ssc-lg__tag ssc-square"></div>
                </div>
            </div>
            <br> <br>
            <div class="ssc-card ssc-wrapper ssc-card-no-padding">
                <?php echo $template_html; // phpcs:ignore WordPress.Security.EscapeOutput
                ?>
            </div>
            <br> <br>
            <div class="ssc-card ssc-wrapper">
                <div class="ssc-line w-30 mb"></div> <br>
                <div class="flex align-start justify-between">
                    <div class="w-20">
                        <div class="ssc-head-line mb"></div>
                        <div class="ssc-line w-80"></div>
                        <div class="ssc-line w-40"></div>
                        <div class="ssc-line w-60"></div>
                    </div>
                    <div class="w-20">
                        <div class="ssc-head-line mb"></div>
                        <div class="ssc-line w-80"></div>
                        <div class="ssc-line w-40"></div>
                        <div class="ssc-line w-60"></div>
                    </div>
                    <div class="w-20">
                        <div class="ssc-head-line mb"></div>
                        <div class="ssc-line w-80"></div>
                        <div class="ssc-line w-40"></div>
                        <div class="ssc-line w-60"></div>
                    </div>
                    <div class="w-20">
                        <div class="ssc-head-line mb"></div>
                        <div class="ssc-line w-80"></div>
                        <div class="ssc-line w-40"></div>
                        <div class="ssc-line w-60"></div>
                    </div>
                </div>
            </div> <br>

    </div>

    <?php wp_footer(); ?>
</body>

</html>
