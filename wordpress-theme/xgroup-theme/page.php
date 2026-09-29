<?php
/**
 * Universal Page Template for standard WordPress pages
 * Compatible with all page builders, forms plugins (WPForms, Fluent, CF7) and WooCommerce.
 *
 * @package XGroupTheme
 */

get_header();
?>

<div class="xg-standard-page">
    <div class="xg-container">
        <?php
        while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class( 'xg-page-content-card' ); ?>>
                <?php if ( ! is_front_page() && ! is_cart() && ! is_checkout() && ! is_account_page() ) : ?>
                    <header class="xg-single-page-header">
                        <h1 class="xg-single-page-title"><?php the_title(); ?></h1>
                    </header>
                <?php endif; ?>

                <div class="xg-entry-content">
                    <?php 
                    the_content(); 

                    wp_link_pages( array(
                        'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'xgroup-theme' ),
                        'after'  => '</div>',
                    ) );
                    ?>
                </div>
            </article>
            <?php
            if ( comments_open() || get_comments_number() ) :
                comments_template();
            endif;
        endwhile;
        ?>
    </div>
</div>

<?php get_footer(); ?>
