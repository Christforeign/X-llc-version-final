// Core Data Models for XGROUP LLC Enterprise Platform

export type UserRole = 'admin' | 'staff' | 'client' | 'partenaire';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  phone?: string;
  role: UserRole;
  permissions: string[];
  createdAt: string;
  lastLogin: string;
  avatar?: string;
}

export interface ConnectionsHistory {
  id: string;
  userId: string;
  userEmail: string;
  ipAddress: string;
  timestamp: string;
  userAgent: string;
  location?: string;
}

export interface RoleApplication {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestedRole: UserRole;
  experience: string;
  motivation: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export type LedgerType = 'credit' | 'debit' | 'escrow' | 'escrow_release' | 'fee';

export interface LedgerEntry {
  txId: string;
  type: LedgerType;
  amount: number;
  feeAmount: number;
  module: 'deposit' | 'withdrawal' | 'transfer' | 'marketplace' | 'exchange' | 'games' | 'gsm' | 'shipping' | 'creation' | 'admin_override' | 'education' | 'delivery';
  description: string;
  timestamp: string;
  referenceId?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  escrowBalance: number;
  ledger: LedgerEntry[];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  type: 'product' | 'service';
  price: number;
  category: 'smartphones' | 'hardware-tools' | 'software-keys' | 'logistics' | 'services' | 'gaming' | 'gift-cards' | 'crypto-services' | 'entertainment' | 'transfer';
  description: string;
  images: string[];
  createdBy: string;
  sellerName: string;
  visibleToRoles: UserRole[];
  status: 'active' | 'out_of_stock' | 'draft' | 'archived';
  stock?: number;
  rating?: number;
  isDigital?: boolean; // true = numérique, false = physique
  customFields?: string[]; // e.g. ['Email', 'ID', 'Redeem Code'] configured by admin
}

export interface CartItem {
  item: MarketplaceItem;
  quantity: number;
}

export interface OrderItem {
  itemId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface PaymentProof {
  method: 'card' | 'crypto' | 'wire' | 'wallet';
  cardLast4?: string;
  cardholderName?: string;
  cryptoNetwork?: string;
  cryptoTxHash?: string;
  proofImageUrl?: string;
  referenceNumber?: string;
  submittedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'wallet' | 'card' | 'crypto' | 'wire';
  paymentProof?: PaymentProof;
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  invoiceUrl?: string;
  shippingAddress?: string;
}

export interface RoleApplication {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestedRole: UserRole;
  experience: string;
  motivation: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

export interface ExchangeItem {
  id: string;
  name: string;
  condition: 'brand_new' | 'excellent' | 'good' | 'fair';
  estimatedValue: number;
  description: string;
  imageUrl?: string;
}

export interface ExchangeProposal {
  id: string;
  tradeNumber: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  receiverId: string;
  receiverEmail: string;
  receiverName: string;
  senderItems: ExchangeItem[];
  receiverItems: ExchangeItem[];
  cashBalanceAdjustment: number; // positive = sender pays cash, negative = receiver pays cash
  walletEscrowStatus: 'none' | 'locked' | 'released' | 'refunded';
  status: 'pending' | 'counter' | 'approved' | 'declined' | 'completed';
  chatRoomId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  senderConfirmed: boolean;
  receiverConfirmed: boolean;
}

export interface AntiFraudLog {
  id: string;
  gameId: string;
  userId: string;
  userEmail: string;
  action: string;
  anomalyScore: number;
  flagReason?: string;
  clientTime: string;
  ipAddress: string;
  latencyMs: number;
  suspicious: boolean;
}

export interface GameSession {
  gameId: string;
  type: 'dice' | 'cards';
  betAmount: number;
  hostUserId: string;
  hostEmail: string;
  hostRoll?: number[];
  guestUserId?: string;
  guestEmail?: string;
  guestRoll?: number[];
  winnerId?: string;
  siteFeeCollected: number;
  status: 'lobby' | 'playing' | 'completed' | 'cancelled';
  antiFraudLogs: AntiFraudLog[];
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  wins: number;
  totalWon: number;
  winStreak: number;
}

export type GsmType = 'FRP' | 'licences' | 'remote' | 'deblocage' | 'reparation';

export interface GsmProduct {
  id: string;
  name: string;
  category: GsmType;
  turnaround: string;
  price: number;
  description: string;
  supportedBrands: string[];
  requirements: string;
  inStock?: boolean;
  rating?: number;
  sellerName?: string;
  image?: string;
}

export interface GsmFileAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
}

export interface GsmOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: GsmType;
  brand: string;
  model: string;
  imeiOrSerial: string;
  details: string;
  files: GsmFileAttachment[];
  status: 'submitted' | 'analyzing' | 'in_progress' | 'completed' | 'rejected';
  estimatedCost: number;
  invoiceUrl?: string;
  chatRoomId: string;
  createdAt: string;
  completedAt?: string;
}

export type ShippingZone = 'local' | 'USA' | 'RD';
export type ShipmentStatus = 'registered' | 'in-transit' | 'arrived' | 'delivered';

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  active: boolean;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  userId: string;
  userEmail: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  originCountry: string;
  destinationCountry: string;
  currentZone: ShippingZone;
  weight: number; // in kg
  calculatedPrice: number;
  status: ShipmentStatus;
  assignedDriverId?: string;
  assignedDriver?: DriverInfo;
  coordinates: {
    lat: number;
    lng: number;
  };
  checkpointHistory: {
    status: ShipmentStatus;
    location: string;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
}

export type DesignType = 'logo' | 'video' | 'design';

export interface CreationOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  designType: DesignType;
  projectName: string;
  clientBrief: string;
  targetAudience: string;
  preferredStyle: string;
  uploadAttachments: GsmFileAttachment[];
  status: 'received' | 'in_review' | 'concept_draft' | 'client_approval' | 'delivered';
  price: number;
  invoiceUrl?: string;
  createdAt: string;
}

export interface SupportTicketMessage {
  id: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  role: UserRole;
  message: string;
  attachments?: GsmFileAttachment[];
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: 'general' | 'billing' | 'gsm_tech' | 'shipping' | 'exchange' | 'games';
  message: string;
  attachedFiles: GsmFileAttachment[];
  status: 'open' | 'pending-staff' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: SupportTicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
}

export interface Lesson {
  lessonId: string;
  title: string;
  duration: string;
  content: string;
  order: number;
  videoPreviewUrl?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  grade: number;
  issuedAt: string;
  verificationHash: string;
  docUrl?: string;
}

export interface EnrollmentProgression {
  userId: string;
  courseId: string;
  completedLessons: string[];
  quizScores: { quizId: string; score: number; passed: boolean }[];
  certificateIssued?: boolean;
}

export interface Course {
  courseId: string;
  id?: string;
  title: string;
  badge: string;
  category?: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  duration: string;
  instructor: string;
  thumbnail: string;
  lessons: Lesson[];
  quizzes: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  attachments?: GsmFileAttachment[];
  timestamp: string;
}

export interface LiveChatRoom {
  chatRoomId: string;
  title: string;
  category: 'order' | 'exchange' | 'gsm' | 'support' | 'direct';
  participants: string[]; // user IDs
  messages: ChatMessage[];
  lastActivity: string;
}

export interface SiteContentConfiguration {
  siteName?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl?: string;
  brandTagline?: string;
  phoneContact: string;
  emailContact: string;
  contactPhone?: string;
  contactEmail?: string;
  headquartersAddress: string;
  noticeBanner: string;
  gameIframeUrl?: string;
  adNetworkEnabled?: boolean;
  adNetworkCode?: string;
  paymentGateways?: {
    moncash: boolean;
    wallet: boolean;
    card: boolean;
    crypto: boolean;
  };
  adminEmails?: string[];
  faqs: { id: string; question: string; answer: string; category: string }[];
  publicDocuments: {
    id: string;
    title: string;
    category: string;
    fileSize: string;
    version: string;
    description: string;
  }[];
  systemEmailConfig: {
    provider: 'SMTP' | 'Resend' | 'SendGrid';
    fromName: string;
    fromEmail: string;
    apiKeySet: boolean;
  };
}

export type SiteConfig = SiteContentConfiguration;

export interface ModuleFlags {
  marketplace: boolean;
  exchange: boolean;
  games: boolean;
  shipping: boolean;
  gsm: boolean;
  learning: boolean;
  creation: boolean;
  support: boolean;
}

export interface EmailNotificationLog {
  id: string;
  to: string;
  subject: string;
  template: 'welcome' | 'order_confirmation' | 'wallet_deposit' | 'escrow_alert' | 'gsm_update' | 'shipping_milestone' | 'certificate_earned' | 'ticket_reply';
  previewSnippet: string;
  fullHtml: string;
  timestamp: string;
  status: 'dispatched' | 'simulated';
}
