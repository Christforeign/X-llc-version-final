import { db } from './db';
import { User, UserRole } from '../models/types';

const AUTH_STORAGE_KEY = 'xgroup_auth_current_user_id';
export const SYSTEM_ADMIN_EMAIL = 'blaisechristeveste@gmail.com';
const ADMIN_PASSWORD = '#21Juin2005#';

class AuthService {
  private currentUserId: string | null = null;
  private listeners: Set<(user: User | null) => void> = new Set();

  constructor() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const user = db.getUserById(stored);
        if (user) {
          this.currentUserId = user.id;
        } else {
          // Default to client for convenience if not found
          this.currentUserId = 'usr-client-01';
          localStorage.setItem(AUTH_STORAGE_KEY, 'usr-client-01');
        }
      } else {
        // Seed default session to Client Alexandre Mercier so app preview is immediately interactive
        this.currentUserId = 'usr-client-01';
        localStorage.setItem(AUTH_STORAGE_KEY, 'usr-client-01');
      }
    } catch {
      this.currentUserId = 'usr-client-01';
    }
  }

  public subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.getCurrentUser());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const user = this.getCurrentUser();
    this.listeners.forEach((fn) => fn(user));
  }

  public getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return db.getUserById(this.currentUserId) || null;
  }

  public signIn(email: string, password?: string): { success: boolean; message: string; user?: User } {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === SYSTEM_ADMIN_EMAIL.toLowerCase()) {
      if (password !== ADMIN_PASSWORD) {
        return { success: false, message: 'Mot de passe administrateur incorrect. Veuillez utiliser le mot de passe valide (#21Juin2005#).' };
      }
    }

    let user = db.getUserByEmail(email.trim());
    if (!user) {
      if (cleanEmail === SYSTEM_ADMIN_EMAIL.toLowerCase()) {
        user = db.createUser({
          email: SYSTEM_ADMIN_EMAIL,
          name: 'Mr Christ X (Super Administrator)',
          role: 'admin',
          permissions: ['all', 'manage_users', 'override_ledgers', 'manage_modules', 'view_ghost'],
          phone: '+1 (509) 3701-4422'
        });
      } else {
        return { success: false, message: 'Account not found with this email address.' };
      }
    }

    this.currentUserId = user.id;
    localStorage.setItem(AUTH_STORAGE_KEY, user.id);

    // Update lastLogin and log connection
    user.lastLogin = new Date().toISOString();
    db.logConnection(user.id, user.email);

    this.notify();
    return { success: true, message: 'Successfully authenticated.', user };
  }

  public login(email: string, password?: string): boolean {
    const res = this.signIn(email, password);
    return res.success;
  }

  public signUp(params: { email: string; name: string; phone?: string; role?: UserRole }): { success: boolean; message: string; user?: User } {
    const existing = db.getUserByEmail(params.email.trim());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser = db.createUser({
      email: params.email.trim(),
      name: params.name.trim(),
      phone: params.phone,
      role: params.role || 'client',
      permissions: params.role === 'admin' ? ['all'] : params.role === 'staff' ? ['manage_gsm', 'support'] : ['standard_access'],
    });

    this.currentUserId = newUser.id;
    localStorage.setItem(AUTH_STORAGE_KEY, newUser.id);
    db.logConnection(newUser.id, newUser.email);

    this.notify();
    return { success: true, message: 'Account created successfully.', user: newUser };
  }

  public signOut(): void {
    this.currentUserId = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.notify();
  }

  public logout(): void {
    this.signOut();
  }

  public switchRole(role: UserRole): void {
    const users = db.getUsers();
    const target = users.find((u) => u.role === role);
    if (target) {
      this.signIn(target.email);
    }
  }

  public isGhostAdminAuthorized(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.role === 'admin' && user.email.toLowerCase() === SYSTEM_ADMIN_EMAIL.toLowerCase();
  }
}

export const authService = new AuthService();
