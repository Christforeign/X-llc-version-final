<?php
/**
 * Template Name: Pleine Largeur (Full Width)
 * Description: Modèle pleine largeur sans marge latérale pour constructeurs de page et formulaires.
 *
 * @package XGroupTheme
 */

get_header();
?>

<div class="xg-full-width-page">
    <?php
    while ( have_posts() ) :
        the_post();
        the_content();
    endwhile;
    ?>
</div>

<?php get_footer(); ?>
