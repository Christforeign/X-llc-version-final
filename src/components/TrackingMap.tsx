import React from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, Navigation, ArrowRight, UserCheck } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../models/types';

interface TrackingMapProps {
  shipment: Shipment;
  onUpdateStatus?: (newStatus: ShipmentStatus) => void;
  canEdit?: boolean;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({ shipment, onUpdateStatus, canEdit }) => {
  const steps: { status: ShipmentStatus; label: string; desc: string }[] = [
    { status: 'registered', label: 'Registered', desc: 'Package weighed, scanned & assigned' },
    { status: 'in-transit', label: 'In Transit', desc: 'Carrier en route through hub corridor' },
    { status: 'arrived', label: 'Arrived at Hub', desc: 'Customs cleared at regional terminal' },
    { status: 'delivered', label: 'Delivered', desc: 'Driver handover & signature confirmed' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === shipment.status);

  // Approximate relative positioning on a stylized Caribbean / North American vector map canvas (600x340)
  // Miami: ~180, 80
  // Santiago RD: ~360, 200
  // Santo Domingo RD: ~390, 240
  // Port-au-Prince: ~320, 240
  const hubs: Record<string, { x: number; y: number; name: string }> = {
    MIA: { x: 140, y: 70, name: 'Miami Hub (FL, USA)' },
    PAP: { x: 300, y: 220, name: 'Port-au-Prince Hub (HT)' },
    SDQ: { x: 420, y: 230, name: 'Santo Domingo Depot (RD)' },
    STI: { x: 380, y: 180, name: 'Santiago Distribution (RD)' },
  };

  // Determine source and target hubs based on shipment properties
  const isRD = shipment.currentZone === 'RD' || shipment.destinationCountry.includes('Dominican');
  const isUSA = shipment.currentZone === 'USA' || shipment.originCountry.includes('United States');
  
  const startHub = isUSA ? hubs.MIA : hubs.STI;
  const endHub = isRD ? hubs.SDQ : hubs.PAP;

  // Determine current active package marker coordinate along route
  const progressRatio = currentStepIndex === 0 ? 0.05 : currentStepIndex === 1 ? 0.5 : currentStepIndex === 2 ? 0.85 : 1.0;
  const currentMarkerX = startHub.x + (endHub.x - startHub.x) * progressRatio;
  const currentMarkerY = startHub.y + (endHub.y - startHub.y) * progressRatio;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 text-white shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Active Consignment
            </span>
            <span className="font-mono text-xs font-bold text-slate-300">{shipment.trackingNumber}</span>
          </div>
          <h3 className="text-sm font-semibold text-white mt-1">
            {shipment.originCountry} &rarr; {shipment.destinationCountry}
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Estimated Weight</p>
            <p className="text-xs font-bold text-cyan-400">{shipment.weight} kg ({Math.round(shipment.weight * 2.204)} lbs)</p>
          </div>
          <div className="text-right border-l border-slate-800 pl-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Zone Tariff</p>
            <p className="text-xs font-bold text-emerald-400">${shipment.calculatedPrice.toFixed(2)} USD</p>
          </div>
        </div>
      </div>

      {/* Interactive Vector GIS Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-64 sm:h-72">
        {/* Stylized GIS Grid & Radar Background */}
        <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Radar Circles */}
          <circle cx="300" cy="160" r="140" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="300" cy="160" r="80" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

          {/* Flight / Road Corridor Curve */}
          <path
            d={`M ${startHub.x} ${startHub.y} Q 280 100 ${endHub.x} ${endHub.y}`}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />

          {/* Regional Hub Pins */}
          {Object.entries(hubs).map(([key, h]) => (
            <g key={key}>
              <circle cx={h.x} cy={h.y} r="5" fill="#3b82f6" />
              <circle cx={h.x} cy={h.y} r="10" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
              <text x={h.x + 10} y={h.y + 4} fill="#94a3b8" fontSize="10" fontWeight="500">
                {h.name}
              </text>
            </g>
          ))}

          {/* Current Animated Consignment Position Marker */}
          <g transform={`translate(${currentMarkerX}, ${currentMarkerY})`}>
            <circle r="18" fill="#38bdf8" opacity="0.2" className="animate-ping" />
            <circle r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <circle r="3" fill="#ffffff" />
          </g>
        </svg>

        {/* Live Coordinates Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-cyan-300 flex items-center space-x-2">
          <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>GPS: {shipment.coordinates.lat.toFixed(4)}° N, {Math.abs(shipment.coordinates.lng).toFixed(4)}° W</span>
        </div>

        {/* Driver Assigned Card Overlay */}
        {shipment.assignedDriver && (
          <div className="absolute bottom-3 right-3 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 flex items-center space-x-3 shadow-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Assigned Driver</p>
              <p className="font-semibold text-white">{shipment.assignedDriver.name}</p>
              <p className="text-[10px] text-slate-400">{shipment.assignedDriver.vehicle} • {shipment.assignedDriver.plate}</p>
            </div>
          </div>
        )}
      </div>

      {/* Milestone Progress Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={step.status}
              className={`p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                  : isDone
                  ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-blue-500 text-white animate-pulse'
                      : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className="text-xs font-semibold">{step.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Admin / Staff State Modulator */}
      {canEdit && onUpdateStatus && (
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-medium text-amber-400 flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Driver / Dispatch Controls:</span>
          </span>
          <div className="flex items-center space-x-1.5">
            {(['registered', 'in-transit', 'arrived', 'delivered'] as ShipmentStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => onUpdateStatus(s)}
                className={`px-2.5 py-1 rounded text-xs font-medium capitalize cursor-pointer transition-colors ${
                  shipment.status === s
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Checkpoints Timeline */}
      <div className="pt-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Consignment Log History</span>
        </h4>
        <div className="space-y-2">
          {shipment.checkpointHistory.map((chk, i) => (
            <div key={i} className="flex items-start space-x-3 text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{chk.location}</span>
                  <span className="text-[10px] text-slate-400">{new Date(chk.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">{chk.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
