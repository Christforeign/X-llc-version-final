<?php
/**
 * Footer template for X Group - Thème Modulaire Universel
 *
 * @package XGroupTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$whatsapp_num = get_theme_mod( 'xgroup_whatsapp', '' );
$clean_wa     = ! empty( $whatsapp_num ) ? preg_replace( '/[^0-9]/', '', $whatsapp_num ) : '';
$account_url  = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : wp_login_url();
?>

</main><!-- #xgMainContent -->

<!-- PIED DE PAGE PRINCIPAL ADAPTATIF -->
<footer id="xgMasterFooter" class="xg-master-footer">
    <div class="xg-container xg-footer-grid">
        
        <!-- 1. IDENTITÉ DU SITE -->
        <div class="xg-footer-col">
            <div class="xg-footer-brand">
                <div class="xg-logo-icon">X</div>
                <span class="xg-title-main"><?php bloginfo( 'name' ); ?></span>
            </div>
            <p class="xg-footer-desc">
                <?php 
                $desc = get_bloginfo( 'description' );
                echo esc_html( ! empty( $desc ) ? $desc : __( 'Votre plateforme de vente en ligne, services numériques et modules.', 'xgroup-theme' ) ); 
                ?>
            </p>
        </div>

        <!-- 2. MENU PAGES & MODULES DYNAMIQUE -->
        <div class="xg-footer-col">
            <h4><?php esc_html_e( 'Pages & Services', 'xgroup-theme' ); ?></h4>
            <?php
            if ( has_nav_menu( 'footer' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'footer',
                    'container'      => false,
                    'depth'          => 1,
                    'fallback_cb'    => false,
                ) );
            } else {
                echo '<ul>';
                wp_list_pages( array(
                    'title_li'    => '',
                    'number'      => 6,
                    'depth'       => 1,
                    'sort_column' => 'menu_order post_title',
                    'exclude'     => array(
                        get_option( 'page_on_front' ),
                        get_option( 'woocommerce_cart_page_id' ),
                        get_option( 'woocommerce_checkout_page_id' ),
                    ),
                ) );
                echo '</ul>';
            }
            ?>
        </div>

        <!-- 3. ESPACE UTILISATEUR DYNAMIQUE -->
        <div class="xg-footer-col">
            <h4><?php esc_html_e( 'Espace Client', 'xgroup-theme' ); ?></h4>
            <ul>
                <li><a href="<?php echo esc_url( $account_url ); ?>"><?php esc_html_e( 'Mon Compte', 'xgroup-theme' ); ?></a></li>
                <?php if ( class_exists( 'WooCommerce' ) && function_exists( 'wc_get_cart_url' ) ) : ?>
                    <li><a href="<?php echo esc_url( wc_get_cart_url() ); ?>"><?php esc_html_e( 'Mon Panier', 'xgroup-theme' ); ?></a></li>
                <?php endif; ?>
                <?php if ( is_user_logged_in() ) : ?>
                    <li><a href="<?php echo esc_url( wp_logout_url( home_url() ) ); ?>" style="color:#ef4444;"><?php esc_html_e( 'Se déconnecter', 'xgroup-theme' ); ?></a></li>
                <?php else : ?>
                    <li><a href="<?php echo esc_url( $account_url ); ?>"><?php esc_html_e( 'Se connecter / S\'inscrire', 'xgroup-theme' ); ?></a></li>
                <?php endif; ?>
            </ul>
        </div>

        <!-- 4. ASSISTANCE DIRECTE -->
        <div class="xg-footer-col">
            <h4><?php esc_html_e( 'Assistance', 'xgroup-theme' ); ?></h4>
            <p class="xg-support-text">
                <?php 
                $support_text = get_theme_mod( 'xgroup_support_text', __( 'Besoin d\'aide ? Contactez notre équipe pour toute question sur vos commandes ou services.', 'xgroup-theme' ) );
                echo esc_html( $support_text ); 
                ?>
            </p>
            <?php if ( ! empty( $clean_wa ) ) : ?>
                <a href="https://wa.me/<?php echo esc_attr( $clean_wa ); ?>" target="_blank" rel="noopener" class="xg-footer-wa-btn">
                    💬 <?php esc_html_e( 'Contacter sur WhatsApp', 'xgroup-theme' ); ?>
                </a>
            <?php endif; ?>
        </div>
    </div>

    <!-- COPYRIGHT ET MENTIONS -->
    <div class="xg-footer-bottom">
        <div class="xg-container xg-bottom-inner">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'Tous droits réservés.', 'xgroup-theme' ); ?></p>
            <div class="xg-badges">
                <span class="xg-pill-badge">🔒 <?php esc_html_e( 'Sécurisé', 'xgroup-theme' ); ?></span>
                <span class="xg-pill-badge">⚡ <?php esc_html_e( 'Multi-Services', 'xgroup-theme' ); ?></span>
            </div>
        </div>
    </div>
</footer>

<!-- BULLE FLOTTANTE OPTIONNELLE (WHATSAPP OU SUPPORT) -->
<?php if ( ! empty( $clean_wa ) ) : ?>
<a href="https://wa.me/<?php echo esc_attr( $clean_wa ); ?>" target="_blank" rel="noopener" id="xgSupportBubble" class="xg-support-bubble" title="<?php esc_attr_e( 'Support WhatsApp', 'xgroup-theme' ); ?>">
    <div class="xg-bubble-inner">
        <span class="xg-bubble-pulse"></span>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
        </svg>
        <span class="xg-bubble-label">Support</span>
    </div>
</a>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
