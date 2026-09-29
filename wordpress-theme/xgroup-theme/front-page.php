<?php
/**
 * Front Page template for X Group - Thème Propre & 100% Personnalisable
 *
 * @package XGroupTheme
 * @version 4.3.0
 */

get_header();

// 1. SI L'UTILISATEUR A CHOISI UNE PAGE STATIQUE COMME ACCUEIL (Réglages > Lecture > Page d'accueil)
// OU S'IL A CONSTRUIT DU CONTENU AVEC GUTENBERG / ELEMENTOR
if ( 'page' === get_option( 'show_on_front' ) && ! is_home() && ( have_posts() || get_the_content() ) ) :
?>
    <main id="primary" class="site-main xg-custom-frontpage-content">
        <div class="xg-container">
            <?php
            while ( have_posts() ) :
                the_post();
                the_content();
            endwhile;
            ?>
        </div>
    </main>
<?php
else :
    // 2. PAGE D'ACCUEIL DYNAMIQUE 100% CONTRÔLABLE VIA APPARENCE > PERSONNALISER
    $shop_url       = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/boutique/' );
    $show_hero      = get_theme_mod( 'xgroup_show_hero', true );
    $hero_badge     = get_theme_mod( 'xgroup_hero_badge', 'X Group Digital • Services Numériques & GSM' );
    $hero_title     = get_theme_mod( 'xgroup_hero_title', get_bloginfo( 'name' ) );
    $hero_lead      = get_theme_mod( 'xgroup_hero_lead', get_bloginfo( 'description' ) );
    $hero_btn_text  = get_theme_mod( 'xgroup_hero_btn_text', __( 'Explorer les Services', 'xgroup-theme' ) );
    $hero_btn_url   = get_theme_mod( 'xgroup_hero_btn_url', '#xg-pages-section' );

    // Sélection libre des pages à afficher sur l'accueil
    $show_pages_sec = get_theme_mod( 'xgroup_show_pages_section', true );
    $section_tag    = get_theme_mod( 'xgroup_pages_section_tag', __( 'Services & Portails', 'xgroup-theme' ) );
    $section_title  = get_theme_mod( 'xgroup_pages_section_title', __( 'Nos Portails & Services', 'xgroup-theme' ) );
    $section_desc   = get_theme_mod( 'xgroup_pages_section_desc', __( 'Sélectionnez le service de votre choix pour démarrer votre demande en ligne.', 'xgroup-theme' ) );
    $selected_ids_str = get_theme_mod( 'xgroup_homepage_page_ids', '' );
    $pages_limit    = get_theme_mod( 'xgroup_modules_limit', 6 );
?>

<div class="xg-frontpage-wrapper">

    <!-- HERO SECTION MODERNE (OPTIONNELLEMENT ACTIVÉE) -->
    <?php if ( $show_hero ) : ?>
    <section class="xg-hero-section">
        <div class="xg-container">
            <div class="xg-hero-content">
                <!-- LOGO CENTRAL AVEC DÉCORATION DORÉE -->
                <div class="xg-hero-logo-box">
                    <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/xgroup-logo.jpg' ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" class="xg-hero-logo-img">
                </div>

                <?php if ( ! empty( $hero_badge ) ) : ?>
                <div class="xg-hero-badge">
                    <span class="xg-pulse-dot"></span>
                    <span><?php echo esc_html( $hero_badge ); ?></span>
                </div>
                <?php endif; ?>
                
                <h1 class="xg-hero-title">
                    <?php echo esc_html( $hero_title ); ?>
                </h1>
                
                <?php if ( ! empty( $hero_lead ) ) : ?>
                <p class="xg-hero-lead">
                    <?php echo esc_html( $hero_lead ); ?>
                </p>
                <?php endif; ?>

                <div class="xg-hero-actions">
                    <?php if ( ! empty( $hero_btn_text ) ) : ?>
                    <a href="<?php echo esc_url( $hero_btn_url ); ?>" class="xg-btn-primary">
                        <svg class="xg-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        <span><?php echo esc_html( $hero_btn_text ); ?></span>
                    </a>
                    <?php endif; ?>

                    <?php if ( class_exists( 'WooCommerce' ) ) : ?>
                    <a href="<?php echo esc_url( $shop_url ); ?>" class="xg-btn-secondary">
                        <svg class="xg-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                        <span><?php esc_html_e( 'Boutique', 'xgroup-theme' ); ?></span>
                    </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- SECTION DES PAGES SÉLECTIONNÉES SUR L'ACCUEIL (L'UTILISATEUR CHOISIT QUELLES PAGES METTRE) -->
    <?php
    if ( $show_pages_sec ) :
        $chosen_pages = array();

        // Si l'utilisateur a spécifié des IDs de pages précis (ex: "12, 18, 45")
        if ( ! empty( $selected_ids_str ) ) {
            $parsed_ids = array_map( 'absint', explode( ',', $selected_ids_str ) );
            $parsed_ids = array_filter( $parsed_ids );
            if ( ! empty( $parsed_ids ) ) {
                $chosen_pages = get_posts( array(
                    'post_type'      => 'page',
                    'post__in'       => $parsed_ids,
                    'orderby'        => 'post__in',
                    'posts_per_page' => count( $parsed_ids ),
                ) );
            }
        }

        // Sinon, récupérer automatiquement les pages créées par l'utilisateur
        if ( empty( $chosen_pages ) && $pages_limit > 0 ) {
            $excluded_ids = array(
                get_option( 'page_on_front' ),
                get_option( 'page_for_posts' ),
            );
            if ( function_exists( 'wc_get_page_id' ) ) {
                $excluded_ids[] = wc_get_page_id( 'cart' );
                $excluded_ids[] = wc_get_page_id( 'checkout' );
                $excluded_ids[] = wc_get_page_id( 'myaccount' );
            }
            $chosen_pages = get_pages( array(
                'number'      => absint( $pages_limit ),
                'sort_column' => 'menu_order post_title',
                'exclude'     => array_filter( $excluded_ids ),
            ) );
        }

        if ( ! empty( $chosen_pages ) ) :
    ?>
    <section id="xg-pages-section" class="xg-poles-section">
        <div class="xg-container">
            <div class="xg-section-intro">
                <?php if ( ! empty( $section_tag ) ) : ?>
                    <span class="xg-intro-tag"><?php echo esc_html( $section_tag ); ?></span>
                <?php endif; ?>
                <?php if ( ! empty( $section_title ) ) : ?>
                    <h2 class="xg-section-title"><?php echo esc_html( $section_title ); ?></h2>
                <?php endif; ?>
                <?php if ( ! empty( $section_desc ) ) : ?>
                    <p class="xg-section-subtitle"><?php echo esc_html( $section_desc ); ?></p>
                <?php endif; ?>
            </div>

            <div class="xg-poles-grid">
                <?php foreach ( $chosen_pages as $page_item ) : 
                    // Description propre sans shortcode ni balise HTML
                    $raw_content = $page_item->post_content;
                    $clean_text  = strip_shortcodes( $raw_content );
                    $clean_text  = wp_strip_all_tags( $clean_text );
                    $clean_text  = trim( preg_replace( '/\s+/', ' ', $clean_text ) );

                    if ( has_excerpt( $page_item->ID ) ) {
                        $display_desc = get_the_excerpt( $page_item->ID );
                    } elseif ( ! empty( $clean_text ) ) {
                        $display_desc = wp_trim_words( $clean_text, 14, '...' );
                    } else {
                        $display_desc = sprintf( __( 'Accédez à la page %s pour en savoir plus et envoyer vos demandes.', 'xgroup-theme' ), esc_html( $page_item->post_title ) );
                    }

                    // Détection intelligente de l'icône selon le titre de la page
                    $title_lower = mb_strtolower( $page_item->post_title, 'UTF-8' );
                    $icon_svg = '';

                    if ( str_contains( $title_lower, 'web' ) || str_contains( $title_lower, 'site' ) || str_contains( $title_lower, 'dev' ) ) {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
                    } elseif ( str_contains( $title_lower, 'gsm' ) || str_contains( $title_lower, 'phone' ) || str_contains( $title_lower, 'unlock' ) || str_contains( $title_lower, 'imei' ) || str_contains( $title_lower, 'deblocage' ) ) {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>';
                    } elseif ( str_contains( $title_lower, 'tv' ) || str_contains( $title_lower, 'iptv' ) || str_contains( $title_lower, 'abonnement' ) ) {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>';
                    } elseif ( str_contains( $title_lower, 'troc' ) || str_contains( $title_lower, 'change' ) || str_contains( $title_lower, 'exchanger' ) || str_contains( $title_lower, 'moncash' ) || str_contains( $title_lower, 'crypto' ) || str_contains( $title_lower, 'natcash' ) ) {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>';
                    } elseif ( str_contains( $title_lower, 'logo' ) || str_contains( $title_lower, 'design' ) || str_contains( $title_lower, 'graphisme' ) || str_contains( $title_lower, 'creation' ) ) {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>';
                    } elseif ( str_contains( $title_lower, 'fret' ) || str_contains( $title_lower, 'cargo' ) || str_contains( $title_lower, 'livraison' ) || str_contains( $title_lower, 'shipping' ) || str_contains( $title_lower, 'colis' ) ) {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/></svg>';
                    } elseif ( str_contains( $title_lower, 'jeu' ) || str_contains( $title_lower, 'bet' ) || str_contains( $title_lower, 'pari' ) || str_contains( $title_lower, 'recharge' ) ) {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>';
                    } elseif ( str_contains( $title_lower, 'shein' ) || str_contains( $title_lower, 'panier' ) || str_contains( $title_lower, 'achat' ) || str_contains( $title_lower, 'commande' ) ) {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
                    } else {
                        $icon_svg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
                    }
                ?>
                <a href="<?php echo esc_url( get_permalink( $page_item->ID ) ); ?>" class="xg-pole-card">
                    <div class="xg-pole-card-top">
                        <div class="xg-pole-icon-box">
                            <?php echo $icon_svg; ?>
                        </div>
                        <span class="xg-pole-badge"><?php esc_html_e( 'Disponible', 'xgroup-theme' ); ?></span>
                    </div>

                    <h3 class="xg-pole-title"><?php echo esc_html( $page_item->post_title ); ?></h3>
                    <p class="xg-pole-desc"><?php echo esc_html( $display_desc ); ?></p>
                    
                    <div class="xg-pole-card-footer">
                        <span class="xg-pole-link-text">
                            <span><?php esc_html_e( 'Accéder à la page', 'xgroup-theme' ); ?></span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </span>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php 
        endif;
    endif; 
    ?>

    <!-- SECTION BOUTIQUE WOOCOMMERCE (SI ACTIVE) -->
    <?php
    $has_products = false;
    if ( class_exists( 'WooCommerce' ) ) {
        $product_count = wp_count_posts( 'product' );
        if ( ! empty( $product_count->publish ) && $product_count->publish > 0 ) {
            $has_products = true;
        }
    }
    ?>
    <?php if ( $has_products ) : ?>
    <section id="xg-produits" class="xg-products-section">
        <div class="xg-container">
            <div class="xg-section-intro">
                <span class="xg-intro-tag"><?php esc_html_e( 'Boutique', 'xgroup-theme' ); ?></span>
                <h2 class="xg-section-title"><?php esc_html_e( 'Articles & Services Récents', 'xgroup-theme' ); ?></h2>
                <p class="xg-section-subtitle"><?php esc_html_e( 'Commandez vos produits en toute confiance.', 'xgroup-theme' ); ?></p>
            </div>

            <div class="xg-products-grid-wrap">
                <?php echo do_shortcode( '[products limit="8" columns="4" orderby="date" order="DESC"]' ); ?>
            </div>

            <div class="xg-view-all-wrap">
                <a href="<?php echo esc_url( $shop_url ); ?>" class="xg-btn-primary">
                    <span><?php esc_html_e( 'Voir toute la boutique', 'xgroup-theme' ); ?></span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- BANNIÈRE DE CONFIANCE -->
    <section class="xg-trust-banner-section">
        <div class="xg-container">
            <div class="xg-trust-banner-grid">
                <div class="xg-trust-item">
                    <div class="xg-trust-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                    <div>
                        <h4 class="xg-trust-title"><?php esc_html_e( 'Paiement Sécurisé', 'xgroup-theme' ); ?></h4>
                        <p class="xg-trust-text"><?php esc_html_e( 'MonCash, Natcash, Carte bancaire & Cryptomonnaies.', 'xgroup-theme' ); ?></p>
                    </div>
                </div>

                <div class="xg-trust-item">
                    <div class="xg-trust-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <div>
                        <h4 class="xg-trust-title"><?php esc_html_e( 'Traitement Rapide', 'xgroup-theme' ); ?></h4>
                        <p class="xg-trust-text"><?php esc_html_e( 'Commandes automatisées et livraisons immédiates.', 'xgroup-theme' ); ?></p>
                    </div>
                </div>

                <div class="xg-trust-item">
                    <div class="xg-trust-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div>
                        <h4 class="xg-trust-title"><?php esc_html_e( 'Assistance Dédiée', 'xgroup-theme' ); ?></h4>
                        <p class="xg-trust-text"><?php esc_html_e( 'Support réactif sur WhatsApp et par ticket pour chaque client.', 'xgroup-theme' ); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

</div>

<?php
endif;
get_footer();

