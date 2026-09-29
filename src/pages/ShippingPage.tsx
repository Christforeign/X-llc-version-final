import React, { useState } from 'react';
import { Truck, Navigation, Search, CheckCircle, MapPin, Calculator, ShieldCheck, ArrowRight, UserPlus, HelpCircle } from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { Shipment, ShippingZone } from '../models/types';
import { TrackingMap } from '../components/TrackingMap';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface ShippingPageProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
}

export const ShippingPage: React.FC<ShippingPageProps> = ({ onOpenAuth, onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'track' | 'create'>('track');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(db.getShipments()[0] || null);

  // Form State
  const [zone, setZone] = useState<ShippingZone>('USA');
  const [senderName, setSenderName] = useState(currentUser?.name || 'Miami Distribution Corp');
  const [senderAddress, setSenderAddress] = useState('8200 NW 27th St, Doral, FL 33122, USA');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [weight, setWeight] = useState<number>(3.5);
  const [originCountry, setOriginCountry] = useState('United States (Miami Hub)');
  const [destinationCountry, setDestinationCountry] = useState('Dominican Republic (Santo Domingo)');
  const [assignedDriverId, setAssignedDriverId] = useState('drv-01');
  const [createdSuccess, setCreatedSuccess] = useState<Shipment | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const drivers = db.getDrivers();

  // Pricing formula: base rate + rate per kg depending on zone
  const calculateRate = (z: ShippingZone, w: number): number => {
    let base = 15;
    let perKg = 8;
    if (z === 'local') {
      base = 8;
      perKg = 3.5;
    } else if (z === 'RD') {
      base = 12;
      perKg = 5.0;
    } else if (z === 'USA') {
      base = 20;
      perKg = 9.5;
    }
    return Math.round((base + w * perKg) * 100) / 100;
  };

  const calculatedPrice = calculateRate(zone, weight);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const all = db.getShipments();
    const found = all.find((s) => s.trackingNumber.toLowerCase() === searchQuery.trim().toLowerCase());
    if (found) {
      setSelectedShipment(found);
    } else {
      alert(`No active shipment found with tracking code: ${searchQuery}`);
    }
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!recipientName.trim() || !recipientAddress.trim()) {
      alert('Please fill in complete recipient details.');
      return;
    }

    const driver = drivers.find((d) => d.id === assignedDriverId);

    // Initial coordinates based on zone
    const coords =
      zone === 'USA'
        ? { lat: 25.7617, lng: -80.1918 }
        : zone === 'RD'
        ? { lat: 18.4861, lng: -69.9312 }
        : { lat: 18.5392, lng: -72.335 };

    const newShipment = db.createShipment({
      userId: currentUser.id,
      userEmail: currentUser.email,
      senderName,
      senderAddress,
      recipientName,
      recipientAddress,
      originCountry,
      destinationCountry,
      currentZone: zone,
      weight,
      calculatedPrice,
      status: 'registered',
      assignedDriverId,
      assignedDriver: driver,
      coordinates: coords,
    });

    setCreatedSuccess(newShipment);
    setSelectedShipment(newShipment);
    setActiveTab('track');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Cross-Border Logistics & Multi-Modal Freight</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Cargo Dispatch & Satellite Route Tracker
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 text-blue-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Autre besoin cargo ? Dites-le nous !</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'track' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Tracking
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'create' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              + Register New Consignment
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Tracking View */}
      {activeTab === 'track' && (
        <div className="space-y-8">
          {/* Tracking Search Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter Tracking Number (e.g. XG-TRK-78219 or XG-TRK-99014)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
              >
                Track Package
              </button>
            </form>
          </div>

          {/* Render Active Tracking Map Component */}
          {selectedShipment ? (
            <TrackingMap
              shipment={selectedShipment}
              canEdit={currentUser?.role === 'admin' || currentUser?.role === 'staff'}
              onUpdateStatus={(newStatus) => {
                db.updateShipment(selectedShipment.id, { status: newStatus });
                setSelectedShipment({ ...selectedShipment, status: newStatus });
              }}
            />
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
              <p>No shipment selected. Search with an active tracking code above.</p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Parcel Creation Form */}
      {activeTab === 'create' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-white">
          <form onSubmit={handleCreateShipment} className="space-y-8">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-white">Create Freight Consignment & Label</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generates unique airway barcode, calculates automated tariffs, and dispatches driver route.
                </p>
              </div>
              <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Calculated Tariff</p>
                <p className="text-base font-black text-emerald-400">${calculatedPrice.toFixed(2)} USD</p>
              </div>
            </div>

            {/* Zone Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Transport Corridor</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'USA', title: 'USA International Hub', desc: 'Miami Doral Bonded Terminal -> Caribbean' },
                  { key: 'RD', title: 'Dominican Republic', desc: 'Santo Domingo / Santiago Regional Corridor' },
                  { key: 'local', title: 'Local Intra-City Courier', desc: 'Same-day bonded express delivery' },
                ].map((z) => (
                  <button
                    key={z.key}
                    type="button"
                    onClick={() => {
                      setZone(z.key as ShippingZone);
                      if (z.key === 'USA') {
                        setOriginCountry('United States (Miami FL)');
                        setDestinationCountry('Haiti / Dominican Rep');
                      } else if (z.key === 'RD') {
                        setOriginCountry('Santiago, RD');
                        setDestinationCountry('Santo Domingo, RD');
                      } else {
                        setOriginCountry('Local Depot');
                        setDestinationCountry('Local Destination');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      zone === z.key
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{z.title}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{z.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Consignor & Consignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender */}
              <div className="space-y-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Shipper / Consignor</h3>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Sender Name / Entity</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Origin Address / Terminal</label>
                  <input
                    type="text"
                    required
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recipient / Consignee</h3>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marie Carmel Joseph"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Delivery Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 48 Boulevard du 15 Octobre, Tabarre"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Weight & Driver Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Package Gross Weight (in Kilograms)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="1000"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    ≈ {(weight * 2.204).toFixed(1)} lbs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Assigned Logistics Driver / Vehicle
                </label>
                <select
                  value={assignedDriverId}
                  onChange={(e) => setAssignedDriverId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.vehicle} ({d.plate})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Automatic airway tracking number and customs documentation generated upon submission.
              </span>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <span>Dispatch Consignment (${calculatedPrice.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Universal Request Modal */}
      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="shipping"
      />
    </div>
  );
};
