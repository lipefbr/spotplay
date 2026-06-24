import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * POST /api/payments/webhook - Handle Asaas webhook events
 * 
 * Asaas sends webhooks for payment and subscription events:
 * 
 * Payment events:
 * - PAYMENT_CREATED
 * - PAYMENT_RECEIVED (confirmed)
 * - PAYMENT_CONFIRMED
 * - PAYMENT_OVERDUE
 * - PAYMENT_REFUNDED
 * - PAYMENT_DELETED
 * 
 * Subscription events:
 * - SUBSCRIPTION_CREATED
 * - SUBSCRIPTION_ACTIVATED
 * - SUBSCRIPTION_DEACTIVATED (canceled/expired)
 * - SUBSCRIPTION_RENOVED (renewed for new cycle)
 * - SUBSCRIPTION_OVERDUE (payment overdue)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Asaas webhook event structure
    const { event, payment, subscription } = body;

    if (!event) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    console.log(`[WEBHOOK] Received event: ${event}`);

    // ===== PAYMENT EVENTS =====
    if (event.startsWith('PAYMENT_') && payment) {
      await handlePaymentEvent(event, payment);
    }

    // ===== SUBSCRIPTION EVENTS =====
    if (event.startsWith('SUBSCRIPTION_') && subscription) {
      await handleSubscriptionEvent(event, subscription);
    }

    // Always return 200 to prevent Asaas from retrying
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[PAYMENTS_WEBHOOK]', error);
    // Return 200 to prevent Asaas from retrying
    return NextResponse.json({ received: true, error: 'Internal processing error' });
  }
}

async function handlePaymentEvent(event: string, payment: any) {
  const asaasPaymentId = payment.id;
  const asaasStatus = payment.status;

  // Find the payment in our database by Asaas ID
  const localPayment = await db.payment.findFirst({
    where: { asaasId: asaasPaymentId },
  });

  if (!localPayment) {
    console.warn(`[WEBHOOK] Payment not found for Asaas ID: ${asaasPaymentId}`);
    return;
  }

  // Map Asaas status to our status
  const statusMap: Record<string, string> = {
    RECEIVED: 'confirmed',
    CONFIRMED: 'confirmed',
    RECEIVED_IN_CASH: 'confirmed',
    OVERDUE: 'failed',
    REFUNDED: 'refunded',
    PENDING: 'pending',
  };

  const newStatus = statusMap[asaasStatus] || 'pending';

  // Skip if status hasn't changed
  if (localPayment.status === newStatus) return;

  // Update payment status
  await db.payment.update({
    where: { id: localPayment.id },
    data: {
      status: newStatus,
      paidAt: newStatus === 'confirmed' ? new Date() : undefined,
    },
  });

  // Handle payment confirmation
  if (newStatus === 'confirmed') {
    // If payment is linked to a subscription, activate it
    if (localPayment.subscriptionId) {
      const sub = await db.subscription.findUnique({
        where: { id: localPayment.subscriptionId },
      });

      if (sub && sub.status !== 'active') {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        await db.subscription.update({
          where: { id: sub.id },
          data: { status: 'active', endDate },
        });

        // Upgrade user to premium
        await db.user.update({
          where: { id: sub.userId },
          data: { plan: sub.plan, role: 'premium' },
        });
      }
    }

    // Create notification
    await db.notification.create({
      data: {
        userId: localPayment.userId,
        type: 'payment_confirmed',
        title: 'Pagamento confirmado',
        message: `Seu pagamento de R$ ${localPayment.amount.toFixed(2)} foi confirmado com sucesso.`,
        data: JSON.stringify({ paymentId: localPayment.id }),
      },
    });
  }

  // Handle payment failure / overdue
  if (newStatus === 'failed') {
    await db.notification.create({
      data: {
        userId: localPayment.userId,
        type: 'payment_failed',
        title: 'Pagamento falhou',
        message: `Seu pagamento de R$ ${localPayment.amount.toFixed(2)} falhou. Tente novamente.`,
        data: JSON.stringify({ paymentId: localPayment.id }),
      },
    });
  }

  // Handle refund
  if (newStatus === 'refunded') {
    await db.notification.create({
      data: {
        userId: localPayment.userId,
        type: 'payment_refunded',
        title: 'Pagamento reembolsado',
        message: `Seu pagamento de R$ ${localPayment.amount.toFixed(2)} foi reembolsado.`,
        data: JSON.stringify({ paymentId: localPayment.id }),
      },
    });
  }
}

async function handleSubscriptionEvent(event: string, subscription: any) {
  const asaasSubscriptionId = subscription.id;
  const asaasStatus = subscription.status;

  // Find local subscription by Asaas ID
  const localSub = await db.subscription.findFirst({
    where: { asaasId: asaasSubscriptionId },
  });

  if (!localSub) {
    console.warn(`[WEBHOOK] Subscription not found for Asaas ID: ${asaasSubscriptionId}`);
    return;
  }

  switch (event) {
    case 'SUBSCRIPTION_ACTIVATED':
    case 'SUBSCRIPTION_RENOVED': {
      // Subscription is active or renewed — extend the end date
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      await db.subscription.update({
        where: { id: localSub.id },
        data: {
          status: 'active',
          endDate,
          autoRenew: true,
        },
      });

      // Ensure user is premium
      await db.user.update({
        where: { id: localSub.userId },
        data: { plan: localSub.plan, role: 'premium' },
      });

      // Create notification
      const isRenewal = event === 'SUBSCRIPTION_RENOVED';
      await db.notification.create({
        data: {
          userId: localSub.userId,
          type: isRenewal ? 'subscription_renewed' : 'subscription_activated',
          title: isRenewal ? 'Assinatura renovada' : 'Assinatura ativada',
          message: isRenewal
            ? 'Sua assinatura Premium foi renovada com sucesso!'
            : 'Sua assinatura Premium foi ativada! Aproveite!',
          data: JSON.stringify({ subscriptionId: localSub.id }),
        },
      });

      console.log(`[WEBHOOK] Subscription ${event}: ${asaasSubscriptionId}`);
      break;
    }

    case 'SUBSCRIPTION_DEACTIVATED': {
      // Subscription canceled or expired
      await db.subscription.update({
        where: { id: localSub.id },
        data: {
          status: 'canceled',
          autoRenew: false,
        },
      });

      // Downgrade user
      await db.user.update({
        where: { id: localSub.userId },
        data: { plan: 'free', role: 'free' },
      });

      await db.notification.create({
        data: {
          userId: localSub.userId,
          type: 'subscription_canceled',
          title: 'Assinatura cancelada',
          message: 'Sua assinatura Premium foi cancelada. Você agora está no plano Free.',
          data: JSON.stringify({ subscriptionId: localSub.id }),
        },
      });

      console.log(`[WEBHOOK] Subscription deactivated: ${asaasSubscriptionId}`);
      break;
    }

    case 'SUBSCRIPTION_OVERDUE': {
      // Payment overdue — mark as past_due but don't cancel yet
      await db.subscription.update({
        where: { id: localSub.id },
        data: { status: 'past_due' },
      });

      await db.notification.create({
        data: {
          userId: localSub.userId,
          type: 'payment_overdue',
          title: 'Pagamento em atraso',
          message: 'Seu pagamento está em atraso. Regularize para manter seu Premium.',
          data: JSON.stringify({ subscriptionId: localSub.id }),
        },
      });

      console.log(`[WEBHOOK] Subscription overdue: ${asaasSubscriptionId}`);
      break;
    }

    default:
      console.log(`[WEBHOOK] Unhandled subscription event: ${event}`);
  }
}
