import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  createAsaasCustomer,
  createAsaasSubscription,
  cancelAsaasSubscription,
} from '@/lib/asaas';

// Plan pricing map
const PLAN_PRICES: Record<string, { value: number; cycle: 'MONTHLY' | 'YEARLY'; description: string }> = {
  premium_individual: { value: 21.90, cycle: 'MONTHLY', description: 'SoundFlow Premium Individual' },
  premium_duo: { value: 29.90, cycle: 'MONTHLY', description: 'SoundFlow Premium Duo' },
  premium_familia: { value: 39.90, cycle: 'MONTHLY', description: 'SoundFlow Premium Família' },
  premium_estudante: { value: 11.95, cycle: 'MONTHLY', description: 'SoundFlow Premium Estudante' },
};

// GET /api/subscriptions - Get current user subscription
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const subscription = await db.subscription.findUnique({
      where: { userId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { message: 'No active subscription', subscription: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('[SUBSCRIPTIONS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create subscription (integrate with Asaas)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, plan, billingType, cpfCnpj, phone } = body;

    // Validate required fields
    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'userId and plan are required' },
        { status: 400 }
      );
    }

    // Validate plan
    const planPrice = PLAN_PRICES[plan];
    if (!planPrice) {
      return NextResponse.json(
        { error: 'Invalid plan. Available plans: premium_individual, premium_duo, premium_familia, premium_estudante' },
        { status: 400 }
      );
    }

    // Validate billing type
    const validBillingTypes = ['PIX', 'CREDIT_CARD', 'BOLETO'];
    const billing = billingType && validBillingTypes.includes(billingType) ? billingType : 'PIX';

    // Get user
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check for existing active subscription
    const existingSub = await db.subscription.findUnique({
      where: { userId },
    });

    if (existingSub && existingSub.status === 'active') {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 409 }
      );
    }

    // Calculate next due date (30 days from now)
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 30);

    let asaasSubscriptionId: string | null = null;

    // Try to create Asaas subscription
    try {
      // Create or get Asaas customer
      const customer = await createAsaasCustomer({
        name: user.name || user.email,
        email: user.email,
        cpfCnpj: cpfCnpj || '00000000000',
        phone: phone || undefined,
      });

      // Create Asaas subscription
      const asaasSub = await createAsaasSubscription({
        customer: customer.id,
        billingType: billing as 'PIX' | 'CREDIT_CARD' | 'BOLETO',
        value: planPrice.value,
        description: planPrice.description,
        cycle: planPrice.cycle,
        nextDueDate: nextDueDate.toISOString().split('T')[0],
      });

      asaasSubscriptionId = asaasSub.id;
    } catch (asaasError) {
      console.warn('[ASAAS_SUBSCRIPTION] Asaas integration failed, creating local subscription:', asaasError);
      // Continue without Asaas - create local subscription only
    }

    // Create or update subscription in database
    const subscription = await db.subscription.upsert({
      where: { userId },
      update: {
        plan,
        status: 'active',
        startDate: new Date(),
        endDate: nextDueDate,
        autoRenew: true,
        asaasId: asaasSubscriptionId,
      },
      create: {
        userId,
        plan,
        status: 'active',
        startDate: new Date(),
        endDate: nextDueDate,
        trialEndDate: null,
        autoRenew: true,
        asaasId: asaasSubscriptionId,
      },
    });

    // Update user plan and role
    await db.user.update({
      where: { id: userId },
      data: {
        plan,
        role: 'premium',
      },
    });

    return NextResponse.json(
      {
        message: 'Subscription created successfully',
        subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[SUBSCRIPTIONS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/subscriptions - Cancel subscription
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const subscription = await db.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    if (subscription.status === 'canceled') {
      return NextResponse.json(
        { error: 'Subscription is already canceled' },
        { status: 400 }
      );
    }

    // Try to cancel on Asaas
    if (subscription.asaasId) {
      try {
        await cancelAsaasSubscription(subscription.asaasId);
      } catch (asaasError) {
        console.warn('[ASAAS_CANCEL] Asaas cancellation failed, updating local subscription:', asaasError);
      }
    }

    // Update subscription status
    const updatedSubscription = await db.subscription.update({
      where: { userId },
      data: {
        status: 'canceled',
        autoRenew: false,
      },
    });

    // Downgrade user plan
    await db.user.update({
      where: { id: userId },
      data: {
        plan: 'free',
        role: 'free',
      },
    });

    return NextResponse.json({
      message: 'Subscription canceled successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('[SUBSCRIPTIONS_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
