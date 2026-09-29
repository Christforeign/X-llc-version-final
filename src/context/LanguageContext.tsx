import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'ht' | 'en';

interface Translations {
  [key: string]: {
    fr: string;
    ht: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation
  nav_home: { fr: 'Accueil', ht: 'Akèy', en: 'Home' },
  nav_izy: { fr: 'Izy Store (Catalog)', ht: 'Izy Store (Katalòg)', en: 'Izy Store (Catalog)' },
  nav_gsm: { fr: 'Services GSM', ht: 'Sèvis GSM', en: 'GSM Services' },
  nav_shipping: { fr: 'Fret & Cargo', ht: 'Kago & Livrezon', en: 'Freight & Cargo' },
  nav_marketplace: { fr: 'Marketplace', ht: 'Mache B2B', en: 'Marketplace' },
  nav_exchange: { fr: 'Troc Escrow', ht: 'Twòk Sekirize', en: 'Escrow Trade' },
  nav_games: { fr: 'Jeux & Dice', ht: 'Jwèt & Pari', en: 'Games & Dice' },
  nav_academy: { fr: 'Académie', ht: 'Akademi', en: 'Academy' },
  nav_documents: { fr: 'Documents', ht: 'Dokiman', en: 'Documents' },
  nav_design: { fr: 'Design Studio', ht: 'Stidyo Design', en: 'Design Studio' },
  nav_contact: { fr: 'Contact', ht: 'Kontak', en: 'Contact' },
  nav_cart: { fr: 'Panier', ht: 'Panye', en: 'Cart' },
  nav_login: { fr: 'Connexion', ht: 'Konekte', en: 'Login' },
  nav_logout: { fr: 'Déconnexion', ht: 'Dekonekte', en: 'Logout' },
  nav_my_account: { fr: 'Mon Compte', ht: 'Kont Mwen', en: 'My Account' },
  nav_apply_role: { fr: 'Postuler pour un Rôle', ht: 'Aplike pou yon Wòl', en: 'Apply for a Role' },

  // Hero Section
  hero_badge: {
    fr: 'XGROUP LLC — Opérations d’Entreprise & Solutions B2B',
    ht: 'XGROUP LLC — Operasyon Biznis & Solisyon B2B',
    en: 'XGROUP LLC — Enterprise Operations & B2B Solutions',
  },
  hero_title_1: {
    fr: 'Technologie Globale, Ingénierie GSM',
    ht: 'Teknoloji Global, Enjenyri GSM',
    en: 'Global Technology, GSM Engineering',
  },
  hero_title_2: {
    fr: '& Fret Transfrontalier',
    ht: '& Kago Transfwontyè',
    en: '& Cross-Border Logistics',
  },
  hero_desc: {
    fr: 'Banc officiel de déblocage sécurisé de microprogrammes, licences certifiées d\'outils GSM, fret direct USA-Caraïbes, et comptoir de négoce matériel.',
    ht: 'Laboratwa ofisyèl pou deblokaj sekirize telefòn, lisans zouti GSM, transpò kago dirèk USA-Karayib, ak mache an gwo.',
    en: 'Official high-security firmware unlock bench, certified GSM tool licences, direct USA-Caribbean air & ocean cargo, and private wholesale market.',
  },
  hero_cta_showcase: {
    fr: 'Découvrir la Vitrine',
    ht: 'Dekouvri Vitrin nan',
    en: 'Explore Showcase',
  },
  hero_cta_gsm: {
    fr: 'Laboratoire GSM',
    ht: 'Laboratwa GSM',
    en: 'GSM Services',
  },
  hero_cta_shipping: {
    fr: 'Expédier un Fret',
    ht: 'Voye yon Kago',
    en: 'Ship Freight',
  },
  hero_cta_marketplace: {
    fr: 'Marketplace Privé',
    ht: 'Mache Prive',
    en: 'Private Marketplace',
  },

  // Showcase Section
  showcase_title: {
    fr: 'Vitrine des Produits & Forfaits Vedettes',
    ht: 'Vitrin Pwodwi ak Fòfè Chwazi',
    en: 'Featured Products & Solutions Showcase',
  },
  showcase_subtitle: {
    fr: 'Sélection des équipements haut de gamme, boîtiers de programmation et licences digitales les plus demandés.',
    ht: 'Seleksyon aparèy kalite siperyè, bwat pwogramasyon ak lisans nimerik ki pi mande.',
    en: 'Curated selection of top-tier hardware, master programmers, and official digital licenses.',
  },
  showcase_tab_all: { fr: 'Tous', ht: 'Tout', en: 'All' },
  showcase_tab_hardware: { fr: 'Appareils & Matériel', ht: 'Aparèy & Materyèl', en: 'Hardware & Devices' },
  showcase_tab_gsm: { fr: 'Services & Licences GSM', ht: 'Sèvis & Lisans GSM', en: 'GSM & Licenses' },
  showcase_view_details: { fr: 'Voir Détails', ht: 'Gade Detay', en: 'View Details' },
  showcase_buy_now: { fr: 'Acheter', ht: 'Achte Kounye a', en: 'Buy Now' },
  showcase_add_cart: { fr: 'Au Panier', ht: 'Mete nan Panye', en: 'Add to Cart' },
  showcase_view_full_market: {
    fr: 'Explorer tout le catalogue Marketplace',
    ht: 'Eksplore tout katalòg Mache a',
    en: 'Explore complete Marketplace catalog',
  },

  // Quick stats
  stat_cleared: { fr: 'Déblocages GSM Réussis', ht: 'Deblokaj GSM Reyisi', en: 'Cleared GSM Unlocks' },
  stat_freight: { fr: 'Fret Maritime & Aérien', ht: 'Kago Bato & Avyon', en: 'Air & Sea Freight Tons' },
  stat_escrow: { fr: 'Fonds Sécurisés Escrow', ht: 'Lajan Sekirize Escrow', en: 'Escrow Volume Protected' },
  stat_dispatch: { fr: 'Délai d’Expédition Hub', ht: 'Tan pou Bato/Avyon Pati', en: 'Hub Dispatch Latency' },

  // Pillars / Services
  services_title: {
    fr: 'Pôles d’Excellence Opérationnelle',
    ht: 'Poto Ekselans Operasyonèl',
    en: 'Operational Excellence Pillars',
  },
  services_subtitle: {
    fr: 'Une infrastructure unifiée pour accélérer vos flux commerciaux et vos interventions télécoms.',
    ht: 'Yon enfrastrikti ini pou akselere biznis ou ak travay telekominikasyon ou.',
    en: 'A unified infrastructure built to accelerate trade flows and telecom engineering.',
  },
  service_gsm_title: { fr: 'Laboratoire GSM & Flashing Remote', ht: 'Laboratwa GSM & Flash a Distans', en: 'GSM Lab & Remote Flashing' },
  service_gsm_desc: {
    fr: 'Déverrouillage permanent Qualcomm EDL, Knox Samsung, bypass Google FRP, licences UnlockTool & Chimera.',
    ht: 'Deblokaj pèmanan Qualcomm EDL, Knox Samsung, kont Google FRP, lisans UnlockTool ak Chimera.',
    en: 'Permanent Qualcomm EDL, Knox Samsung, Google FRP bypass, official UnlockTool & Chimera licenses.',
  },
  service_freight_title: { fr: 'Fret Aérien & Maritime Cargo', ht: 'Kago Avyon & Bato Kago', en: 'Air & Ocean Freight Cargo' },
  service_freight_desc: {
    fr: 'Corridor logistique Miami vers Haïti et République Dominicaine avec suivi radar en direct et dédouanement.',
    ht: 'Liy transpò Miami pou Ayiti ak Repiblik Dominikèn ak kowòdone GPS an dirèk ak koutim.',
    en: 'Logistics corridor connecting Miami to Haiti and Dominican Republic with live tracking.',
  },
  service_b2b_title: { fr: 'Négoce Matériel & Équipements B2B', ht: 'Vant Aparèy & Ekipman B2B', en: 'Wholesale B2B Hardware' },
  service_b2b_desc: {
    fr: 'Smartphones débloqués d\'usine, programmateurs JCID, lots de pièces d\'origine et stockage sécurisé.',
    ht: 'Telefòn debloke nan faktori, pwogramè JCID, pyès orijinal ak depo sekirize.',
    en: 'Factory-unlocked smartphones, JCID programmers, original component lots, and secure warehousing.',
  },

  // Trust footer
  trust_secure_title: { fr: 'Paiements & Dépôts Sécurisés', ht: 'Peman & Depo Sekirize', en: 'Secure Payments & Escrow' },
  trust_secure_desc: {
    fr: 'Cartes bancaires, USDT / Crypto et MonCash protégés par compte séquestre audité.',
    ht: 'Kat labank, USDT / Kripto ak MonCash pwoteje ak kont sekirize.',
    en: 'Cards, USDT / Crypto, and MonCash guarded by audited multi-signature escrow.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('xgroup_language');
    if (saved === 'fr' || saved === 'ht' || saved === 'en') {
      return saved;
    }
    return 'fr'; // Langue principale: Français
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('xgroup_language', lang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.fr || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
