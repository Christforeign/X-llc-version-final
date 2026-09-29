import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SupportBubble } from './components/SupportBubble';
import { ModuleGuard } from './components/ModuleGuard';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { GsmPage } from './pages/GsmPage';
import { ShippingPage } from './pages/ShippingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ExchangePage } from './pages/ExchangePage';
import { GamesPage } from './pages/GamesPage';
import { LearningPage } from './pages/LearningPage';
import { KlikeDelivPage } from './pages/KlikeDelivPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ContactPage } from './pages/ContactPage';
import { SupportPage } from './pages/SupportPage';
import { SolidarityAdsPage } from './pages/SolidarityAdsPage';
import { RequestDesignPage } from './pages/RequestDesignPage';
import { CartPage, CartItem } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { XGroupDigitalCatalogPage } from './pages/XGroupDigitalCatalogPage';
import { WordPressThemePage } from './pages/WordPressThemePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CustomServiceRequestModal } from './components/CustomServiceRequestModal';
import { LogoAssemblySplash } from './components/LogoAssemblySplash';
import { MarketplaceItem } from './models/types';
import { authService } from './services/authService';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('xgroup_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('xgroup_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item: MarketplaceItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const renderRoute = () => {
    switch (currentPath) {
      case '/':
        return (
          <HomePage
            onNavigate={navigate}
            onOpenAuth={() => setIsAuthOpen(true)}
            onAddToCart={handleAddToCart}
          />
        );

      case '/about':
        return <AboutPage onNavigate={navigate} />;

      case '/gsm':
        return (
          <GsmPage
            onNavigate={navigate}
            onOpenAuth={() => setIsAuthOpen(true)}
            onAddToCart={handleAddToCart}
          />
        );

      case '/shipping':
        return (
          <ModuleGuard moduleKey="shipping" onNavigate={navigate}>
            <ShippingPage onNavigate={navigate} onOpenAuth={() => setIsAuthOpen(true)} />
          </ModuleGuard>
        );

      case '/marketplace':
        return (
          <ModuleGuard moduleKey="marketplace" onNavigate={navigate}>
            <MarketplacePage
              onNavigate={navigate}
              onOpenAuth={() => setIsAuthOpen(true)}
              onAddToCart={handleAddToCart}
            />
          </ModuleGuard>
        );

      case '/exchange':
        return (
          <ModuleGuard moduleKey="exchange" onNavigate={navigate}>
            <ExchangePage onNavigate={navigate} onOpenAuth={() => setIsAuthOpen(true)} />
          </ModuleGuard>
        );

      case '/games':
      case '/jeux':
        return (
          <ModuleGuard moduleKey="jeux" onNavigate={navigate}>
            <GamesPage onNavigate={navigate} onOpenAuth={() => setIsAuthOpen(true)} />
          </ModuleGuard>
        );

      case '/delivery':
      case '/klikedeliv':
      case '/xdrive':
      case '/chauffeur':
        return <KlikeDelivPage onNavigate={navigate} onOpenAuth={() => setIsAuthOpen(true)} />;

      case '/learning':
      case '/education':
      case '/formations':
      case '/cours':
        return (
          <ModuleGuard moduleKey="support" onNavigate={navigate}>
            <LearningPage
              onNavigate={navigate}
              onOpenAuth={() => setIsAuthOpen(true)}
              onAddToCart={handleAddToCart}
            />
          </ModuleGuard>
        );

      case '/documents':
        return <DocumentsPage />;

      case '/support':
      case '/aide':
      case '/assistance':
      case '/faq':
        return <SupportPage onNavigate={navigate} onOpenAuth={() => setIsAuthOpen(true)} />;

      case '/solidarite':
      case '/aider':
      case '/aide-solidaire':
      case '/ads':
        return <SolidarityAdsPage onNavigate={navigate} onOpenAuth={() => setIsAuthOpen(true)} />;

      case '/contact':
        return <ContactPage />;

      case '/izy-store':
      case '/autres':
        return (
          <XGroupDigitalCatalogPage
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        );

      case '/request-design':
      case '/services':
      case '/demande-service':
      case '/shein':
        return <RequestDesignPage onNavigate={navigate} onOpenAuth={() => setIsAuthOpen(true)} />;

      case '/cart':
        return (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onNavigate={navigate}
          />
        );

      case '/checkout':
        return (
          <CheckoutPage
            cart={cart}
            onClearCart={handleClearCart}
            onNavigate={navigate}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        );

      case '/dashboard':
      case '/xgroup-admin-1215':
      case '/admin':
        return <AdminPage onNavigate={navigate} />;

      case '/theme-wordpress':
      case '/wordpress':
      case '/pack-wordpress':
        return <WordPressThemePage />;

      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  const isGhostAdmin = currentPath === '/xgroup-admin-1215';

  return (
    <LanguageProvider>
      <LogoAssemblySplash minDuration={2000} />
      <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-amber-400 selection:text-black">
        {!isGhostAdmin && (
          <Navbar
            currentPath={currentPath}
            onNavigate={navigate}
            onOpenAuth={() => setIsAuthOpen(true)}
            cartCount={totalCartCount}
          />
        )}

        <main className="flex-1">{renderRoute()}</main>

        {!isGhostAdmin && <Footer onNavigate={navigate} onOpenAuth={() => setIsAuthOpen(true)} />}

        {!isGhostAdmin && (
          <div className="fixed bottom-20 right-5 z-40">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="group flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-full shadow-lg shadow-black/40 hover:-translate-y-0.5 transition-transform"
              title="Vous cherchez un produit ou service non listé ?"
            >
              <span className="text-sm">💡</span>
              <span className="hidden sm:inline">Autre demande ?</span>
            </button>
          </div>
        )}

        {!isGhostAdmin && <SupportBubble />}

        <CustomServiceRequestModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          defaultCategory="general"
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {
            setIsAuthOpen(false);
            const loggedUser = authService.getCurrentUser();
            const isAdmin = loggedUser?.role === 'admin' || loggedUser?.email?.toLowerCase() === 'blaisechristeveste@gmail.com';
            navigate(isAdmin ? '/dashboard' : '/');
          }}
        />
      </div>
    </LanguageProvider>
  );
}
