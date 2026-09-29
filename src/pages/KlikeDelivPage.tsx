import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Car, 
  Package, 
  Utensils, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Phone, 
  UserPlus, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  FileText, 
  Upload, 
  Sparkles,
  HelpCircle,
  DollarSign
} from 'lucide-react';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { walletService } from '../services/walletService';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface KlikeDelivPageProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const KlikeDelivPage: React.FC<KlikeDelivPageProps> = ({ onNavigate, onOpenAuth }) => {
  const currentUser = authService.getCurrentUser();
  const wallet = currentUser ? db.getWallet(currentUser.id) : null;
  const [activeTab, setActiveTab] = useState<'delivery' | 'ride' | 'driver_signup'>('delivery');
  const [showRequestModal, setShowRequestModal] = useState(false);

  // KlikeDeliv Delivery State
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [packageType, setPackageType] = useState<'package' | 'food' | 'grocery'>('package');
  const [packageDesc, setPackageDesc] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliverySuccess, setDeliverySuccess] = useState<any | null>(null);

  // X-Drive Ride State
  const [ridePickup, setRidePickup] = useState('');
  const [rideDestination, setRideDestination] = useState('');
  const [vehicleType, setVehicleType] = useState<'moto' | 'comfort' | 'suv'>('moto');
  const [passengerPhone, setPassengerPhone] = useState(currentUser?.email || '');
  const [rideSuccess, setRideSuccess] = useState<any | null>(null);

  // Driver Signup State
  const [driverName, setDriverName] = useState(currentUser?.name || '');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverCity, setDriverCity] = useState('Port-au-Prince');
  const [driverVehicle, setDriverVehicle] = useState('moto');
  const [driverPlate, setDriverPlate] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
  const [driverSubmitted, setDriverSubmitted] = useState(false);

  // Price calculations
  const deliveryEstimatedPrice = packageType === 'food' ? 4.00 : packageType === 'grocery' ? 5.50 : 3.50;
  const rideEstimatedPrice = vehicleType === 'moto' ? 2.50 : vehicleType === 'comfort' ? 7.00 : 14.00;

  const handleBookDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!pickupAddress.trim() || !dropoffAddress.trim()) {
      alert('Veuillez renseigner le point de départ et le point de livraison.');
      return;
    }

    const currentBal = wallet?.balance || 0;
    if (currentBal < deliveryEstimatedPrice) {
      alert(`Solde insuffisant ($${currentBal.toFixed(2)}). Cette course coûte $${deliveryEstimatedPrice.toFixed(2)}. Veuillez recharger votre portefeuille.`);
      onNavigate('/dashboard');
      return;
    }

    walletService.purchaseItem(
      currentUser.id,
      currentUser.email,
      deliveryEstimatedPrice,
      `Course KlikeDeliv (${packageType === 'food' ? 'Nourriture' : 'Colis'}) : ${pickupAddress} -> ${dropoffAddress}`
    );

    setDeliverySuccess({
      trackingId: `KD-${Math.floor(100000 + Math.random() * 900000)}`,
      pickup: pickupAddress,
      dropoff: dropoffAddress,
      type: packageType,
      cost: deliveryEstimatedPrice,
      recipient: recipientName || 'Destinataire',
      phone: recipientPhone || 'Non spécifié'
    });
  };

  const handleBookRide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!ridePickup.trim() || !rideDestination.trim()) {
      alert('Veuillez préciser le lieu de départ et d\'arrivée.');
      return;
    }

    const currentBal = wallet?.balance || 0;
    if (currentBal < rideEstimatedPrice) {
      alert(`Solde insuffisant ($${currentBal.toFixed(2)}). Cette course coûte $${rideEstimatedPrice.toFixed(2)}. Veuillez recharger votre portefeuille.`);
      onNavigate('/dashboard');
      return;
    }

    walletService.purchaseItem(
      currentUser.id,
      currentUser.email,
      rideEstimatedPrice,
      `Réservation X-Drive (${vehicleType.toUpperCase()}) : ${ridePickup} -> ${rideDestination}`
    );

    setRideSuccess({
      rideId: `DRV-${Math.floor(100000 + Math.random() * 900000)}`,
      pickup: ridePickup,
      destination: rideDestination,
      vehicle: vehicleType === 'moto' ? 'Moto-Taxi Express' : vehicleType === 'comfort' ? 'Berline Confort Climatisée' : 'SUV VIP Sécurisé',
      price: rideEstimatedPrice,
      driverAssigned: 'Jean-Marc D. (⭐ 4.9 - Moto TVS Noire)'
    });
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('xgroup_driver_applications') || '[]');
      existing.unshift({
        id: `DRV-APP-${Date.now()}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        name: driverName,
        phone: driverPhone,
        city: driverCity,
        vehicle: driverVehicle,
        plate: driverPlate,
        license: driverLicenseNumber,
        date: new Date().toISOString(),
        status: 'En cours d\'examen'
      });
      localStorage.setItem('xgroup_driver_applications', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setDriverSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase">
              <Truck className="w-3.5 h-3.5" />
              Transport, Colis & VTC Haïti
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              KlikeDeliv <span className="text-amber-400">& X-Drive Chauffeur</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Livraison locale de colis point A vers B, plats de restaurant, courses et réservation de chauffeurs style Uber.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && wallet && (
              <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span className="text-neutral-400">Solde :</span>
                <span className="text-white font-mono font-bold">${wallet.balance.toFixed(2)}</span>
              </div>
            )}
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-amber-500 text-amber-400 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Autre besoin ? Dites-le nous !</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>KlikeDeliv (Colis & Repas)</span>
          </button>

          <button
            onClick={() => setActiveTab('ride')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ride'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>X-Drive (Réserver une Course)</span>
          </button>

          <button
            onClick={() => setActiveTab('driver_signup')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'driver_signup'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Devenir Chauffeur / Livreur</span>
          </button>
        </div>

        {/* TAB 1: KLIKEDELIV */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            {deliverySuccess ? (
              <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">Livraison Commandée avec Succès !</h2>
                  <p className="text-xs text-neutral-400">
                    Un livreur KlikeDeliv à proximité est assigné à votre course.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-neutral-950/80 border border-neutral-800 rounded-2xl p-5 text-left text-xs space-y-2.5 font-mono">
                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-500">Numéro Suivi :</span>
                    <span className="text-amber-400 font-bold">{deliverySuccess.trackingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Départ (A) :</span>
                    <span className="text-white">{deliverySuccess.pickup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Arrivée (B) :</span>
                    <span className="text-white">{deliverySuccess.dropoff}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Destinataire :</span>
                    <span className="text-emerald-400 font-bold">{deliverySuccess.recipient} ({deliverySuccess.phone})</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-850 pt-2">
                    <span className="text-neutral-500">Montant Débité :</span>
                    <span className="text-white font-black">${deliverySuccess.cost.toFixed(2)} USD (~{(deliverySuccess.cost * 132).toLocaleString()} HTG)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDeliverySuccess(null);
                    setPickupAddress('');
                    setDropoffAddress('');
                  }}
                  className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Commander une autre livraison
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookDelivery} className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Livraison Point A vers Point B</h3>
                    <p className="text-xs text-neutral-400">
                      Nous prenons votre paquet n'importe où et le livrons à destination en moins de 45 minutes.
                    </p>
                  </div>
                </div>

                {/* Type de colis */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300">Que voulez-vous faire livrer ?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPackageType('package')}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        packageType === 'package'
                          ? 'bg-neutral-900 border-amber-500 text-white'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Package className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Colis / Documents</div>
                        <div className="text-[10px] text-neutral-500">Papiers, clés, petits paquets ($3.50)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPackageType('food')}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        packageType === 'food'
                          ? 'bg-neutral-900 border-amber-500 text-white'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Utensils className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Repas / Restaurant</div>
                        <div className="text-[10px] text-neutral-500">Livraison nourriture & boisson ($4.00)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPackageType('grocery')}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        packageType === 'grocery'
                          ? 'bg-neutral-900 border-amber-500 text-white'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Truck className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Courses & Marché</div>
                        <div className="text-[10px] text-neutral-500">Achats supermarché & boutique ($5.50)</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Adresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      Lieu de Récupération (Point A) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Delmas 33, Restaurant La Taverne, Pétion-Ville..."
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                      Lieu de Livraison (Point B) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Tabarre 48, Rue Rebecca, Carrefour..."
                      value={dropoffAddress}
                      onChange={(e) => setDropoffAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Destinataire & description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Nom du destinataire</label>
                    <input
                      type="text"
                      placeholder="Nom de la personne qui reçoit"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Téléphone du destinataire</label>
                    <input
                      type="tel"
                      placeholder="+509 XXXX XXXX"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">Instructions particulières pour le coursier</label>
                  <input
                    type="text"
                    placeholder="Ex: Appeler avant d'arriver, sonner à la porte bleue..."
                    value={packageDesc}
                    onChange={(e) => setPackageDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Total & Submit */}
                <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-neutral-400">Tarif estimé de la course :</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      ${deliveryEstimatedPrice.toFixed(2)} USD <span className="text-xs text-neutral-400">(~{(deliveryEstimatedPrice * 132).toLocaleString()} HTG)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-8 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    Commander la Livraison Maintenant
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: X-DRIVE CHAUFFEUR VTC */}
        {activeTab === 'ride' && (
          <div className="space-y-6">
            {rideSuccess ? (
              <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">Chauffeur X-Drive Réservé !</h2>
                  <p className="text-xs text-neutral-400">
                    Votre chauffeur est en route pour venir vous récupérer.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-neutral-950/80 border border-neutral-800 rounded-2xl p-5 text-left text-xs space-y-2.5 font-mono">
                  <div className="flex justify-between border-b border-neutral-850 pb-2">
                    <span className="text-neutral-500">Course ID :</span>
                    <span className="text-amber-400 font-bold">{rideSuccess.rideId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Véhicule :</span>
                    <span className="text-white font-bold">{rideSuccess.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Chauffeur Assigné :</span>
                    <span className="text-emerald-400 font-bold">{rideSuccess.driverAssigned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Départ :</span>
                    <span className="text-white">{rideSuccess.pickup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Destination :</span>
                    <span className="text-white">{rideSuccess.destination}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-850 pt-2">
                    <span className="text-neutral-500">Prix Course :</span>
                    <span className="text-white font-black">${rideSuccess.price.toFixed(2)} USD (~{(rideSuccess.price * 132).toLocaleString()} HTG)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRideSuccess(null);
                    setRidePickup('');
                    setRideDestination('');
                  }}
                  className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Réserver un autre trajet
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookRide} className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">X-Drive : Réserver un Chauffeur style Uber</h3>
                    <p className="text-xs text-neutral-400">
                      Déplacez-vous en toute sérénité avec nos chauffeurs et mototaxis certifiés en Haïti.
                    </p>
                  </div>
                </div>

                {/* Choix du véhicule */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300">Catégorie de véhicule</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setVehicleType('moto')}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        vehicleType === 'moto'
                          ? 'bg-neutral-900 border-amber-500 text-white'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Navigation className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Moto-Taxi Express</div>
                        <div className="text-[10px] text-neutral-500">Idéal pour le trafic ($2.50)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVehicleType('comfort')}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        vehicleType === 'comfort'
                          ? 'bg-neutral-900 border-amber-500 text-white'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Car className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Berline Confort</div>
                        <div className="text-[10px] text-neutral-500">Climatisée 4 places ($7.00)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVehicleType('suv')}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        vehicleType === 'suv'
                          ? 'bg-neutral-900 border-amber-500 text-white'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">SUV VIP Blindé / Sécurisé</div>
                        <div className="text-[10px] text-neutral-500">Véhicule haute sécurité ($14.00)</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Lieux */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Lieu de départ (Où êtes-vous ?)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Aéroport Toussaint Louverture, Pétion-Ville..."
                      value={ridePickup}
                      onChange={(e) => setRidePickup(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Destination (Où allez-vous ?)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Hôtel Karibe, Delmas 75, Montagne Noire..."
                      value={rideDestination}
                      onChange={(e) => setRideDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">Numéro de contact du passager</label>
                  <input
                    type="tel"
                    required
                    placeholder="+509 XXXX XXXX"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Total & Submit */}
                <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-neutral-400">Tarif estimé de la course :</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      ${rideEstimatedPrice.toFixed(2)} USD <span className="text-xs text-neutral-400">(~{(rideEstimatedPrice * 132).toLocaleString()} HTG)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-8 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    Confirmer & Réserver le Chauffeur
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: DEVENIR CHAUFFEUR / LIVREUR */}
        {activeTab === 'driver_signup' && (
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Rejoignez la flotte X-Drive & KlikeDeliv</h3>
                <p className="text-xs text-neutral-400">
                  Gagnez de l'argent chaque jour en devenant chauffeur VTC ou coursier partenaire en Haïti.
                </p>
              </div>
            </div>

            {driverSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-white">Dossier Chauffeur Envoyé !</h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Merci <strong>{driverName}</strong>. Notre équipe va examiner vos documents et vous contacter sur le <strong>{driverPhone}</strong> sous 24h pour finaliser votre activation.
                </p>
                <button
                  onClick={() => setDriverSubmitted(false)}
                  className="py-2.5 px-5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs"
                >
                  Modifier ma candidature
                </button>
              </div>
            ) : (
              <form onSubmit={handleDriverSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Nom Complet <span className="text-amber-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Nom et Prénom"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Téléphone WhatsApp <span className="text-amber-400">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="+509 XXXX XXXX"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Ville / Zone d'opération</label>
                    <select
                      value={driverCity}
                      onChange={(e) => setDriverCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Port-au-Prince">Port-au-Prince & Environs</option>
                      <option value="Petion-Ville">Pétion-Ville</option>
                      <option value="Delmas">Delmas / Tabarre</option>
                      <option value="Cap-Haitien">Cap-Haïtien</option>
                      <option value="Les Cayes">Les Cayes</option>
                      <option value="Saint-Domingue">Saint-Domingue (RD)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Type de Véhicule</label>
                    <select
                      value={driverVehicle}
                      onChange={(e) => setDriverVehicle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="moto">Moto (Livraison & Course)</option>
                      <option value="car_sedan">Voiture Berline</option>
                      <option value="car_suv">SUV / 4x4</option>
                      <option value="van">Camionnette / Pickup Cargo</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Numéro d'immatriculation (Plaque)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: AA-12345"
                      value={driverPlate}
                      onChange={(e) => setDriverPlate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">Numéro Permis de Conduire ou NIF</label>
                  <input
                    type="text"
                    required
                    placeholder="Numéro officiel du permis"
                    value={driverLicenseNumber}
                    onChange={(e) => setDriverLicenseNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    Soumettre ma Candidature de Chauffeur
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>

      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="delivery"
      />
    </div>
  );
};
