import { db } from './db';
import { Wallet, LedgerEntry } from '../models/types';
import { emailService } from './emailService';

// Fee structures
export const FEES_CONFIG = {
  GAMES_POOL_PERCENT: 5.0, // 5% site fee on betting pools
  MARKETPLACE_COMMISSION_PERCENT: 3.0, // 3% sales transaction fee
  EXCHANGE_ESCROW_PERCENT: 2.0, // 2% escrow safety fee
  WITHDRAWAL_FIXED_FEE: 2.5, // $2.50 fixed processing fee
};

export class WalletService {
  public getWallet(userId: string): Wallet {
    return db.getWallet(userId);
  }

  public getTreasuryWallet(): Wallet {
    return db.getTreasuryWallet();
  }

  // Deposit funds into user wallet
  public deposit(userId: string, userEmail: string, amount: number, method: string): { success: boolean; message: string; txId?: string } {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than zero.' };

    const result = db.executeTransaction({
      toUserId: userId,
      amount,
      module: 'deposit',
      description: `Deposit via ${method} ($${amount.toFixed(2)})`,
      referenceId: `DEP-${Date.now()}`,
    });

    if (result.success) {
      emailService.dispatch({
        to: userEmail,
        subject: `[XGROUP] Wallet Deposit Confirmed - $${amount.toFixed(2)}`,
        template: 'wallet_deposit',
        previewSnippet: `Your internal wallet has been credited with $${amount.toFixed(2)} via ${method}.`,
        fullHtml: `<div style="font-family:sans-serif;padding:20px;background:#f8fafc;">
          <h2 style="color:#0f172a;">Deposit Confirmation</h2>
          <p>Hello,</p>
          <p>Your deposit of <strong>$${amount.toFixed(2)}</strong> via <strong>${method}</strong> has been cleared into your internal wallet.</p>
          <p><strong>Transaction ID:</strong> ${result.txId}</p>
          <p>Current balance is available for immediate purchases, swaps, and services.</p>
        </div>`,
      });
    }

    return result;
  }

  // Request withdrawal
  public withdraw(userId: string, userEmail: string, amount: number, payoutDestination: string): { success: boolean; message: string; txId?: string } {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than zero.' };

    const result = db.executeTransaction({
      fromUserId: userId,
      amount,
      feeAmount: FEES_CONFIG.WITHDRAWAL_FIXED_FEE,
      module: 'withdrawal',
      description: `Withdrawal to ${payoutDestination} ($${amount.toFixed(2)} + $${FEES_CONFIG.WITHDRAWAL_FIXED_FEE} network fee)`,
      referenceId: `WTH-${Date.now()}`,
    });

    return result;
  }

  // Transfer to another user
  public transfer(fromUserId: string, toEmail: string, amount: number, memo?: string): { success: boolean; message: string; txId?: string } {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than zero.' };

    const recipient = db.getUserByEmail(toEmail);
    if (!recipient) {
      return { success: false, message: `Recipient user with email "${toEmail}" not found.` };
    }
    if (recipient.id === fromUserId) {
      return { success: false, message: 'Cannot transfer funds to your own account.' };
    }

    return db.executeTransaction({
      fromUserId,
      toUserId: recipient.id,
      amount,
      module: 'transfer',
      description: `P2P Internal Transfer to ${recipient.email}${memo ? ` - Memo: ${memo}` : ''}`,
      referenceId: `TRF-${Date.now()}`,
    });
  }

  // Direct purchase from wallet balance
  public purchaseItem(
    userId: string,
    userEmail: string,
    amount: number,
    itemTitle: string,
    module: LedgerEntry['module'] = 'marketplace'
  ): { success: boolean; message: string; txId?: string } {
    if (amount <= 0) return { success: false, message: 'Montant invalide.' };

    const wallet = db.getWallet(userId);
    if (!wallet || wallet.balance < amount) {
      return {
        success: false,
        message: `Solde insuffisant ($${(wallet?.balance || 0).toFixed(2)} USD). Veuillez recharger votre portefeuille.`,
      };
    }

    const result = db.executeTransaction({
      fromUserId: userId,
      toUserId: 'XGROUP_TREASURY',
      amount,
      module,
      description: `Achat: ${itemTitle}`,
      referenceId: `PURCH-${Date.now()}`,
    });

    if (result.success) {
      emailService.dispatch({
        to: userEmail,
        subject: `[XGROUP] Confirmation de paiement - $${amount.toFixed(2)}`,
        template: 'order_confirmation',
        previewSnippet: `Votre commande "${itemTitle}" de $${amount.toFixed(2)} a été débitée avec succès.`,
        fullHtml: `<div style="font-family:sans-serif;padding:20px;">
          <h2>Paiement par Portefeuille Validé</h2>
          <p>Prestation: <strong>${itemTitle}</strong></p>
          <p>Montant: <strong>$${amount.toFixed(2)} USD</strong></p>
          <p>Transaction ID: ${result.txId}</p>
        </div>`,
      });
    }

    return result;
  }

  // Lock cash in Escrow for Exchange
  public lockExchangeEscrow(senderId: string, senderEmail: string, amount: number, tradeNumber: string): { success: boolean; message: string; txId?: string } {
    const fee = (amount * FEES_CONFIG.EXCHANGE_ESCROW_PERCENT) / 100;

    const res = db.executeTransaction({
      fromUserId: senderId,
      amount,
      feeAmount: fee,
      module: 'exchange',
      description: `Locked Escrow for Swap ${tradeNumber}`,
      referenceId: tradeNumber,
      isEscrowLock: true,
    });

    if (res.success) {
      emailService.dispatch({
        to: senderEmail,
        subject: `[XGROUP Escrow] Funds Locked for Swap ${tradeNumber}`,
        template: 'escrow_alert',
        previewSnippet: `An amount of $${amount.toFixed(2)} (+ $${fee.toFixed(2)} fee) is safely locked in Escrow.`,
        fullHtml: `<div style="font-family:sans-serif;padding:20px;">
          <h2>Escrow Protection Activated</h2>
          <p>Your trade cash adjustment of <strong>$${amount.toFixed(2)}</strong> has been placed in Escrow for trade #${tradeNumber}.</p>
          <p>Funds remain protected until both parties confirm receipt.</p>
        </div>`,
      });
    }

    return res;
  }

  // Release Escrow upon mutual sign-off
  public releaseExchangeEscrow(senderId: string, receiverId: string, receiverEmail: string, amount: number, tradeNumber: string): { success: boolean; message: string; txId?: string } {
    const res = db.executeTransaction({
      fromUserId: senderId,
      toUserId: receiverId,
      amount,
      module: 'exchange',
      description: `Mutual Sign-off Payout for Swap ${tradeNumber}`,
      referenceId: tradeNumber,
      isEscrowRelease: true,
    });

    if (res.success) {
      emailService.dispatch({
        to: receiverEmail,
        subject: `[XGROUP Escrow] Funds Released to Your Wallet - $${amount.toFixed(2)}`,
        template: 'escrow_alert',
        previewSnippet: `Escrow for trade #${tradeNumber} has been released. $${amount.toFixed(2)} is now in your balance.`,
        fullHtml: `<div style="font-family:sans-serif;padding:20px;">
          <h2>Escrow Release Complete</h2>
          <p>Both parties confirmed completion of trade #${tradeNumber}.</p>
          <p><strong>$${amount.toFixed(2)}</strong> was added to your wallet.</p>
        </div>`,
      });
    }

    return res;
  }

  // Game bet pool deduction
  public processGameWager(userId: string, betAmount: number, gameType: string, gameId: string): { success: boolean; message: string; txId?: string } {
    return db.executeTransaction({
      fromUserId: userId,
      toUserId: 'XGROUP_TREASURY', // temporary house vault
      amount: betAmount,
      module: 'games',
      description: `${gameType.toUpperCase()} Wager Placement ($${betAmount.toFixed(2)})`,
      referenceId: gameId,
    });
  }

  // Game win distribution (pool minus 5% fee)
  public payoutGameWinner(winnerId: string, totalPool: number, gameType: string, gameId: string): { netPayout: number; siteFee: number } {
    const siteFee = (totalPool * FEES_CONFIG.GAMES_POOL_PERCENT) / 100;
    const netPayout = totalPool - siteFee;

    // Credit winner from treasury
    db.executeTransaction({
      fromUserId: 'XGROUP_TREASURY',
      toUserId: winnerId,
      amount: netPayout,
      module: 'games',
      description: `${gameType.toUpperCase()} Round Victory Payout ($${netPayout.toFixed(2)})`,
      referenceId: gameId,
    });

    return { netPayout, siteFee };
  }
}

export const walletService = new WalletService();
