// Asaas Payment Integration
// API Docs: https://docs.asaas.com/

const ASASS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASASS_API_KEY = process.env.ASAAS_API_KEY || '';

// ===== INTERFACES =====

interface AsaasCustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  postalCode?: string;
  addressNumber?: string;
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

interface AsaasCreditCardData {
  creditCardNumber?: string;
  creditCardHolderName?: string;
  creditCardExpiryMonth?: string;
  creditCardExpiryYear?: string;
  creditCardCvv?: string;
  creditCardHolderCpfCnpj?: string;
  creditCardHolderPostalCode?: string;
  creditCardHolderAddressNumber?: string;
  creditCardHolderPhone?: string;
}

interface AsaasSubscriptionData {
  customer: string;
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  value: number;
  description: string;
  cycle: 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'YEARLY';
  nextDueDate: string; // YYYY-MM-DD - Dia da cobrança recorrente
  creditCardNumber?: string;
  creditCardHolderName?: string;
  creditCardExpiryMonth?: string;
  creditCardExpiryYear?: string;
  creditCardCvv?: string;
  creditCardHolderCpfCnpj?: string;
  creditCardHolderPostalCode?: string;
  creditCardHolderAddressNumber?: string;
  creditCardHolderPhone?: string;
}

// ===== CUSTOMER =====

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

/** Find existing customer by CPF/CNPJ or email */
export async function findAsaasCustomer(cpfCnpj: string, email: string): Promise<string | null> {
  const response = await fetch(`${ASASS_API_URL}/customers?cpfCnpj=${cpfCnpj}`, {
    headers: { 'access_token': ASASS_API_KEY },
  });

  if (!response.ok) return null;

  const data = await response.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].id;
  }

  // Try by email
  const responseEmail = await fetch(`${ASASS_API_URL}/customers?email=${encodeURIComponent(email)}`, {
    headers: { 'access_token': ASASS_API_KEY },
  });

  if (!responseEmail.ok) return null;
  const dataEmail = await responseEmail.json();
  if (dataEmail.data && dataEmail.data.length > 0) {
    return dataEmail.data[0].id;
  }

  return null;
}

/** Get or create an Asaas customer */
export async function getOrCreateCustomer(data: AsaasCustomerData): Promise<string> {
  // Try to find existing customer first
  const existingId = await findAsaasCustomer(data.cpfCnpj, data.email);
  if (existingId) return existingId;

  // Create new customer
  const customer = await createAsaasCustomer(data);
  return customer.id;
}

// ===== PAYMENTS (one-time) =====

export async function createAsaasPayment(data: AsaasPaymentData & AsaasCreditCardData) {
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

/** Get PIX QR code for a subscription's first payment */
export async function getSubscriptionPixQrCode(subscriptionId: string) {
  // First get the subscription's current payment
  const response = await fetch(`${ASASS_API_URL}/subscriptions/${subscriptionId}/payments`, {
    headers: { 'access_token': ASASS_API_KEY },
  });

  if (!response.ok) {
    throw new Error('Failed to get subscription payments');
  }

  const data = await response.json();
  if (!data.data || data.data.length === 0) {
    throw new Error('No payment found for subscription');
  }

  const paymentId = data.data[0].id;
  return getPixQrCode(paymentId);
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

// ===== SUBSCRIPTIONS (recurring) =====

/**
 * Create a recurring subscription on Asaas.
 * The nextDueDate determines the billing day each month.
 * Example: nextDueDate = "2024-03-02" → charges on day 2 every month.
 * If billingType is CREDIT_CARD, the card details are stored for automatic recurring charges.
 * If billingType is PIX, the subscriber needs to pay each month (Asaas generates a new PIX each cycle).
 */
export async function createAsaasSubscription(data: AsaasSubscriptionData) {
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

/** Get subscription details from Asaas */
export async function getAsaasSubscription(subscriptionId: string) {
  const response = await fetch(`${ASASS_API_URL}/subscriptions/${subscriptionId}`, {
    headers: { 'access_token': ASASS_API_KEY },
  });

  if (!response.ok) {
    throw new Error('Failed to get subscription');
  }

  return response.json();
}

/** List payments for a subscription */
export async function getSubscriptionPayments(subscriptionId: string) {
  const response = await fetch(`${ASASS_API_URL}/subscriptions/${subscriptionId}/payments`, {
    headers: { 'access_token': ASASS_API_KEY },
  });

  if (!response.ok) {
    throw new Error('Failed to get subscription payments');
  }

  return response.json();
}

/** Cancel a subscription on Asaas (DELETE request) */
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

/** Update a subscription on Asaas */
export async function updateAsaasSubscription(subscriptionId: string, data: Partial<AsaasSubscriptionData>) {
  const response = await fetch(`${ASASS_API_URL}/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASASS_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || 'Failed to update subscription');
  }

  return response.json();
}

// ===== HELPERS =====

/** Format currency in BRL */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/** Format play count (e.g., 597000 → 597K) */
export function formatPlayCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toString();
}

/** Format duration in seconds to m:ss */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/** Format CPF: 000.000.000-00 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/** Format card number: 0000 0000 0000 0000 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** Format expiry: MM/AA */
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Validate CPF */
export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  if (parseInt(digits[9]) !== check) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  if (parseInt(digits[10]) !== check) return false;

  return true;
}

/** Get card brand from number */
export function getCardBrand(number: string): 'visa' | 'mastercard' | 'elo' | 'amex' | 'unknown' {
  const digits = number.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  // Elo ranges (simplified)
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|5090|6277|6362|6363)/.test(digits)) return 'elo';
  return 'unknown';
}
