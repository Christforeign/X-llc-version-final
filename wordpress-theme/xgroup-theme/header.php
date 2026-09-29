<?php
/**
 * Header template for X Group - Thème Modulaire Universel
 *
 * @package XGroupTheme
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'xg-theme-dark' ); ?> data-theme="dark">
<?php wp_body_open(); ?>

<!-- PRELOADER D'ASSEMBLAGE ANIMÉ X GROUP (DÉSACTIVABLE DANS APPARENCE > PERSONNALISER) -->
<?php 
$enable_preloader = get_theme_mod( 'xgroup_enable_preloader', true );
if ( $enable_preloader ) : 
?>
<div id="xgPreloader" class="xg-preloader">
    <div class="xg-preloader-inner">
        <div class="xg-preloader-assembly">
            <div class="xg-piece xg-piece-left"></div>
            <div class="xg-piece xg-piece-right"></div>
            <div class="xg-piece xg-piece-bot-left"></div>
            <div class="xg-piece xg-piece-bot-right"></div>
            <div class="xg-preloader-core">
                <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/xgroup-logo.jpg' ); ?>" alt="X GROUP" class="xg-preloader-logo-img">
            </div>
            <div class="xg-preloader-glow"></div>
        </div>
        <div class="xg-preloader-brand">
            <span class="xg-preloader-title">X GROUP</span>
            <span class="xg-preloader-bar"></span>
        </div>
        <button type="button" id="xgSkipPreloader" class="xg-preloader-skip" onclick="var p=document.getElementById('xgPreloader');if(p){p.style.opacity=0;setTimeout(function(){p.remove();},300);}">
            <?php esc_html_e( 'Passer l\'animation ✕', 'xgroup-theme' ); ?>
        </button>
    </div>
</div>
<?php endif; ?>

<!-- BANDEAU D'ANNONCE OPTIONNEL -->
<?php 
$announcement = get_theme_mod( 'xgroup_announcement', '' );
if ( ! empty( $announcement ) ) : ?>
<div class="xg-announcement-bar">
    <div class="xg-container">
        <span><?php echo esc_html( $announcement ); ?></span>
    </div>
</div>
<?php endif; ?>

<!-- EN-TÊTE PRINCIPAL ADAPTATIF -->
<header id="xgMasterHeader" class="xg-master-header">
    <div class="xg-container xg-header-inner">
        
        <!-- 1. LOGO & TITRE DYNAMIQUE -->
        <div class="xg-header-brand">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="xg-logo-link" rel="home">
                <div class="xg-logo-badge-wrapper">
                    <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/xgroup-logo.jpg' ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="xg-main-brand-logo-img">
                </div>
                <div class="xg-logo-titles">
                    <div class="xg-brand-row">
                        <span class="xg-title-main"><?php bloginfo( 'name' ); ?></span>
                        <span class="xg-badge-official">OFFICIEL</span>
                    </div>
                    <?php 
                    $description = get_bloginfo( 'description', 'display' );
                    if ( $description ) : ?>
                        <span class="xg-title-sub"><?php echo esc_html( $description ); ?></span>
                    <?php endif; ?>
                </div>
            </a>
        </div>

        <!-- 2. MENU DE NAVIGATION PRINCIPAL DYNAMIQUE -->
        <nav class="xg-desktop-nav" aria-label="<?php esc_attr_e( 'Menu Principal', 'xgroup-theme' ); ?>">
            <?php
            if ( has_nav_menu( 'primary' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'xg-nav-list',
                    'fallback_cb'    => false,
                ) );
            } else {
                // Si le menu n'est pas encore assigné dans WP, liste automatiquement les premières pages
                echo '<ul class="xg-nav-list">';
                wp_list_pages( array(
                    'title_li'    => '',
                    'number'      => 6,
                    'depth'       => 1,
                    'sort_column' => 'menu_order post_title',
                ) );
                echo '</ul>';
            }
            ?>
        </nav>

        <!-- 3. ACTIONS & BOUTONS D'ACCÈS -->
        <div class="xg-header-actions">
            
            <!-- PANIER WOOCOMMERCE DYNAMIQUE (s'affiche seulement si WooCommerce est actif) -->
            <?php if ( class_exists( 'WooCommerce' ) && function_exists( 'wc_get_cart_url' ) ) : 
                $cart_url   = wc_get_cart_url();
                $cart_count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
            ?>
            <a href="<?php echo esc_url( $cart_url ); ?>" class="xg-circle-action xg-cart-action" title="<?php esc_attr_e( 'Panier', 'xgroup-theme' ); ?>" id="xgHeaderCartBtn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span class="xg-cart-badge" id="xgCartCount"><?php echo esc_html( $cart_count ); ?></span>
            </a>
            <?php endif; ?>

            <!-- COMPTE UTILISATEUR / CONNEXION DYNAMIQUE -->
            <?php 
            $account_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : wp_login_url();
            ?>
            <?php if ( is_user_logged_in() ) : 
                $current_user = wp_get_current_user();
            ?>
                <a href="<?php echo esc_url( $account_url ); ?>" class="xg-circle-action" title="<?php echo esc_attr( $current_user->display_name ); ?>">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </a>
            <?php else : ?>
                <a href="<?php echo esc_url( $account_url ); ?>" class="xg-circle-action" title="<?php esc_attr_e( 'Connexion / Inscription', 'xgroup-theme' ); ?>">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </a>
            <?php endif; ?>

            <!-- BASCULEUR THÈME BLANC / NOIR -->
            <button type="button" class="xg-circle-action xg-theme-toggle-btn" id="xgThemeToggleBtn" title="<?php esc_attr_e( 'Basculer Thème Clair / Sombre', 'xgroup-theme' ); ?>">
                <span class="xg-theme-icon-dark">☀️</span>
                <span class="xg-theme-icon-light" style="display:none;">🌙</span>
            </button>

            <!-- BOUTON TIROIR 3 POINTS (•••) -->
            <button type="button" class="xg-dots-btn" id="xgOpenDrawerBtn" aria-label="<?php esc_attr_e( 'Ouvrir le menu latéral', 'xgroup-theme' ); ?>">
                <span>•••</span>
            </button>

        </div>
    </div>
</header>

<!-- TIROIR LATÉRAL ADAPTATIF (DRAWER) -->
<div id="xgDrawerBackdrop" class="xg-drawer-backdrop"></div>
<aside id="xgDrawerMenu" class="xg-drawer-menu" aria-label="<?php esc_attr_e( 'Menu Latéral', 'xgroup-theme' ); ?>">
    <div class="xg-drawer-header">
        <div class="xg-drawer-user-info">
            <?php if ( is_user_logged_in() ) : 
                $current_user = wp_get_current_user();
            ?>
                <div class="xg-user-avatar">👤</div>
                <div class="xg-user-details">
                    <strong><?php echo esc_html( $current_user->display_name ); ?></strong>
                    <div class="xg-user-sublinks">
                        <a href="<?php echo esc_url( $account_url ); ?>"><?php esc_html_e( 'Mon Compte', 'xgroup-theme' ); ?></a>
                        <span>•</span>
                        <a href="<?php echo esc_url( wp_logout_url( home_url() ) ); ?>" class="xg-red-logout"><?php esc_html_e( 'Déconnexion', 'xgroup-theme' ); ?></a>
                    </div>
                </div>
            <?php else : ?>
                <div class="xg-user-avatar">✨</div>
                <div>
                    <strong><?php bloginfo( 'name' ); ?></strong>
                    <a href="<?php echo esc_url( $account_url ); ?>" class="xg-login-link"><?php esc_html_e( 'Se connecter / S\'inscrire', 'xgroup-theme' ); ?></a>
                </div>
            <?php endif; ?>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
            <button type="button" class="xg-circle-action xg-theme-toggle-btn" title="<?php esc_attr_e( 'Basculer Thème', 'xgroup-theme' ); ?>" style="width:34px;height:34px;font-size:14px;">
                <span class="xg-theme-icon-dark">☀️</span>
                <span class="xg-theme-icon-light" style="display:none;">🌙</span>
            </button>
            <button type="button" class="xg-close-drawer" id="xgCloseDrawerBtn" aria-label="<?php esc_attr_e( 'Fermer', 'xgroup-theme' ); ?>">✕</button>
        </div>
    </div>

    <!-- RACCOURCIS DYNAMIQUES DES PAGES & MODULES CRÉÉS PAR L'UTILISATEUR -->
    <?php
    $drawer_pages = get_pages( array(
        'number'      => 6,
        'sort_column' => 'menu_order post_title',
        'exclude'     => array_filter( array(
            get_option( 'page_on_front' ),
            get_option( 'page_for_posts' ),
            function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'cart' ) : null,
            function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'checkout' ) : null,
            function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'myaccount' ) : null,
        ) ),
    ) );
    if ( ! empty( $drawer_pages ) ) : ?>
    <div class="xg-drawer-quick-poles">
        <?php foreach ( $drawer_pages as $dp ) : ?>
            <a href="<?php echo esc_url( get_permalink( $dp->ID ) ); ?>" class="xg-pole-shortcut">
                <span class="xg-pole-shortcut-dot"></span>
                <span><?php echo esc_html( $dp->post_title ); ?></span>
            </a>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <!-- NAVIGATION DYNAMIQUE DU TIROIR -->
    <div class="xg-drawer-nav-body">
        <h4 class="xg-drawer-section-title"><?php esc_html_e( 'Navigation & Pages', 'xgroup-theme' ); ?></h4>
        <?php
        if ( has_nav_menu( 'drawer' ) ) {
            wp_nav_menu( array(
                'theme_location' => 'drawer',
                'container'      => false,
                'menu_class'     => 'xg-drawer-nav-list',
                'fallback_cb'    => false,
            ) );
        } elseif ( has_nav_menu( 'primary' ) ) {
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'xg-drawer-nav-list',
                'fallback_cb'    => false,
            ) );
        } else {
            echo '<ul class="xg-drawer-nav-list">';
            wp_list_pages( array(
                'title_li'    => '',
                'depth'       => 1,
                'sort_column' => 'menu_order post_title',
            ) );
            echo '</ul>';
        }
        ?>
    </div>

    <!-- BAS DU TIROIR -->
    <div class="xg-drawer-footer">
        <?php 
        $whatsapp_num = get_theme_mod( 'xgroup_whatsapp', '' );
        if ( ! empty( $whatsapp_num ) ) :
            $clean_wa = preg_replace( '/[^0-9]/', '', $whatsapp_num );
        ?>
            <a href="https://wa.me/<?php echo esc_attr( $clean_wa ); ?>" target="_blank" rel="noopener" class="xg-drawer-wa-btn">
                <span>💬 WhatsApp Support</span>
            </a>
        <?php endif; ?>

        <?php if ( is_user_logged_in() ) : ?>
            <a href="<?php echo esc_url( wp_logout_url( home_url() ) ); ?>" class="xg-drawer-logout-action">
                <span>🚪 <?php esc_html_e( 'Se déconnecter', 'xgroup-theme' ); ?></span>
            </a>
        <?php endif; ?>
    </div>
</aside>

<main id="xgMainContent" class="xg-site-main">
