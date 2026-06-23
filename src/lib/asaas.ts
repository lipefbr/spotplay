// Asaas Payment Integration
// API Docs: https://docs.asaas.com/

const ASASS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASASS_API_KEY = process.env.ASAAS_API_KEY || '';

interface AsaasCustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
}

interface AsaasPaymentData {
  customer: string;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  value: number;
  description: string;
  dueDate?: string;
  installmentCount?: number;
  installmentValue?: number;
}

export async function createAsaasCustomer(data: AsaasCustomerData) {
  const response = await fetch(`${ASASS_API_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASASS_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Failed to create customer');
  }

  return response.json();
}

export async function createAsaasPayment(data: AsaasPaymentData) {
  const response = await fetch(`${ASASS_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASASS_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Failed to create payment');
  }

  return response.json();
}

export async function getPixQrCode(paymentId: string) {
  const response = await fetch(`${ASASS_API_URL}/payments/${paymentId}/pixQrCode`, {
    headers: {
      'access_token': ASASS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get PIX QR Code');
  }

  return response.json();
}

export async function createAsaasSubscription(data: {
  customer: string;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  value: number;
  description: string;
  cycle: 'MONTHLY' | 'YEARLY';
  nextDueDate: string;
}) {
  const response = await fetch(`${ASASS_API_URL}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASASS_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Failed to create subscription');
  }

  return response.json();
}

export async function getAsaasPaymentStatus(paymentId: string) {
  const response = await fetch(`${ASASS_API_URL}/payments/${paymentId}`, {
    headers: {
      'access_token': ASASS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get payment status');
  }

  return response.json();
}

export async function cancelAsaasSubscription(subscriptionId: string) {
  const response = await fetch(`${ASASS_API_URL}/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
    headers: {
      'access_token': ASASS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }

  return response.json();
}

// Helper to format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Helper to format play count
export function formatPlayCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toString();
}

// Helper to format duration
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
