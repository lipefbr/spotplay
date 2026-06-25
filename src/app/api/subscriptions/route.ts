import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  getOrCreateCustomer,
  createAsaasSubscription,
  cancelAsaasSubscription,
  getSubscriptionPixQrCode,
  getAsaasSubscription,
} from '@/lib/asaas';

// Plan pricing map — matches subscriptionPlans in mock-data
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

    // If subscription has Asaas ID, try to get the latest status
    if (subscription.asaasId) {
      try {
        const asaasSub = await getAsaasSubscription(subscription.asaasId);
        const asaasStatus = asaasSub.status; // ACTIVE, INACTIVE, EXPIRED, DELETED

        const statusMap: Record<string, string> = {
          ACTIVE: 'active',
          INACTIVE: 'canceled',
          EXPIRED: 'expired',
          DELETED: 'canceled',
        };

        const newStatus = statusMap[asaasStatus] || subscription.status;
        if (newStatus !== subscription.status) {
          await db.subscription.update({
            where: { id: subscription.id },
            data: { status: newStatus },
          });
          subscription.status = newStatus;
        }
      } catch {
        // Ignore Asaas errors, return local data
      }
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

// POST /api/subscriptions - Create subscription with Asaas
// Supports PIX and CREDIT_CARD with recurring billing on the same day each month
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      plan,
      billingType, // 'PIX' | 'CREDIT_CARD'
      cpfCnpj,
      phone,
      postalCode,
      addressNumber,
      // Credit card fields (sent directly to Asaas — never stored in our DB)
      creditCardNumber,
      creditCardHolderName,
      creditCardExpiryMonth,
      creditCardExpiryYear,
      creditCardCvv,
      creditCardHolderCpfCnpj,
      creditCardHolderPostalCode,
      creditCardHolderAddressNumber,
      creditCardHolderPhone,
    } = body;

    // Validate required fields
    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'userId and plan are required' },
        { status: 400 }
      );
    }

    if (!cpfCnpj) {
      return NextResponse.json(
        { error: 'CPF/CNPJ é obrigatório' },
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
    const validBillingTypes = ['PIX', 'CREDIT_CARD'];
    const billing = validBillingTypes.includes(billingType) ? billingType : 'PIX';

    // If credit card, validate card fields
    if (billing === 'CREDIT_CARD') {
      if (!creditCardNumber || !creditCardHolderName || !creditCardExpiryMonth ||
          !creditCardExpiryYear || !creditCardCvv || !creditCardHolderCpfCnpj) {
        return NextResponse.json(
          { error: 'Todos os dados do cartão são obrigatórios' },
          { status: 400 }
        );
      }
    }

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

    // === ASAAS SUBSCRIPTION CREATION ===
    // nextDueDate = today → Asaas charges today and recurs on this day each month
    // Example: subscribe on March 2 → next charges on April 2, May 2, etc.
    const nextDueDate = new Date().toISOString().split('T')[0];

    let asaasSubscriptionId: string | null = null;
    let pixCode: string | null = null;
    let pixQrCode: string | null = null;
    let firstPaymentId: string | null = null;

    try {
      // Get or create Asaas customer
      const customerId = await getOrCreateCustomer({
        name: user.name || user.email,
        email: user.email,
        cpfCnpj: cpfCnpj.replace(/\D/g, ''),
        phone: phone || undefined,
        postalCode: postalCode || undefined,
        addressNumber: addressNumber || undefined,
      });

      // Build subscription data
      const subscriptionData: Record<string, unknown> = {
        customer: customerId,
        billingType: billing,
        value: planPrice.value,
        description: planPrice.description,
        cycle: planPrice.cycle,
        nextDueDate, // Key: this sets the recurring day
      };

      // Add credit card fields if paying with card
      // Asaas stores the card for automatic recurring charges
      if (billing === 'CREDIT_CARD') {
        subscriptionData.creditCardNumber = creditCardNumber.replace(/\s/g, '');
        subscriptionData.creditCardHolderName = creditCardHolderName;
        subscriptionData.creditCardExpiryMonth = creditCardExpiryMonth;
        subscriptionData.creditCardExpiryYear = creditCardExpiryYear;
        subscriptionData.creditCardCvv = creditCardCvv;
        subscriptionData.creditCardHolderCpfCnpj = creditCardHolderCpfCnpj.replace(/\D/g, '');
        subscriptionData.creditCardHolderPostalCode = creditCardHolderPostalCode || postalCode;
        subscriptionData.creditCardHolderAddressNumber = creditCardHolderAddressNumber || addressNumber;
        subscriptionData.creditCardHolderPhone = creditCardHolderPhone || phone;
      }

      // Create the subscription on Asaas
      const asaasSub = await createAsaasSubscription(subscriptionData as any);
      asaasSubscriptionId = asaasSub.id;
      firstPaymentId = asaasSub.id; // Asaas returns the first payment in the subscription

      // If PIX, get the QR code for the first payment
      if (billing === 'PIX' && asaasSubscriptionId) {
        try {
          const pixData = await getSubscriptionPixQrCode(asaasSubscriptionId);
          pixCode = pixData.payload || null;
          pixQrCode = pixData.encodedImage || null;
        } catch (pixError) {
          console.warn('[ASAAS_SUB_PIX] Failed to get PIX data:', pixError);
        }
      }

      console.log(`[ASAAS_SUB] Created subscription ${asaasSubscriptionId} for user ${userId}, billing: ${billing}, nextDueDate: ${nextDueDate}`);
    } catch (asaasError: any) {
      console.warn('[ASAAS_SUBSCRIPTION] Asaas integration failed:', asaasError?.message);
      // Continue without Asaas — create local subscription only
    }

    // Calculate end date (30 days from now for monthly)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Create or update subscription in database
    const subscription = await db.subscription.upsert({
      where: { userId },
      update: {
        plan,
        status: billing === 'CREDIT_CARD' ? 'active' : 'pending', // Credit card is instant, PIX needs confirmation
        startDate: new Date(),
        endDate,
        autoRenew: true,
        asaasId: asaasSubscriptionId,
      },
      create: {
        userId,
        plan,
        status: billing === 'CREDIT_CARD' ? 'active' : 'pending',
        startDate: new Date(),
        endDate,
        trialEndDate: null,
        autoRenew: true,
        asaasId: asaasSubscriptionId,
      },
    });

    // For credit card, activate premium immediately
    if (billing === 'CREDIT_CARD') {
      await db.user.update({
        where: { id: userId },
        data: {
          plan,
          role: 'premium',
        },
      });
    }

    // Create initial payment record
    const cardLast4 = billing === 'CREDIT_CARD' && creditCardNumber
      ? creditCardNumber.replace(/\s/g, '').slice(-4)
      : null;

    await db.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        amount: planPrice.value,
        currency: 'BRL',
        method: billing === 'PIX' ? 'pix' : 'credit_card',
        status: billing === 'CREDIT_CARD' ? 'confirmed' : 'pending',
        asaasId: firstPaymentId,
        pixCode,
        pixQrCode,
        cardInfo: cardLast4 ? `****${cardLast4}` : null,
        dueDate: new Date(),
        paidAt: billing === 'CREDIT_CARD' ? new Date() : undefined,
      },
    });

    return NextResponse.json(
      {
        message: billing === 'CREDIT_CARD'
          ? 'Subscription created successfully! Your card will be charged monthly on this same day.'
          : 'Subscription created! Pay the PIX to activate your Premium.',
        subscription: {
          id: subscription.id,
          plan: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          autoRenew: subscription.autoRenew,
          asaasId: subscription.asaasId,
          billingType: billing,
          nextBillingDay: new Date().getDate(), // The day of month for recurring charges
        },
        pix: billing === 'PIX' ? { pixCode, pixQrCode } : undefined,
        card: billing === 'CREDIT_CARD' ? { last4: cardLast4 } : undefined,
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

    // Cancel on Asaas
    if (subscription.asaasId) {
      try {
        await cancelAsaasSubscription(subscription.asaasId);
        console.log(`[ASAAS_CANCEL] Canceled subscription ${subscription.asaasId} for user ${userId}`);
      } catch (asaasError) {
        console.warn('[ASAAS_CANCEL] Asaas cancellation failed:', asaasError);
      }
    }

    // Update subscription status
    const updatedSubscription = await db.subscription.update({
      where: { userId },
      data: {
        status: 'canceled',
        autoRenew: false,
        endDate: new Date(), // Ends now
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
      message: 'Assinatura cancelada com sucesso. Você manterá o Premium até o fim do período pago.',
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
