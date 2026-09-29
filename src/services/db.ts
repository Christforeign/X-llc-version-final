import {
  User,
  ConnectionsHistory,
  Wallet,
  LedgerEntry,
  MarketplaceItem,
  Order,
  ExchangeProposal,
  GameSession,
  LeaderboardEntry,
  AntiFraudLog,
  GsmOrder,
  GsmProduct,
  Shipment,
  DriverInfo,
  CreationOrder,
  SupportTicket,
  Course,
  Certificate,
  EnrollmentProgression,
  LiveChatRoom,
  SiteContentConfiguration,
  ModuleFlags,
  EmailNotificationLog,
  RoleApplication,
} from '../models/types';

// Storage keys
const DB_PREFIX = 'xgroup_llc_db_v1_';

const initialUsers: User[] = [
  {
    id: 'usr-admin-01',
    email: 'blaisechristeveste@gmail.com',
    name: 'Mr Christ X (Super Administrator)',
    role: 'admin',
    permissions: ['all', 'manage_users', 'override_ledgers', 'manage_modules', 'view_ghost'],
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    phone: '+1 (509) 3701-4422',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-staff-01',
    email: 'tech.staff@xgroup.com',
    name: 'Jean-Marc Durand (Tech Lead)',
    role: 'staff',
    permissions: ['manage_gsm', 'support_tickets', 'marketplace_moderation'],
    createdAt: '2024-02-10T10:00:00Z',
    lastLogin: '2025-05-10T09:30:00Z',
    phone: '+1 (305) 555-0144',
  },
  {
    id: 'usr-part-01',
    email: 'partner@xgroup.com',
    name: 'Carib Express Logistics Inc.',
    role: 'partenaire',
    permissions: ['partner_workspace', 'bulk_shipping', 'b2b_wholesale'],
    createdAt: '2024-03-01T12:00:00Z',
    lastLogin: '2025-05-09T14:15:00Z',
    phone: '+1 (809) 555-0812',
  },
  {
    id: 'usr-client-01',
    email: 'client@xgroup.com',
    name: 'Alexandre Mercier',
    role: 'client',
    permissions: ['standard_access'],
    createdAt: '2024-04-15T08:00:00Z',
    lastLogin: new Date().toISOString(),
    phone: '+1 (509) 3701-4422',
  },
];

const initialDrivers: DriverInfo[] = [
  { id: 'drv-01', name: 'Marco Valera', phone: '+1 (305) 980-1122', vehicle: 'Freightliner Sprinter Van', plate: 'FL-XG-902', active: true },
  { id: 'drv-02', name: 'Rafael Santos', phone: '+1 (809) 441-9988', vehicle: 'Toyota Hilux 4x4 Cargo', plate: 'DOM-7821-X', active: true },
  { id: 'drv-03', name: 'Pierre-Louis Kensley', phone: '+1 (509) 3810-7711', vehicle: 'Isuzu NPR Express', plate: 'HT-1290-BB', active: true },
];

const initialSiteConfig: SiteContentConfiguration = {
  siteName: 'XGROUP LLC',
  heroTitle: 'XGROUP LLC — Plateforme E-Commerce, Recharges & Services Autonomes',
  heroSubtitle: 'Infrastructure e-commerce et multi-services de pointe (Compatible WordPress 7.1)',
  heroDescription: 'Plateforme complète autonome sans dépendance WooCommerce : recharges, livraison, jeux, services numériques et assistance humanitaire.',
  heroImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  brandTagline: 'XGROUP LLC & WordPress 7.1 Compatible Engine',
  phoneContact: '+1 (509) 3701-4422',
  emailContact: 'blaisechristeveste@gmail.com',
  contactPhone: '+1 (509) 3701-4422',
  contactEmail: 'blaisechristeveste@gmail.com',
  headquartersAddress: 'XGROUP LLC Headquarters, Port-au-Prince / Miami',
  noticeBanner: 'XGROUP LLC Super Platform active — Tous les modules de paiement et livraison sont opérationnels.',
  gameIframeUrl: 'https://html5games.com',
  adNetworkEnabled: true,
  adNetworkCode: '<!-- Adsterra / AdSense Ready Script Tag -->',
  paymentGateways: {
    moncash: true,
    wallet: true,
    card: true,
    crypto: true,
  },
  adminEmails: ['blaisechristeveste@gmail.com'],
  faqs: [
    {
      id: 'faq-1',
      category: 'GSM Services',
      question: 'What is the standard turnaround time for Remote FRP & Network Unlocks?',
      answer: 'Remote operations are processed live via our secure USB-over-IP gateway by certified technicians within 15 to 45 minutes of verification.',
    },
    {
      id: 'faq-2',
      category: 'Shipping & Customs',
      question: 'How does customs clearance work between the USA and Dominican Republic / Haiti?',
      answer: 'All items are processed through our licensed bonded warehouses. Rates include pre-cleared customs documentation, tracking checkpoints, and final bonded courier dispatch.',
    },
    {
      id: 'faq-3',
      category: 'Wallet & Escrow',
      question: 'How are peer-to-peer exchange trades secured against non-delivery?',
      answer: 'When a trade with cash balance adjustment is initiated, the required balance is locked in internal Escrow. Funds are only transferred after both parties inspect and cryptographically sign off on delivery.',
    },
    {
      id: 'faq-4',
      category: 'Certification & Academy',
      question: 'Are XGROUP Academy certifications recognized internationally?',
      answer: 'Yes, each diploma issued bears a cryptographic SHA-256 verification hash and unique credential ID verifiable against the XGROUP public ledger.',
    },
  ],
  publicDocuments: [
    {
      id: 'doc-1',
      title: 'XGROUP LLC Certificate of Incorporation & Good Standing (Florida State)',
      category: 'Legal & Corporate',
      fileSize: '1.4 MB',
      version: '2025.1',
      description: 'Official corporate filing, Federal EIN registry, and registered agent credentials.',
    },
    {
      id: 'doc-2',
      title: 'Cross-Border Air & Ocean Freight Compliance Schedule (USA / CARICOM / DR)',
      category: 'Logistics',
      fileSize: '3.2 MB',
      version: '4.8',
      description: 'Standard customs tariffs, prohibited hazardous materials list, and bonded warehouse protocols.',
    },
    {
      id: 'doc-3',
      title: 'GSM Hardware Firmware & Software Service Level Agreement (SLA)',
      category: 'GSM Engineering',
      fileSize: '890 KB',
      version: '3.0',
      description: 'Guarantees for IMEI repair, firmware preservation, and server-side unlock refunds.',
    },
    {
      id: 'doc-4',
      title: 'Double-Entry Internal Wallet & Escrow Safety Framework',
      category: 'Financial Safety',
      fileSize: '1.1 MB',
      version: '2.4',
      description: 'Terms governing dispute arbitration, buyer protection, and fee calculations.',
    },
  ],
  systemEmailConfig: {
    provider: 'SMTP',
    fromName: 'XGROUP Automated Dispatcher',
    fromEmail: 'noreply@xgroup.com',
    apiKeySet: true,
  },
};

const initialModuleFlags: ModuleFlags = {
  marketplace: true,
  exchange: true,
  games: true,
  shipping: true,
  gsm: true,
  learning: true,
  creation: true,
  support: true,
};

const initialProducts: MarketplaceItem[] = [];

const initialCourses: Course[] = [];

const initialShipments: Shipment[] = [];

const initialGsmOrders: GsmOrder[] = [];

const initialGsmProducts: GsmProduct[] = [];

const initialExchangeProposals: ExchangeProposal[] = [];

const initialLeaderboard: LeaderboardEntry[] = [];

const initialTickets: SupportTicket[] = [];

// Helper to safely parse and store
class DatabaseService {
  private listeners: Set<() => void> = new Set();

  private get<T>(key: string, defaultVal: T): T {
    try {
      const raw = localStorage.getItem(DB_PREFIX + key);
      if (!raw || raw === 'undefined' || raw === 'null') return defaultVal;
      const parsed = JSON.parse(raw);
      if (parsed === null || parsed === undefined) return defaultVal;
      return parsed as T;
    } catch {
      return defaultVal;
    }
  }

  private set<T>(key: string, val: T): void {
    try {
      localStorage.setItem(DB_PREFIX + key, JSON.stringify(val));
      this.notify();
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  // Init default storage
  constructor() {
    if (!localStorage.getItem(DB_PREFIX + 'users')) {
      this.set('users', initialUsers);
    }
    if (!localStorage.getItem(DB_PREFIX + 'drivers')) {
      this.set('drivers', initialDrivers);
    }
    if (!localStorage.getItem(DB_PREFIX + 'site_config')) {
      this.set('site_config', initialSiteConfig);
    }
    if (!localStorage.getItem(DB_PREFIX + 'module_flags')) {
      this.set('module_flags', initialModuleFlags);
    }
    if (!localStorage.getItem(DB_PREFIX + 'products')) {
      this.set('products', initialProducts);
    }
    if (!localStorage.getItem(DB_PREFIX + 'courses')) {
      this.set('courses', initialCourses);
    }
    if (!localStorage.getItem(DB_PREFIX + 'shipments')) {
      this.set('shipments', initialShipments);
    }
    if (!localStorage.getItem(DB_PREFIX + 'gsm_orders')) {
      this.set('gsm_orders', initialGsmOrders);
    }
    if (!localStorage.getItem(DB_PREFIX + 'gsm_products')) {
      this.set('gsm_products', initialGsmProducts);
    }
    if (!localStorage.getItem(DB_PREFIX + 'exchanges')) {
      this.set('exchanges', initialExchangeProposals);
    }
    if (!localStorage.getItem(DB_PREFIX + 'leaderboard')) {
      this.set('leaderboard', initialLeaderboard);
    }
    if (!localStorage.getItem(DB_PREFIX + 'tickets')) {
      this.set('tickets', initialTickets);
    }
    if (!localStorage.getItem(DB_PREFIX + 'connections')) {
      this.set('connections', [
        {
          id: 'conn-01',
          userId: 'usr-admin-01',
          userEmail: 'admin@xgroup.com',
          ipAddress: '198.51.100.42',
          timestamp: new Date().toISOString(),
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
          location: 'Miami, United States',
        },
      ]);
    }
    if (!localStorage.getItem(DB_PREFIX + 'wallets')) {
      // Seed default wallets
      const wallets: Record<string, Wallet> = {
        'usr-admin-01': {
          id: 'wal-admin',
          userId: 'usr-admin-01',
          balance: 24850.0,
          escrowBalance: 0,
          ledger: [
            {
              txId: 'tx-init-admin',
              type: 'credit',
              amount: 25000,
              feeAmount: 0,
              module: 'deposit',
              description: 'Corporate Liquidity Pool Injection',
              timestamp: '2024-01-01T00:00:00Z',
            },
          ],
        },
        'usr-client-01': {
          id: 'wal-client-01',
          userId: 'usr-client-01',
          balance: 1450.0,
          escrowBalance: 200.0, // $200 locked in exchange escrow exc-01
          ledger: [
            {
              txId: 'tx-cl-1',
              type: 'credit',
              amount: 1750,
              feeAmount: 0,
              module: 'deposit',
              description: 'Bank Card Instant Deposit (Stripe Gateway)',
              timestamp: '2025-05-05T12:00:00Z',
            },
            {
              txId: 'tx-cl-2',
              type: 'debit',
              amount: 100,
              feeAmount: 0,
              module: 'marketplace',
              description: 'Order Payment: Software License Key',
              timestamp: '2025-05-06T14:00:00Z',
            },
            {
              txId: 'tx-cl-3',
              type: 'escrow',
              amount: 200,
              feeAmount: 4, // 2% escrow fee
              module: 'exchange',
              description: 'Locked Escrow for Swap XG-SWAP-1029 (iPhone 13 to 14 Upgrade)',
              timestamp: '2025-05-09T15:20:00Z',
              referenceId: 'exc-01',
            },
          ],
        },
        'usr-staff-01': {
          id: 'wal-staff-01',
          userId: 'usr-staff-01',
          balance: 890.0,
          escrowBalance: 0,
          ledger: [
            {
              txId: 'tx-st-1',
              type: 'credit',
              amount: 890,
              feeAmount: 0,
              module: 'deposit',
              description: 'Staff Monthly Technician Commission',
              timestamp: '2025-05-01T00:00:00Z',
            },
          ],
        },
        'usr-part-01': {
          id: 'wal-part-01',
          userId: 'usr-part-01',
          balance: 5200.0,
          escrowBalance: 0,
          ledger: [
            {
              txId: 'tx-pt-1',
              type: 'credit',
              amount: 5200,
              feeAmount: 0,
              module: 'deposit',
              description: 'B2B Logistics Freight Revenue Settlement',
              timestamp: '2025-05-01T00:00:00Z',
            },
          ],
        },
        XGROUP_TREASURY: {
          id: 'wal-treasury',
          userId: 'XGROUP_TREASURY',
          balance: 6420.75,
          escrowBalance: 0,
          ledger: [
            {
              txId: 'tx-tr-1',
              type: 'fee',
              amount: 6420.75,
              feeAmount: 0,
              module: 'admin_override',
              description: 'Cumulative Platform Commission Fees (Jeux, Escrow & Marketplace)',
              timestamp: '2025-05-01T00:00:00Z',
            },
          ],
        },
      };
      this.set('wallets', wallets);
    }
  }

  // --- Users & Roles ---
  public getUsers(): User[] {
    return this.get<User[]>('users', initialUsers);
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    users.push(newUser);
    this.set('users', users);

    // Also initialize wallet
    this.getWallet(newUser.id);
    return newUser;
  }

  public updateUserRole(userId: string, role: User['role'], permissions?: string[]): void {
    const users = this.getUsers().map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role,
          permissions: permissions || u.permissions,
        };
      }
      return u;
    });
    this.set('users', users);
  }

  public getAllUsers(): User[] {
    return this.getUsers();
  }

  public updateModuleFlag(key: keyof ModuleFlags, enabled: boolean): void {
    this.toggleModule(key, enabled);
  }

  public saveSiteConfig(config: Partial<SiteContentConfiguration>): void {
    this.updateSiteConfig(config);
  }

  // --- Connection History ---
  public getConnections(): ConnectionsHistory[] {
    const list = this.get<ConnectionsHistory[]>('connections', []);
    return Array.isArray(list) ? list : [];
  }

  public logConnection(userId: string, userEmail: string): void {
    const connections = this.getConnections();
    const newEntry: ConnectionsHistory = {
      id: `conn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      userEmail,
      ipAddress: `${Math.floor(Math.random() * 150 + 50)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 250 + 1)}`,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
      location: 'Miami, United States (Network Node)',
    };
    connections.unshift(newEntry);
    this.set('connections', (connections || []).slice(0, 100)); // keep last 100
  }

  // --- Modules Flags ---
  public getModuleFlags(): ModuleFlags {
    return this.get<ModuleFlags>('module_flags', initialModuleFlags);
  }

  public setModuleFlags(flags: ModuleFlags): void {
    this.set('module_flags', flags);
  }

  public toggleModule(key: keyof ModuleFlags, enabled: boolean): void {
    const flags = this.getModuleFlags();
    flags[key] = enabled;
    this.set('module_flags', flags);
  }

  // --- Site Config Vitrine ---
  public getSiteConfig(): SiteContentConfiguration {
    return this.get<SiteContentConfiguration>('site_config', initialSiteConfig);
  }

  public updateSiteConfig(config: Partial<SiteContentConfiguration>): void {
    const current = this.getSiteConfig();
    this.set('site_config', { ...current, ...config });
  }

  // --- Wallets & Double-Entry Bookkeeping ---
  private getAllWallets(): Record<string, Wallet> {
    return this.get<Record<string, Wallet>>('wallets', {});
  }

  public getWallet(userId: string): Wallet {
    const wallets = this.getAllWallets();
    if (!wallets[userId]) {
      wallets[userId] = {
        id: `wal-${userId}`,
        userId,
        balance: 100.0, // welcome bonus $100 for testing
        escrowBalance: 0,
        ledger: [
          {
            txId: `tx-welcome-${Date.now()}`,
            type: 'credit',
            amount: 100.0,
            feeAmount: 0,
            module: 'deposit',
            description: 'Account Activation Welcome Liquidity Credit',
            timestamp: new Date().toISOString(),
          },
        ],
      };
      this.set('wallets', wallets);
    }
    return wallets[userId];
  }

  public getTreasuryWallet(): Wallet {
    return this.getWallet('XGROUP_TREASURY');
  }

  /**
   * Complete Double-Entry Transaction Engine
   */
  public executeTransaction(params: {
    fromUserId?: string; // if none, mint/deposit
    toUserId?: string; // if none, withdrawal/burn
    amount: number;
    feeAmount?: number;
    feePercentage?: number;
    module: LedgerEntry['module'];
    description: string;
    referenceId?: string;
    isEscrowLock?: boolean;
    isEscrowRelease?: boolean;
  }): { success: boolean; message: string; txId?: string } {
    const wallets = this.getAllWallets();
    const { fromUserId, toUserId, amount, module, description, referenceId, isEscrowLock, isEscrowRelease } = params;

    if (amount <= 0) {
      return { success: false, message: 'Transaction amount must be strictly positive.' };
    }

    const calculatedFee = params.feeAmount !== undefined ? params.feeAmount : params.feePercentage ? (amount * params.feePercentage) / 100 : 0;
    const txId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const timestamp = new Date().toISOString();

    // Case 1: Escrow Lock (Locking funds from user balance into user escrow)
    if (isEscrowLock && fromUserId) {
      const senderWallet = wallets[fromUserId];
      if (!senderWallet || senderWallet.balance < amount + calculatedFee) {
        return { success: false, message: 'Insufficient wallet balance for escrow lock & safety fee.' };
      }

      senderWallet.balance -= amount + calculatedFee;
      senderWallet.escrowBalance += amount;
      senderWallet.ledger.unshift({
        txId,
        type: 'escrow',
        amount,
        feeAmount: calculatedFee,
        module,
        description: `Locked in Escrow: ${description}`,
        timestamp,
        referenceId,
      });

      // Transfer fee to Treasury if any
      if (calculatedFee > 0) {
        const treasury = wallets['XGROUP_TREASURY'] || this.getWallet('XGROUP_TREASURY');
        treasury.balance += calculatedFee;
        treasury.ledger.unshift({
          txId: `${txId}-FEE`,
          type: 'fee',
          amount: calculatedFee,
          feeAmount: 0,
          module,
          description: `Platform Fee (${module}): ${description}`,
          timestamp,
          referenceId,
        });
      }

      this.set('wallets', wallets);
      return { success: true, message: 'Escrow locked successfully.', txId };
    }

    // Case 2: Escrow Release (From user's locked escrow to recipient)
    if (isEscrowRelease && fromUserId && toUserId) {
      const senderWallet = wallets[fromUserId];
      const receiverWallet = wallets[toUserId] || this.getWallet(toUserId);

      if (!senderWallet || senderWallet.escrowBalance < amount) {
        return { success: false, message: 'Escrow balance insufficient or already released.' };
      }

      senderWallet.escrowBalance -= amount;
      senderWallet.ledger.unshift({
        txId,
        type: 'escrow_release',
        amount,
        feeAmount: 0,
        module,
        description: `Escrow Released: ${description}`,
        timestamp,
        referenceId,
      });

      receiverWallet.balance += amount;
      receiverWallet.ledger.unshift({
        txId: `${txId}-IN`,
        type: 'credit',
        amount,
        feeAmount: 0,
        module,
        description: `Escrow Payout Received: ${description}`,
        timestamp,
        referenceId,
      });

      this.set('wallets', wallets);
      return { success: true, message: 'Escrow funds released to receiver.', txId };
    }

    // Case 3: Standard Transfer / Purchase / Bet
    if (fromUserId && toUserId) {
      const senderWallet = wallets[fromUserId];
      const receiverWallet = wallets[toUserId] || this.getWallet(toUserId);

      const totalDebit = amount + calculatedFee;
      if (!senderWallet || senderWallet.balance < totalDebit) {
        return { success: false, message: 'Insufficient funds in wallet.' };
      }

      senderWallet.balance -= totalDebit;
      senderWallet.ledger.unshift({
        txId,
        type: 'debit',
        amount,
        feeAmount: calculatedFee,
        module,
        description,
        timestamp,
        referenceId,
      });

      receiverWallet.balance += amount;
      receiverWallet.ledger.unshift({
        txId: `${txId}-REC`,
        type: 'credit',
        amount,
        feeAmount: 0,
        module,
        description: `Received: ${description}`,
        timestamp,
        referenceId,
      });

      if (calculatedFee > 0) {
        const treasury = wallets['XGROUP_TREASURY'] || this.getWallet('XGROUP_TREASURY');
        treasury.balance += calculatedFee;
        treasury.ledger.unshift({
          txId: `${txId}-FEE`,
          type: 'fee',
          amount: calculatedFee,
          feeAmount: 0,
          module,
          description: `Site Commission (${module}): ${description}`,
          timestamp,
          referenceId,
        });
      }

      this.set('wallets', wallets);
      return { success: true, message: 'Transaction processed successfully.', txId };
    }

    // Case 4: Deposit (Credit)
    if (!fromUserId && toUserId) {
      const receiverWallet = wallets[toUserId] || this.getWallet(toUserId);
      receiverWallet.balance += amount;
      receiverWallet.ledger.unshift({
        txId,
        type: 'credit',
        amount,
        feeAmount: 0,
        module,
        description,
        timestamp,
        referenceId,
      });
      this.set('wallets', wallets);
      return { success: true, message: 'Funds credited successfully.', txId };
    }

    // Case 5: Withdrawal (Debit)
    if (fromUserId && !toUserId) {
      const senderWallet = wallets[fromUserId];
      const totalDebit = amount + calculatedFee;
      if (!senderWallet || senderWallet.balance < totalDebit) {
        return { success: false, message: 'Insufficient funds for withdrawal.' };
      }

      senderWallet.balance -= totalDebit;
      senderWallet.ledger.unshift({
        txId,
        type: 'debit',
        amount,
        feeAmount: calculatedFee,
        module,
        description,
        timestamp,
        referenceId,
      });
      this.set('wallets', wallets);
      return { success: true, message: 'Withdrawal processed.', txId };
    }

    return { success: false, message: 'Invalid transaction parameters.' };
  }

  // --- Marketplace Products & Orders ---
  public getProducts(): MarketplaceItem[] {
    const prods = this.get<MarketplaceItem[]>('products', initialProducts);
    if (!Array.isArray(prods) || prods.length === 0) {
      this.set('products', initialProducts);
      return initialProducts;
    }
    return prods;
  }

  public addProduct(item: Omit<MarketplaceItem, 'id'>): MarketplaceItem {
    const products = this.getProducts();
    const newItem: MarketplaceItem = { ...item, id: `prod-${Date.now()}` };
    products.unshift(newItem);
    this.set('products', products);
    return newItem;
  }

  public updateProduct(id: string, updates: Partial<MarketplaceItem>): void {
    const products = this.getProducts().map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.set('products', products);
  }

  public deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.set('products', products);
  }

  public getOrders(): Order[] {
    return this.get<Order[]>('orders', []);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `XG-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      invoiceUrl: `/invoice/XG-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    orders.unshift(newOrder);
    this.set('orders', orders);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders().map((o) => (o.id === orderId ? { ...o, status } : o));
    this.set('orders', orders);
  }

  // --- Exchange Module (Swaps with Escrow) ---
  public getExchanges(): ExchangeProposal[] {
    return this.get<ExchangeProposal[]>('exchanges', initialExchangeProposals);
  }

  public createExchange(proposal: Omit<ExchangeProposal, 'id' | 'tradeNumber' | 'createdAt' | 'updatedAt' | 'chatRoomId'>): ExchangeProposal {
    const exchanges = this.getExchanges();
    const tradeNumber = `XG-SWAP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProposal: ExchangeProposal = {
      ...proposal,
      id: `exc-${Date.now()}`,
      tradeNumber,
      chatRoomId: `chat-swap-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    exchanges.unshift(newProposal);
    this.set('exchanges', exchanges);
    return newProposal;
  }

  public updateExchange(id: string, updates: Partial<ExchangeProposal>): void {
    const exchanges = this.getExchanges().map((e) => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
    this.set('exchanges', exchanges);
  }

  // --- Games & Anti-Fraud Logs ---
  public getLeaderboard(): LeaderboardEntry[] {
    return this.get<LeaderboardEntry[]>('leaderboard', initialLeaderboard);
  }

  public getGameSessions(): GameSession[] {
    return this.get<GameSession[]>('game_sessions', []);
  }

  public saveGameSession(session: GameSession): void {
    const sessions = this.getGameSessions();
    sessions.unshift(session);
    this.set('game_sessions', sessions.slice(0, 50));
  }

  public getAntiFraudLogs(): AntiFraudLog[] {
    return this.get<AntiFraudLog[]>('anti_fraud_logs', []);
  }

  public logAntiFraud(log: Omit<AntiFraudLog, 'id'>): void {
    const logs = this.getAntiFraudLogs();
    logs.unshift({ ...log, id: `afl-${Date.now()}-${Math.floor(Math.random() * 1000)}` });
    this.set('anti_fraud_logs', logs.slice(0, 100));
  }

  public recordGameWin(winnerId: string, winnerName: string, profit: number): void {
    const lb = this.getLeaderboard();
    const idx = lb.findIndex((item) => item.userId === winnerId);
    if (idx >= 0) {
      lb[idx].wins += 1;
      lb[idx].totalWon += profit;
      lb[idx].winStreak += 1;
    } else {
      lb.push({
        userId: winnerId,
        name: winnerName,
        wins: 1,
        totalWon: profit,
        winStreak: 1,
      });
    }
    lb.sort((a, b) => b.totalWon - a.totalWon);
    this.set('leaderboard', lb);
  }

  // --- GSM Services ---
  public getGsmOrders(): GsmOrder[] {
    return this.get<GsmOrder[]>('gsm_orders', initialGsmOrders);
  }

  public createGsmOrder(data: Omit<GsmOrder, 'id' | 'orderNumber' | 'createdAt' | 'chatRoomId'>): GsmOrder {
    const orders = this.getGsmOrders();
    const newOrder: GsmOrder = {
      ...data,
      id: `gsm-${Date.now()}`,
      orderNumber: `GSM-${Math.floor(10000 + Math.random() * 90000)}`,
      chatRoomId: `chat-gsm-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.set('gsm_orders', orders);
    return newOrder;
  }

  public updateGsmOrder(id: string, updates: Partial<GsmOrder>): void {
    const orders = this.getGsmOrders().map((o) => (o.id === id ? { ...o, ...updates } : o));
    this.set('gsm_orders', orders);
  }

  // --- GSM Products & Catalog ---
  public getGsmProducts(): GsmProduct[] {
    const prods = this.get<GsmProduct[]>('gsm_products', initialGsmProducts);
    if (!Array.isArray(prods) || prods.length === 0) {
      this.set('gsm_products', initialGsmProducts);
      return initialGsmProducts;
    }
    return prods.map((p) => ({
      ...p,
      supportedBrands: Array.isArray(p.supportedBrands) ? p.supportedBrands : ['Universal'],
    }));
  }

  public addGsmProduct(data: Omit<GsmProduct, 'id'>): GsmProduct {
    const products = this.getGsmProducts();
    const newProd: GsmProduct = {
      ...data,
      id: `gsm-prod-${Date.now()}`,
    };
    products.unshift(newProd);
    this.set('gsm_products', products);
    return newProd;
  }

  public deleteGsmProduct(id: string): void {
    const products = this.getGsmProducts().filter((p) => p.id !== id);
    this.set('gsm_products', products);
  }

  // --- Shipping & Drivers ---
  public getShipments(): Shipment[] {
    return this.get<Shipment[]>('shipments', initialShipments);
  }

  public getDrivers(): DriverInfo[] {
    return this.get<DriverInfo[]>('drivers', initialDrivers);
  }

  public createShipment(data: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'checkpointHistory'>): Shipment {
    const shipments = this.getShipments();
    const newShipment: Shipment = {
      ...data,
      id: `shp-${Date.now()}`,
      trackingNumber: `XG-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      checkpointHistory: [
        {
          status: 'registered',
          location: data.senderAddress,
          timestamp: new Date().toISOString(),
          note: 'Consignment packaged, barcoded, and registered in XGROUP logistics portal.',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    shipments.unshift(newShipment);
    this.set('shipments', shipments);
    return newShipment;
  }

  public updateShipment(id: string, updates: Partial<Shipment>): void {
    const shipments = this.getShipments().map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.set('shipments', shipments);
  }

  // --- Creation Design Module ---
  public getCreationOrders(): CreationOrder[] {
    return this.get<CreationOrder[]>('creation_orders', []);
  }

  public createCreationOrder(data: Omit<CreationOrder, 'id' | 'orderNumber' | 'createdAt'>): CreationOrder {
    const list = this.getCreationOrders();
    const newOrder: CreationOrder = {
      ...data,
      id: `cr-${Date.now()}`,
      orderNumber: `CR-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newOrder);
    this.set('creation_orders', list);
    return newOrder;
  }

  public updateCreationOrder(id: string, updates: Partial<CreationOrder>): void {
    const list = this.getCreationOrders().map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.set('creation_orders', list);
  }

  // --- Support Tickets ---
  public getTickets(): SupportTicket[] {
    return this.get<SupportTicket[]>('tickets', initialTickets);
  }

  public createTicket(data: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>): SupportTicket {
    const tickets = this.getTickets();
    const newTicket: SupportTicket = {
      ...data,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      messages: [
        {
          id: `msg-tkt-${Date.now()}`,
          senderId: data.userId,
          senderEmail: data.userEmail,
          senderName: data.userName,
          role: 'client',
          message: data.message,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tickets.unshift(newTicket);
    this.set('tickets', tickets);
    return newTicket;
  }

  public addTicketReply(ticketId: string, reply: Omit<SupportTicket['messages'][0], 'id' | 'timestamp'>): void {
    const tickets = this.getTickets().map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: reply.role === 'staff' || reply.role === 'admin' ? ('pending-staff' as const) : ('open' as const),
          updatedAt: new Date().toISOString(),
          messages: [
            ...t.messages,
            {
              ...reply,
              id: `msg-${Date.now()}`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return t;
    });
    this.set('tickets', tickets);
  }

  // --- Apprentissage / Academy Courses & Certificates ---
  public getCourses(): Course[] {
    return this.get<Course[]>('courses', initialCourses);
  }

  public getCertificates(): Certificate[] {
    return this.get<Certificate[]>('certificates', []);
  }

  public issueCertificate(data: Omit<Certificate, 'id' | 'certificateNumber' | 'verificationHash'>): Certificate {
    const certs = this.getCertificates();
    const certNumber = `XG-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
    const verificationHash = `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newCert: Certificate = {
      ...data,
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      verificationHash,
    };
    certs.unshift(newCert);
    this.set('certificates', certs);
    return newCert;
  }

  public getEnrollment(userId: string, courseId: string): EnrollmentProgression {
    const enrollments = this.get<Record<string, EnrollmentProgression>>('enrollments', {});
    const key = `${userId}_${courseId}`;
    if (!enrollments[key]) {
      enrollments[key] = {
        userId,
        courseId,
        completedLessons: [],
        quizScores: [],
      };
      this.set('enrollments', enrollments);
    }
    return enrollments[key];
  }

  public saveEnrollment(enrollment: EnrollmentProgression): void {
    const enrollments = this.get<Record<string, EnrollmentProgression>>('enrollments', {});
    enrollments[`${enrollment.userId}_${enrollment.courseId}`] = enrollment;
    this.set('enrollments', enrollments);
  }

  // --- Live Chat Rooms ---
  public getChatRooms(): Record<string, LiveChatRoom> {
    return this.get<Record<string, LiveChatRoom>>('chat_rooms', {});
  }

  public getChatRoom(chatRoomId: string, title?: string, category: LiveChatRoom['category'] = 'direct'): LiveChatRoom {
    const rooms = this.getChatRooms();
    if (!rooms[chatRoomId]) {
      rooms[chatRoomId] = {
        chatRoomId,
        title: title || `Conversation ${chatRoomId}`,
        category,
        participants: [],
        messages: [
          {
            id: `msg-welcome-${chatRoomId}`,
            senderId: 'system',
            senderEmail: 'system@xgroup.com',
            senderName: 'XGROUP Secure Relay',
            senderRole: 'staff',
            message: 'End-to-End encrypted session initialized. Staff technicians and trade parties can communicate here directly.',
            timestamp: new Date().toISOString(),
          },
        ],
        lastActivity: new Date().toISOString(),
      };
      this.set('chat_rooms', rooms);
    }
    return rooms[chatRoomId];
  }

  public addChatMessage(chatRoomId: string, message: Omit<LiveChatRoom['messages'][0], 'id' | 'timestamp'>): void {
    const rooms = this.getChatRooms();
    const room = rooms[chatRoomId] || this.getChatRoom(chatRoomId);
    room.messages.push({
      ...message,
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    });
    room.lastActivity = new Date().toISOString();
    rooms[chatRoomId] = room;
    this.set('chat_rooms', rooms);
  }

  // --- System Email Dispatcher Logs ---
  public getEmailLogs(): EmailNotificationLog[] {
    return this.get<EmailNotificationLog[]>('email_logs', []);
  }

  public logEmailDispatch(entry: Omit<EmailNotificationLog, 'id' | 'timestamp'>): EmailNotificationLog {
    const logs = this.getEmailLogs();
    const newEntry: EmailNotificationLog = {
      ...entry,
      id: `eml-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newEntry);
    this.set('email_logs', logs.slice(0, 50));
    return newEntry;
  }

  // --- Aggregate Ledger & Fraud Logs ---
  public getLedger(): (LedgerEntry & { id: string; fromUserId: string; toUserId: string; fee?: number })[] {
    const wallets = this.getAllWallets();
    const allEntries: (LedgerEntry & { id: string; fromUserId: string; toUserId: string; fee?: number })[] = [];
    Object.values(wallets).forEach((w) => {
      w.ledger.forEach((l) => {
        allEntries.push({
          ...l,
          id: l.txId,
          fromUserId: w.userId,
          toUserId: l.referenceId || 'XGROUP_TREASURY',
          fee: l.feeAmount,
        });
      });
    });
    return allEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // --- Role Applications & Nominations ---
  public getRoleApplications(): RoleApplication[] {
    return this.get<RoleApplication[]>('role_applications', [
      {
        id: 'app-init-01',
        userId: 'usr-client-01',
        userEmail: 'client@xgroup.com',
        userName: 'Jean-Baptiste Duval',
        requestedRole: 'staff',
        experience: '5 years experience in smartphone motherboard micro-soldering, JTAG/EDL recovery and firmware unbricking.',
        motivation: 'Want to join the official XGROUP technician roster to handle remote unlock queues.',
        phone: '+509 34 56 7890',
        status: 'pending',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
  }

  public submitRoleApplication(appData: Omit<RoleApplication, 'id' | 'status' | 'submittedAt'>): RoleApplication {
    const list = this.getRoleApplications();
    const newApp: RoleApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    list.unshift(newApp);
    this.set('role_applications', list);
    return newApp;
  }

  public updateRoleApplicationStatus(appId: string, status: 'approved' | 'rejected'): void {
    const list = this.getRoleApplications().map((a) => {
      if (a.id === appId) {
        if (status === 'approved') {
          this.updateUserRole(a.userId, a.requestedRole);
        }
        return {
          ...a,
          status,
          reviewedAt: new Date().toISOString(),
        };
      }
      return a;
    });
    this.set('role_applications', list);
  }

  // --- Autonomous Maintenance & Snapshots ---
  public exportFullDatabase(): Record<string, any> {
    const snapshot: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DB_PREFIX)) {
        try {
          snapshot[key.replace(DB_PREFIX, '')] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          snapshot[key.replace(DB_PREFIX, '')] = localStorage.getItem(key);
        }
      }
    }
    return snapshot;
  }

  public importDatabase(json: Record<string, any>): void {
    if (!json || typeof json !== 'object') return;
    Object.entries(json).forEach(([key, val]) => {
      localStorage.setItem(DB_PREFIX + key, JSON.stringify(val));
    });
    this.notify();
  }

  public resetToFactorySeed(): void {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DB_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    window.location.reload();
  }
}

export const db = new DatabaseService();
