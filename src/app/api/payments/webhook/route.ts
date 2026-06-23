import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/payments/webhook - Handle payment confirmations from Asaas
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Asaas webhook event structure
    const { event, payment } = body;

    if (!event || !payment) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Asaas event types:
    // PAYMENT_RECEIVED, PAYMENT_CONFIRMED, PAYMENT_OVERDUE,
    // PAYMENT_REFUNDED, PAYMENT_DELETED
    const asaasPaymentId = payment.id;
    const asaasStatus = payment.status;

    // Find the payment in our database by Asaas ID
    const localPayment = await db.payment.findFirst({
      where: { asaasId: asaasPaymentId },
    });

    if (!localPayment) {
      console.warn(`[WEBHOOK] Payment not found for Asaas ID: ${asaasPaymentId}`);
      // Return 200 so Asaas doesn't retry
      return NextResponse.json({ received: true, message: 'Payment not found locally' });
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
    if (localPayment.status === newStatus) {
      return NextResponse.json({ received: true, message: 'Status unchanged' });
    }

    // Update payment status
    const updatedPayment = await db.payment.update({
      where: { id: localPayment.id },
      data: {
        status: newStatus,
        paidAt: newStatus === 'confirmed' ? new Date() : undefined,
      },
    });

    // Handle payment confirmation
    if (newStatus === 'confirmed') {
      // If payment is linked to a subscription, ensure subscription is active
      if (localPayment.subscriptionId) {
        const subscription = await db.subscription.findUnique({
          where: { id: localPayment.subscriptionId },
        });

        if (subscription && subscription.status !== 'active') {
          // Reactivate subscription
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);

          await db.subscription.update({
            where: { id: subscription.id },
            data: {
              status: 'active',
              endDate,
            },
          });

          // Update user role
          await db.user.update({
            where: { id: subscription.userId },
            data: {
              plan: subscription.plan as string,
              role: 'premium',
            },
          });
        }
      }

      // Create notification for user
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

    // Handle payment failure
    if (newStatus === 'failed') {
      await db.notification.create({
        data: {
          userId: localPayment.userId,
          type: 'payment_failed',
          title: 'Pagamento falhou',
          message: `Seu pagamento de R$ ${localPayment.amount.toFixed(2)} falhou. Por favor, tente novamente.`,
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

    return NextResponse.json({
      received: true,
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
      },
    });
  } catch (error) {
    console.error('[PAYMENTS_WEBHOOK]', error);
    // Return 200 to prevent Asaas from retrying
    return NextResponse.json({ received: true, error: 'Internal processing error' });
  }
}
