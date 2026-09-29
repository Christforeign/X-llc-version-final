<?php
/**
 * Main Index fallback template
 *
 * @package XGroupTheme
 */

get_header();
?>

<div class="xg-default-page-wrapper">
    <div class="xg-container">
        <?php if ( have_posts() ) : ?>
            <header class="xg-page-header">
                <h1 class="xg-page-title"><?php esc_html_e( 'Actualités & Articles', 'xgroup-theme' ); ?></h1>
            </header>

            <div class="xg-posts-list">
                <?php while ( have_posts() ) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class( 'xg-post-entry' ); ?>>
                        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <div class="xg-entry-content">
                            <?php the_excerpt(); ?>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php the_posts_pagination(); ?>
        <?php else : ?>
            <p><?php esc_html_e( 'Aucun contenu trouvé.', 'xgroup-theme' ); ?></p>
        <?php endif; ?>
    </div>
</div>

<?php
get_footer();
