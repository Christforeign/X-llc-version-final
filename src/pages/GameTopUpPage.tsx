import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Search, 
  Wallet, 
  CreditCard, 
  AlertCircle,
  Clock,
  HelpCircle
} from 'lucide-react';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { walletService } from '../services/walletService';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface GameTopUpPageProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

interface GamePackage {
  id: string;
  name: string;
  amount: string;
  priceUsd: number;
  bonus?: string;
  popular?: boolean;
}

interface GameItem {
  id: string;
  name: string;
  region: string;
  image: string;
  badge: string;
  uidPlaceholder: string;
  uidLabel: string;
  packages: GamePackage[];
}

export const GameTopUpPage: React.FC<GameTopUpPageProps> = ({ onNavigate, onOpenAuth }) => {
  const currentUser = authService.getCurrentUser();
  const wallet = currentUser ? db.getWallet(currentUser.id) : null;
  const [selectedGameId, setSelectedGameId] = useState<string>('ff-latam');
  const [playerUid, setPlayerUid] = useState<string>('');
  const [zoneId, setZoneId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('ff-310');
  const [isVerifyingUid, setIsVerifyingUid] = useState<boolean>(false);
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);

  const games: GameItem[] = [
    {
      id: 'ff-latam',
      name: 'Free Fire (LATAM)',
      region: 'Amérique Latine (LATAM)',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
      badge: 'Instantané ⚡',
      uidLabel: 'Player ID (UID)',
      uidPlaceholder: 'Ex: 1234567890',
      packages: [
        { id: 'ff-100', name: '100 + 10 Diamants', amount: '110 💎', priceUsd: 1.20, bonus: '+10 Bonus' },
        { id: 'ff-310', name: '310 + 31 Diamants', amount: '341 💎', priceUsd: 3.50, bonus: '+31 Bonus', popular: true },
        { id: 'ff-520', name: '520 + 52 Diamants', amount: '572 💎', priceUsd: 5.75, bonus: '+52 Bonus' },
        { id: 'ff-1060', name: '1,060 + 106 Diamants', amount: '1,166 💎', priceUsd: 11.50, bonus: '+106 Bonus', popular: true },
        { id: 'ff-2180', name: '2,180 + 218 Diamants', amount: '2,398 💎', priceUsd: 22.00, bonus: '+218 Bonus' },
        { id: 'ff-pass', name: 'Pass Booyah / Élite', amount: 'Pass Élite', priceUsd: 4.80, bonus: 'Saison active' },
      ],
    },
    {
      id: 'ff-us',
      name: 'Free Fire (USA / Global)',
      region: 'North America / Global',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60',
      badge: 'Recharge Directe',
      uidLabel: 'Player ID (UID)',
      uidPlaceholder: 'Ex: 987654321',
      packages: [
        { id: 'ffus-100', name: '100 Diamants', amount: '100 💎', priceUsd: 1.30 },
        { id: 'ffus-310', name: '310 Diamants', amount: '310 💎', priceUsd: 3.80, popular: true },
        { id: 'ffus-520', name: '520 Diamants', amount: '520 💎', priceUsd: 6.20 },
        { id: 'ffus-1060', name: '1,060 Diamants', amount: '1,060 💎', priceUsd: 12.50 },
      ],
    },
    {
      id: 'pubg',
      name: 'PUBG Mobile (UC)',
      region: 'Global',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60',
      badge: 'Global UC',
      uidLabel: 'Character ID (ID de Compte)',
      uidPlaceholder: 'Ex: 5123456789',
      packages: [
        { id: 'pubg-60', name: '60 UC', amount: '60 UC', priceUsd: 1.25 },
        { id: 'pubg-325', name: '325 UC', amount: '325 UC', priceUsd: 5.50, popular: true },
        { id: 'pubg-660', name: '660 UC (Pass Royale)', amount: '660 UC', priceUsd: 10.50, popular: true },
        { id: 'pubg-1800', name: '1,800 UC', amount: '1,800 UC', priceUsd: 26.00 },
      ],
    },
    {
      id: 'mlbb',
      name: 'Mobile Legends: Bang Bang',
      region: 'Global',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60',
      badge: 'Diamonds MLBB',
      uidLabel: 'User ID + (Zone ID)',
      uidPlaceholder: 'Ex: 12345678',
      packages: [
        { id: 'mlbb-86', name: '86 Diamonds', amount: '86 💎', priceUsd: 1.80 },
        { id: 'mlbb-172', name: '172 Diamonds', amount: '172 💎', priceUsd: 3.50, popular: true },
        { id: 'mlbb-257', name: '257 Diamonds', amount: '257 💎', priceUsd: 5.00 },
        { id: 'mlbb-706', name: '706 Diamonds', amount: '706 💎', priceUsd: 13.50 },
      ],
    },
    {
      id: 'codm',
      name: 'Call of Duty: Mobile (CP)',
      region: 'Activision Global',
      image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=60',
      badge: 'Points CP',
      uidLabel: 'Player ID (UID)',
      uidPlaceholder: 'Ex: 674589230129',
      packages: [
        { id: 'cod-80', name: '80 CP', amount: '80 CP', priceUsd: 1.30 },
        { id: 'cod-420', name: '420 CP (Pass Combat)', amount: '420 CP', priceUsd: 5.50, popular: true },
        { id: 'cod-880', name: '880 CP', amount: '880 CP', priceUsd: 11.00 },
      ],
    },
    {
      id: 'roblox',
      name: 'Roblox (Robux)',
      region: 'Global',
      image: 'https://images.unsplash.com/photo-1612287233202-0e95bc7ee077?w=500&auto=format&fit=crop&q=60',
      badge: 'Robux Card',
      uidLabel: 'Pseudo Roblox (Username)',
      uidPlaceholder: 'Ex: AlexPlayer_99',
      packages: [
        { id: 'rbx-400', name: '400 Robux', amount: '400 R$', priceUsd: 5.50 },
        { id: 'rbx-800', name: '800 Robux', amount: '800 R$', priceUsd: 11.00, popular: true },
        { id: 'rbx-1700', name: '1,700 Robux', amount: '1,700 R$', priceUsd: 22.00 },
      ],
    },
  ];

  const currentGame = games.find((g) => g.id === selectedGameId) || games[0];
  const currentPackage = currentGame.packages.find((p) => p.id === selectedPackageId) || currentGame.packages[0];

  const handleVerifyUid = () => {
    if (!playerUid.trim()) {
      alert('Veuillez entrer votre ID de joueur (UID).');
      return;
    }
    setIsVerifyingUid(true);
    setVerifiedNickname(null);
    setTimeout(() => {
      setIsVerifyingUid(false);
      // Realistic simulation based on player ID
      const pseudoList = ['Shadow_HT', 'KingSniper_509', 'GhostPro_Ayiti', 'AlphaWolf', 'CaribbeanGamer'];
      const randomNick = pseudoList[Math.floor(Math.random() * pseudoList.length)];
      setVerifiedNickname(`${randomNick} (Niv. ${Math.floor(Math.random() * 45 + 25)})`);
    }, 800);
  };

  const handleCheckoutTopUp = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!playerUid.trim()) {
      alert('Veuillez renseigner votre UID / ID de jeu.');
      return;
    }

    const price = currentPackage.priceUsd;
    const currentBalance = wallet?.balance || 0;

    if (currentBalance < price) {
      alert(`Solde insuffisant ($${currentBalance.toFixed(2)}). Ce pack coûte $${price.toFixed(2)}. Veuillez recharger votre portefeuille dans votre Dashboard.`);
      onNavigate('/dashboard');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      // Process transaction via wallet
      const res = walletService.purchaseItem(
        currentUser.id,
        currentUser.email,
        price,
        `Top-Up ${currentGame.name} - ${currentPackage.amount} (UID: ${playerUid})`
      );

      setIsProcessing(false);

      if (res.success) {
        setOrderSuccess({
          orderId: `XG-TOPUP-${Math.floor(100000 + Math.random() * 900000)}`,
          game: currentGame.name,
          package: currentPackage.name,
          amount: currentPackage.amount,
          uid: playerUid,
          nickname: verifiedNickname || 'Vérifié',
          price: price,
          date: new Date().toLocaleString(),
        });
      } else {
        alert(res.message);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase">
              <Zap className="w-3.5 h-3.5" />
              Recharge Automatique & Instantanée 24/7
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Top-Up Jeux Vidéo <span className="text-amber-400">& Diamants</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Free Fire (Latam / US), PUBG UC, Mobile Legends, COD Mobile & Roblox. Recharge directe par UID.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && wallet && (
              <div className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span className="text-neutral-400">Votre Solde :</span>
                <span className="text-white font-mono font-bold">${wallet.balance.toFixed(2)}</span>
              </div>
            )}
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-amber-500 text-amber-400 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Autre jeu ? Dites-le nous !</span>
            </button>
          </div>
        </div>

        {orderSuccess ? (
          /* SUCCESS SCREEN */
          <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Recharge Envoyée avec Succès !</h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Les crédits ont été injectés directement sur votre compte de jeu.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-neutral-950/80 border border-neutral-800 rounded-2xl p-5 text-left text-xs space-y-2.5 font-mono">
              <div className="flex justify-between border-b border-neutral-850 pb-2">
                <span className="text-neutral-500">Réf. Commande :</span>
                <span className="text-amber-400 font-bold">{orderSuccess.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Jeu :</span>
                <span className="text-white">{orderSuccess.game}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Pack :</span>
                <span className="text-white font-bold">{orderSuccess.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">UID Joueur :</span>
                <span className="text-emerald-400 font-bold">{orderSuccess.uid}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-850 pt-2">
                <span className="text-neutral-500">Montant Débité :</span>
                <span className="text-white font-black">${orderSuccess.price.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setPlayerUid('');
                  setVerifiedNickname(null);
                }}
                className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs cursor-pointer shadow-md"
              >
                Faire une autre recharge
              </button>
              <button
                onClick={() => onNavigate('/dashboard')}
                className="py-3 px-6 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Voir dans mon Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* STEP 1: SELECT GAME */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center">1</span>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Choisissez votre Jeu</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      setSelectedGameId(game.id);
                      setSelectedPackageId(game.packages[0].id);
                      setVerifiedNickname(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedGameId === game.id
                        ? 'bg-neutral-900 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/70'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-2 bg-neutral-950">
                      <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-amber-400 block mb-0.5">{game.badge}</span>
                      <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">{game.name}</h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: ENTER UID & VERIFY */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center">2</span>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Identifiant Joueur</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    {currentGame.uidLabel} <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={currentGame.uidPlaceholder}
                      value={playerUid}
                      onChange={(e) => {
                        setPlayerUid(e.target.value);
                        setVerifiedNickname(null);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                    />
                    {verifiedNickname && (
                      <div className="absolute right-3 top-3 text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{verifiedNickname}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleVerifyUid}
                    disabled={isVerifyingUid || !playerUid.trim()}
                    className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-amber-400 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isVerifyingUid ? 'Vérification...' : '✓ Vérifier le Joueur'}
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 3: SELECT DIAMOND / UC PACK */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center">3</span>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Choisissez la Quantité</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {currentGame.packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPackageId === pkg.id
                        ? 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-amber-500 shadow-xl shadow-amber-500/10'
                        : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-amber-500 text-black px-2 py-0.5 rounded-full">
                        Populaire
                      </span>
                    )}
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-400">{pkg.name}</span>
                      <div className="text-lg font-black text-white font-mono">{pkg.amount}</div>
                      {pkg.bonus && (
                        <span className="text-[10px] text-emerald-400 font-semibold">{pkg.bonus}</span>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-850 flex items-baseline justify-between">
                      <span className="text-base font-black text-amber-400 font-mono">
                        ${pkg.priceUsd.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-normal">
                        ~{(pkg.priceUsd * 132).toLocaleString()} HTG
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 4: RECAP & INSTANT CHECKOUT */}
            <div className="bg-neutral-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">Récapitulatif de recharge</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {currentGame.name} — <span className="text-amber-400">{currentPackage.amount}</span>
                </div>
                <div className="text-xs text-neutral-400">
                  Compte cible : <strong className="text-white font-mono">{playerUid || 'Non renseigné'}</strong> 
                  {verifiedNickname && <span className="text-emerald-400 ml-1">({verifiedNickname})</span>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="text-center md:text-right">
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    ${currentPackage.priceUsd.toFixed(2)} <span className="text-xs text-neutral-400">USD</span>
                  </div>
                  <div className="text-xs text-amber-400/90 font-medium">
                    = {(currentPackage.priceUsd * 132).toLocaleString()} Gourdes
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckoutTopUp}
                  disabled={isProcessing}
                  className="w-full sm:w-auto py-4 px-8 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black rounded-2xl text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>{isProcessing ? 'Envoi en cours...' : 'Payer & Recharger Direct'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="gaming"
      />
    </div>
  );
};
