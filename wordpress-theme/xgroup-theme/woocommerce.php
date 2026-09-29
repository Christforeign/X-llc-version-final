<?php
/**
 * WooCommerce Custom Container Template
 *
 * @package XGroupTheme
 */

get_header();
?>

<div class="xg-shop-wrapper">
    <div class="xg-container">
        <div class="xg-shop-card">
            <?php woocommerce_content(); ?>
        </div>
    </div>
</div>

<?php
get_footer();
