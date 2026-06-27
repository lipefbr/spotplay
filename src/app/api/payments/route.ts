import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createAsaasCustomer, createAsaasPayment, getPixQrCode, getAsaasPaymentStatus } from '@/lib/asaas';

// POST /api/payments - Create payment (PIX or credit card via Asaas)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount, method, description, subscriptionId, cpfCnpj, phone, cardInfo } = body;

    // Validate required fields
    if (!userId || !amount || !method) {
      return NextResponse.json(
        { error: 'userId, amount, and method are required' },
        { status: 400 }
      );
    }

    // Validate payment method
    const validMethods = ['pix', 'credit_card', 'debit_card'];
    if (!validMethods.includes(method)) {
      return NextResponse.json(
        { error: 'Invalid payment method. Use: pix, credit_card, or debit_card' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
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

    // Calculate due date (1 day for PIX, 3 days for others)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (method === 'pix' ? 1 : 3));

    // Map method to Asaas billing type
    const billingTypeMap: Record<string, string> = {
      pix: 'PIX',
      credit_card: 'CREDIT_CARD',
      debit_card: 'BOLETO',
    };

    let asaasPaymentId: string | null = null;
    let pixCode: string | null = null;
    let pixQrCode: string | null = null;

    // Try to create Asaas payment
    try {
      // Create or get Asaas customer
      const customer = await createAsaasCustomer({
        name: user.name || user.email,
        email: user.email,
        cpfCnpj: cpfCnpj || '00000000000',
        phone: phone || undefined,
      });

      // Create payment on Asaas
      const asaasPayment = await createAsaasPayment({
        customer: customer.id,
        billingType: billingTypeMap[method] as 'PIX' | 'CREDIT_CARD' | 'BOLETO',
        value: amount,
        description: description || 'SpotiPlay Payment',
        dueDate: dueDate.toISOString().split('T')[0],
      });

      asaasPaymentId = asaasPayment.id;

      // If PIX, get the QR code and copy-paste code
      if (method === 'pix' && asaasPayment.id) {
        try {
          const pixData = await getPixQrCode(asaasPayment.id);
          pixCode = pixData.payload || null;
          pixQrCode = pixData.encodedImage || null;
        } catch (pixError) {
          console.warn('[ASAAS_PIX] Failed to get PIX data:', pixError);
        }
      }
    } catch (asaasError) {
      console.warn('[ASAAS_PAYMENT] Asaas integration failed, creating local payment:', asaasError);
      // Continue without Asaas - create local payment only
    }

    // Create payment record in database
    const payment = await db.payment.create({
      data: {
        userId,
        subscriptionId: subscriptionId || null,
        amount,
        currency: 'BRL',
        method,
        status: 'pending',
        asaasId: asaasPaymentId,
        pixCode,
        pixQrCode,
        cardInfo: cardInfo || null,
        dueDate,
      },
    });

    return NextResponse.json(
      {
        message: 'Payment created successfully',
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          status: payment.status,
          pixCode: payment.pixCode,
          pixQrCode: payment.pixQrCode,
          dueDate: payment.dueDate,
          createdAt: payment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[PAYMENTS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/payments - Get payment status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const userId = searchParams.get('userId');

    // Get a specific payment by ID
    if (paymentId) {
      const payment = await db.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }

      // Try to get updated status from Asaas
      if (payment.asaasId && payment.status === 'pending') {
        try {
          const asaasStatus = await getAsaasPaymentStatus(payment.asaasId);
          const asaasPaymentStatus = asaasStatus.status;

          // Map Asaas status to our status
          const statusMap: Record<string, string> = {
            RECEIVED: 'confirmed',
            CONFIRMED: 'confirmed',
            RECEIVED_IN_CASH: 'confirmed',
            OVERDUE: 'failed',
            REFUNDED: 'refunded',
            PENDING: 'pending',
          };

          const newStatus = statusMap[asaasPaymentStatus] || payment.status;

          if (newStatus !== payment.status) {
            const updatedPayment = await db.payment.update({
              where: { id: paymentId },
              data: {
                status: newStatus,
                paidAt: newStatus === 'confirmed' ? new Date() : undefined,
              },
            });

            return NextResponse.json({ payment: updatedPayment });
          }
        } catch (asaasError) {
          console.warn('[ASAAS_STATUS] Failed to get Asaas status:', asaasError);
        }
      }

      return NextResponse.json({ payment });
    }

    // Get all payments for a user
    if (userId) {
      const payments = await db.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return NextResponse.json({ payments });
    }

    return NextResponse.json(
      { error: 'paymentId or userId query parameter is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[PAYMENTS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
