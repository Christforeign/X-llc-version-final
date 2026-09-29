import { db } from '../services/db';
import { ModuleFlags } from '../models/types';

export interface ModuleMetadata {
  id: keyof ModuleFlags;
  title: string;
  category: string;
  description: string;
  publicRoute: string;
}

export const MODULE_CATALOG: ModuleMetadata[] = [
  {
    id: 'gsm',
    title: 'Services GSM & Firmware',
    category: 'Engineering',
    description: 'Remote FRP bypass, factory unlock codes, tool licenses, and board repair intake.',
    publicRoute: '/gsm',
  },
  {
    id: 'shipping',
    title: 'Shipping & Freight Logistics',
    category: 'Logistics',
    description: 'Cross-border USA, Dominican Republic & Caribbean parcel calculator and GPS tracking.',
    publicRoute: '/shipping',
  },
  {
    id: 'marketplace',
    title: 'Marketplace Privé',
    category: 'Commerce',
    description: 'Wholesale smartphones, diagnostic hardware, software licenses and freight bays.',
    publicRoute: '/marketplace',
  },
  {
    id: 'exchange',
    title: 'Module Exchange & P2P Swaps',
    category: 'Trade',
    description: 'Peer-to-peer item swapping with cash balance adjustments and locked internal Escrow.',
    publicRoute: '/exchange',
  },
  {
    id: 'games',
    title: 'Module Jeux & Wager Pools',
    category: 'Entertainment',
    description: 'Cyber dice roller and card duels with double-entry wallet wagering and anti-fraud monitoring.',
    publicRoute: '/games',
  },
  {
    id: 'learning',
    title: 'Apprentissage (Academy)',
    category: 'Education',
    description: 'Technical video masterclasses, interactive quizzes, and dynamic verifiable certificates.',
    publicRoute: '/learning',
  },
  {
    id: 'creation',
    title: 'Module Création & Design',
    category: 'Creative',
    description: 'Custom logo design, video production, and UI briefs with automated invoice generation.',
    publicRoute: '/request-design',
  },
  {
    id: 'support',
    title: 'Support Tickets & Live Chat',
    category: 'Customer Service',
    description: 'Multi-category ticket intake and direct staff-to-client encrypted chat pipelines.',
    publicRoute: '/contact',
  },
];

export function isModuleEnabled(moduleKey: keyof ModuleFlags): boolean {
  const flags = db.getModuleFlags();
  return flags[moduleKey] ?? true;
}

export function setModuleEnabled(moduleKey: keyof ModuleFlags, enabled: boolean): void {
  db.updateModuleFlag(moduleKey, enabled);
}

