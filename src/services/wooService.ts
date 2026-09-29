export interface WooCommerceConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  enabled: boolean;
}

export interface WooTestResult {
  success: boolean;
  message: string;
  code?: string;
  productCount?: number;
}

export const wooService = {
  getConfig(): WooCommerceConfig {
    const saved = localStorage.getItem('xgroup_woo_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      url: '',
      consumerKey: '',
      consumerSecret: '',
      enabled: false
    };
  },

  saveConfig(config: WooCommerceConfig) {
    localStorage.setItem('xgroup_woo_config', JSON.stringify(config));
  },

  async testConnection(config: WooCommerceConfig): Promise<WooTestResult> {
    if (!config.url) {
      return { success: false, message: "Veuillez renseigner l'URL de votre site WordPress (ex: https://monsite.com)." };
    }
    if (!config.consumerKey || !config.consumerSecret) {
      return { success: false, message: "Veuillez renseigner la Consumer Key et le Consumer Secret." };
    }

    const cleanUrl = config.url.trim().replace(/\/$/, '');
    const auth = btoa(`${config.consumerKey.trim()}:${config.consumerSecret.trim()}`);

    try {
      // 1. Try testing products endpoint with query parameters
      const endpoint = `${cleanUrl}/wp-json/wc/v3/products?per_page=1&consumer_key=${encodeURIComponent(config.consumerKey.trim())}&consumer_secret=${encodeURIComponent(config.consumerSecret.trim())}`;
      
      let response = await fetch(endpoint, {
        headers: { 'Content-Type': 'application/json' }
      });

      // 2. If query param fails, try basic auth header
      if (!response.ok) {
        response = await fetch(`${cleanUrl}/wp-json/wc/v3/products?per_page=1`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const total = response.headers.get('x-wp-total');
        const count = total ? parseInt(total, 10) : 0;
        return {
          success: true,
          message: `Connexion établie avec succès ! ${count > 0 ? count + ' produit(s) détecté(s).' : 'Aucun produit publié pour l’instant dans WooCommerce.'}`,
          productCount: count
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          code: '401',
          message: "Erreur 401 (Non Autorisé) : Vos clés Consumer Key ou Consumer Secret sont invalides. Vérifiez-les dans WooCommerce > Réglages > Avancé > API REST."
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          code: '403',
          message: "Erreur 403 (Interdit) : Permissions insuffisantes. Dans WooCommerce > Réglages > Avancé > API REST, vérifiez que votre clé a bien les droits 'Lecture' ou 'Lecture/Écriture'."
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          code: '404',
          message: "Erreur 404 : L'API WooCommerce est introuvable à cette adresse. Vérifiez l'URL de votre site et assurez-vous que les permaliens sont activés dans WordPress (Réglages > Permaliens > choisir 'Nom de l’article')."
        };
      }

      return {
        success: false,
        message: `Erreur WooCommerce HTTP ${response.status} : ${response.statusText}`
      };
    } catch (err: any) {
      console.error('WooCommerce test connection error:', err);
      return {
        success: false,
        code: 'CORS_OR_NETWORK',
        message: "Erreur de connexion (CORS / Réseau) : Votre site WordPress bloque les requêtes provenant d'autres domaines ou le certificat SSL est invalide. Solution : Installez un plugin CORS gratuit sur WordPress (ex: 'WP CORS' ou 'Enable CORS') ou ajoutez les en-têtes Access-Control-Allow-Origin."
      };
    }
  },

  async fetchProducts(): Promise<any[]> {
    const config = this.getConfig();
    if (!config.enabled || !config.url || !config.consumerKey || !config.consumerSecret) {
      return [];
    }

    try {
      const cleanUrl = config.url.trim().replace(/\/$/, '');
      const auth = btoa(`${config.consumerKey.trim()}:${config.consumerSecret.trim()}`);
      
      const urlWithParams = `${cleanUrl}/wp-json/wc/v3/products?per_page=50&consumer_key=${encodeURIComponent(config.consumerKey.trim())}&consumer_secret=${encodeURIComponent(config.consumerSecret.trim())}`;
      
      let response = await fetch(urlWithParams, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        response = await fetch(`${cleanUrl}/wp-json/wc/v3/products?per_page=50`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        throw new Error(`Erreur WooCommerce: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((p: any) => ({
        id: `woo-${p.id}`,
        title: p.name,
        price: parseFloat(p.price) || 0,
        category: p.categories?.[0]?.slug || 'gaming',
        isDigital: true,
        images: p.images?.[0]?.src ? [p.images[0].src] : ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600'],
        description: p.description?.replace(/<[^>]*>?/gm, '') || p.name,
        customFields: ['Email', 'ID / Compte'],
        status: p.status === 'publish' ? 'active' : 'draft',
        sellerName: 'X Group Digital (WooCommerce)'
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération WooCommerce:', error);
      return [];
    }
  },

  async createOrder(orderData: any): Promise<any> {
    const config = this.getConfig();
    if (!config.enabled || !config.url || !config.consumerKey || !config.consumerSecret) {
      return null;
    }

    try {
      const cleanUrl = config.url.trim().replace(/\/$/, '');
      const auth = btoa(`${config.consumerKey.trim()}:${config.consumerSecret.trim()}`);
      const response = await fetch(`${cleanUrl}/wp-json/wc/v3/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Erreur création commande WooCommerce: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur WooCommerce Order:', error);
      throw error;
    }
  }
};
