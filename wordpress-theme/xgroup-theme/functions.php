<?php
/**
 * X Group Theme - Thème WordPress & WooCommerce Modulaire et Adaptatif
 *
 * Conçu pour être 100% autonome, compatible avec toutes les extensions de formulaires
 * (WPForms, Fluent Forms, Contact Form 7, Elementor) et passerelles de paiement.
 *
 * @package XGroupTheme
 * @version 4.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 1. CONFIGURATION INITIALE DU THÈME
 */
function xgroup_theme_setup() {
    // Balise <title> automatique gérée par WordPress
    add_theme_support( 'title-tag' );

    // Prise en charge des images à la une
    add_theme_support( 'post-thumbnails' );

    // Logo personnalisé dans Apparence > Personnaliser
    add_theme_support( 'custom-logo', array(
        'height'      => 90,
        'width'       => 260,
        'flex-height' => true,
        'flex-width'  => true,
    ) );

    // Support complet du HTML5
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    // Support complet de WooCommerce
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );

    // Support des embeds responsives et de Gutenberg
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'editor-styles' );

    // Enregistrement des emplacements de menus
    register_nav_menus( array(
        'primary' => esc_html__( 'Menu Principal (Header)', 'xgroup-theme' ),
        'drawer'  => esc_html__( 'Menu Tiroir 3 Points (•••)', 'xgroup-theme' ),
        'footer'  => esc_html__( 'Pied de page (Footer)', 'xgroup-theme' ),
    ) );
}
add_action( 'after_setup_theme', 'xgroup_theme_setup' );

/**
 * 2. CHARGEMENT DES SCRIPTS ET FEUILLES DE STYLES
 */
function xgroup_enqueue_scripts() {
    // Style principal X Group
    // Styles principaux du thème (Design Moderne, Sombre/Clair, Mobile First)
    wp_enqueue_style( 'xgroup-main-style', get_template_directory_uri() . '/assets/css/main.css', array(), '4.2.0' );

    // Feuille de style du thème
    wp_enqueue_style( 'xgroup-style', get_stylesheet_uri(), array( 'xgroup-main-style' ), '4.2.0' );

    // Scripts interactifs (Tiroir, mode sombre/clair, menu mobile)
    wp_enqueue_script( 'xgroup-main-js', get_template_directory_uri() . '/assets/js/main.js', array( 'jquery' ), '4.2.0', true );

    // Variables JS locales
    wp_localize_script( 'xgroup-main-js', 'xgroupData', array(
        'ajaxurl'   => admin_url( 'admin-ajax.php' ),
        'siteUrl'   => home_url( '/' ),
        'isLoggedIn'=> is_user_logged_in(),
    ) );
}
add_action( 'wp_enqueue_scripts', 'xgroup_enqueue_scripts' );

/**
 * 3. ZONES DE WIDGETS & SIDEBARS
 */
function xgroup_widgets_init() {
    register_sidebar( array(
        'name'          => esc_html__( 'Barre Latérale (Sidebar)', 'xgroup-theme' ),
        'id'            => 'sidebar-1',
        'description'   => esc_html__( 'Widgets pour les pages et articles.', 'xgroup-theme' ),
        'before_widget' => '<div id="%1$s" class="xg-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="xg-widget-title">',
        'after_title'   => '</h3>',
    ) );

    register_sidebar( array(
        'name'          => esc_html__( 'Pied de page - Colonne 1', 'xgroup-theme' ),
        'id'            => 'footer-1',
        'before_widget' => '<div id="%1$s" class="xg-footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="xg-widget-title">',
        'after_title'   => '</h4>',
    ) );
}
add_action( 'widgets_init', 'xgroup_widgets_init' );

/**
 * 4. MISE À JOUR DU COMPTEUR DE PANIER AJAX WOOCOMMERCE
 */
if ( class_exists( 'WooCommerce' ) ) {
    add_filter( 'woocommerce_add_to_cart_fragments', function( $fragments ) {
        $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
        $fragments['span#xgCartCount'] = '<span class="xg-cart-badge" id="xgCartCount">' . esc_html( $count ) . '</span>';
        return $fragments;
    } );
}

/**
 * 5. PERSONNALISATION DYNAMIQUE DANS WORDPRESS (Apparence > Personnaliser)
 */
function xgroup_customize_register( $wp_customize ) {
    // Section X Group Réglages Généraux
    $wp_customize->add_section( 'xgroup_settings', array(
        'title'       => __( 'X Group - Réglages du Thème', 'xgroup-theme' ),
        'priority'    => 30,
        'description' => __( 'Configurez les options d\'affichage et de structure de votre site.', 'xgroup-theme' ),
    ) );

    // 0. Activer / Désactiver le Preloader d'assemblage du logo
    $wp_customize->add_setting( 'xgroup_enable_preloader', array(
        'default'           => true,
        'sanitize_callback' => 'wp_validate_boolean',
    ) );
    $wp_customize->add_control( 'xgroup_enable_preloader', array(
        'label'       => __( 'Activer l\'animation d\'assemblage du logo au démarrage', 'xgroup-theme' ),
        'section'     => 'xgroup_settings',
        'type'        => 'checkbox',
        'description' => __( 'Durée ultra-courte de 2 secondes max avec bouton Passer pour un confort optimal.', 'xgroup-theme' ),
    ) );

    // 1. Bandeau d'annonce
    $wp_customize->add_setting( 'xgroup_announcement', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'xgroup_announcement', array(
        'label'       => __( 'Bandeau d\'annonce supérieur', 'xgroup-theme' ),
        'section'     => 'xgroup_settings',
        'type'        => 'text',
        'description' => __( 'Laissez vide pour désactiver le bandeau.', 'xgroup-theme' ),
    ) );

    // 2. Numéro WhatsApp Support
    $wp_customize->add_setting( 'xgroup_whatsapp', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'xgroup_whatsapp', array(
        'label'       => __( 'Numéro WhatsApp Support', 'xgroup-theme' ),
        'section'     => 'xgroup_settings',
        'type'        => 'text',
        'description' => __( 'Format international (ex: +50930000000). Active le bouton WhatsApp flottant et dans le footer.', 'xgroup-theme' ),
    ) );

    // 3. Texte d'assistance footer
    $wp_customize->add_setting( 'xgroup_support_text', array(
        'default'           => __( 'Besoin d\'aide ? Contactez notre équipe pour toute question sur vos commandes ou services.', 'xgroup-theme' ),
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );
    $wp_customize->add_control( 'xgroup_support_text', array(
        'label'       => __( 'Texte d\'assistance (Pied de page)', 'xgroup-theme' ),
        'section'     => 'xgroup_settings',
        'type'        => 'textarea',
    ) );

    // Section dédiée : Configuration de la Page d'Accueil
    $wp_customize->add_section( 'xgroup_homepage_section', array(
        'title'       => __( 'X Group - Structure Page d\'Accueil', 'xgroup-theme' ),
        'priority'    => 31,
        'description' => __( 'Choisissez exactement ce qui s\'affiche sur la page d\'accueil.', 'xgroup-theme' ),
    ) );

    // Afficher le Hero Banner
    $wp_customize->add_setting( 'xgroup_show_hero', array(
        'default'           => true,
        'sanitize_callback' => 'wp_validate_boolean',
    ) );
    $wp_customize->add_control( 'xgroup_show_hero', array(
        'label'       => __( 'Afficher la bannière principale (Hero Banner)', 'xgroup-theme' ),
        'section'     => 'xgroup_homepage_section',
        'type'        => 'checkbox',
    ) );

    // Afficher la section des cartes de pages/services
    $wp_customize->add_setting( 'xgroup_show_pages_section', array(
        'default'           => true,
        'sanitize_callback' => 'wp_validate_boolean',
    ) );
    $wp_customize->add_control( 'xgroup_show_pages_section', array(
        'label'       => __( 'Afficher la section des pages / services sur l\'accueil', 'xgroup-theme' ),
        'section'     => 'xgroup_homepage_section',
        'type'        => 'checkbox',
        'description' => __( 'Cochez pour afficher vos pages sous forme de cartes élégantes.', 'xgroup-theme' ),
    ) );

    // Sélection libre des IDs des pages à afficher sur l'accueil
    $wp_customize->add_setting( 'xgroup_homepage_page_ids', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'xgroup_homepage_page_ids', array(
        'label'       => __( 'IDs des pages à afficher (ex: 12, 14, 25)', 'xgroup-theme' ),
        'section'     => 'xgroup_homepage_section',
        'type'        => 'text',
        'description' => __( 'Laissez vide pour afficher automatiquement vos dernières pages créées, ou saisissez les identifiants séparés par une virgule pour choisir exactement quelles pages vont sur l\'accueil.', 'xgroup-theme' ),
    ) );

    // Nombre maximum si automatique
    $wp_customize->add_setting( 'xgroup_modules_limit', array(
        'default'           => 6,
        'sanitize_callback' => 'absint',
    ) );
    $wp_customize->add_control( 'xgroup_modules_limit', array(
        'label'       => __( 'Nombre maximum de pages affichées si automatique', 'xgroup-theme' ),
        'section'     => 'xgroup_homepage_section',
        'type'        => 'number',
    ) );

    // Titre de la section de pages
    $wp_customize->add_setting( 'xgroup_pages_section_title', array(
        'default'           => __( 'Nos Portails & Services', 'xgroup-theme' ),
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'xgroup_pages_section_title', array(
        'label'       => __( 'Titre de la section des pages', 'xgroup-theme' ),
        'section'     => 'xgroup_homepage_section',
        'type'        => 'text',
    ) );
}
add_action( 'customize_register', 'xgroup_customize_register' );
