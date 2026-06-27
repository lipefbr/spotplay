'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Check, Music2, Download, Headphones, Shuffle, Sparkles,
  CreditCard, QrCode, Shield, Zap, Loader2, Copy, CheckCheck,
  ArrowLeft, AlertCircle, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppStore } from '@/stores/app-store';
import { subscriptionPlans } from '@/lib/mock-data';
import {
  formatCurrency, formatCPF, formatCardNumber, formatExpiry,
  validateCPF, getCardBrand,
} from '@/lib/asaas';

type PaymentMethod = 'pix' | 'credit_card';
type Step = 'plans' | 'payment' | 'processing' | 'success' | 'pix_waiting';

export default function PremiumView() {
  const { user } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState('premium_individual');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [step, setStep] = useState<Step>('plans');

  // Form fields
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [holderCpf, setHolderCpf] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressNumber, setAddressNumber] = useState('');

  // Payment result
  const [pixCode, setPixCode] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [nextBillingDay, setNextBillingDay] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const plan = subscriptionPlans.find((p) => p.id === selectedPlan);

  const features = [
    { icon: Music2, label: 'Sem anúncios' },
    { icon: Download, label: 'Download offline' },
    { icon: Headphones, label: 'Qualidade máxima' },
    { icon: Shuffle, label: 'Pular ilimitado' },
    { icon: Sparkles, label: 'IA DJ' },
    { icon: Zap, label: 'Áudio Hi-Fi' },
  ];

  const cardBrand = getCardBrand(cardNumber);

  const handleSubmit = async () => {
    setError('');

    // Validate CPF
    if (!validateCPF(cpf)) {
      setError('CPF inválido');
      return;
    }

    // Validate credit card fields
    if (paymentMethod === 'credit_card') {
      if (cardNumber.replace(/\s/g, '').length < 13) {
        setError('Número do cartão inválido');
        return;
      }
      if (!cardName.trim()) {
        setError('Nome no cartão é obrigatório');
        return;
      }
      if (cardExpiry.length < 5) {
        setError('Validade inválida');
        return;
      }
      if (cardCvv.length < 3) {
        setError('CVV inválido');
        return;
      }
      if (!validateCPF(holderCpf)) {
        setError('CPF do titular do cartão inválido');
        return;
      }
    }

    setStep('processing');

    try {
      const body: Record<string, unknown> = {
        userId: user?.id,
        plan: selectedPlan,
        billingType: paymentMethod === 'pix' ? 'PIX' : 'CREDIT_CARD',
        cpfCnpj: cpf.replace(/\D/g, ''),
        phone,
        postalCode,
        addressNumber,
      };

      if (paymentMethod === 'credit_card') {
        body.creditCardNumber = cardNumber.replace(/\s/g, '');
        body.creditCardHolderName = cardName;
        body.creditCardExpiryMonth = cardExpiry.split('/')[0];
        body.creditCardExpiryYear = cardExpiry.split('/')[1];
        body.creditCardCvv = cardCvv;
        body.creditCardHolderCpfCnpj = holderCpf.replace(/\D/g, '');
        body.creditCardHolderPostalCode = postalCode;
        body.creditCardHolderAddressNumber = addressNumber;
      }

      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao criar assinatura');
        setStep('payment');
        return;
      }

      if (paymentMethod === 'pix' && data.pix) {
        setPixCode(data.pix.pixCode || '');
        setPixQrCode(data.pix.pixQrCode || '');
        setNextBillingDay(data.subscription?.nextBillingDay || new Date().getDate());
        setStep('pix_waiting');
      } else {
        setCardLast4(data.card?.last4 || '');
        setNextBillingDay(data.subscription?.nextBillingDay || new Date().getDate());
        setStep('success');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
      setStep('payment');
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 pt-2 pb-8 lg:px-6 max-w-5xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-gray-900 p-8 mb-8 lg:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-yellow-400" />
            <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">Premium</Badge>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 lg:text-4xl">
            SpotiPlay Premium
          </h1>
          <p className="text-emerald-100 text-lg mb-6 max-w-xl">
            Ouça sem limites. Sem anúncios, download offline, qualidade máxima e muito mais.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {features.map((feat) => (
              <div key={feat.label} className="flex items-center gap-2 text-sm text-emerald-100">
                <feat.icon className="h-4 w-4 shrink-0 text-emerald-300" />
                <span className="text-xs sm:text-sm">{feat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ===== STEP: PLAN SELECTION ===== */}
        {step === 'plans' && (
          <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-bold text-white mb-4">Escolha seu plano</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {subscriptionPlans.filter((p) => p.price > 0).map((p) => (
                <motion.div key={p.id} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Card
                    className={`relative cursor-pointer border-0 p-5 transition-all ${
                      selectedPlan === p.id
                        ? 'bg-emerald-500/20 ring-2 ring-emerald-500'
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedPlan(p.id)}
                  >
                    {p.popular && (
                      <Badge className="absolute -top-2 right-4 bg-emerald-500 text-white text-[10px]">Popular</Badge>
                    )}
                    <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
                    <p className="text-2xl font-bold text-emerald-400 mb-1">
                      {formatCurrency(p.price)}
                      <span className="text-sm font-normal text-gray-400">/mês</span>
                    </p>
                    <Separator className="my-3 bg-gray-700" />
                    <ul className="space-y-2">
                      {p.features.slice(0, 3).map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                          {feat}
                        </li>
                      ))}
                      {p.features.length > 3 && (
                        <li className="text-xs text-gray-500">+{p.features.length - 3} mais</li>
                      )}
                    </ul>
                    {selectedPlan === p.id && (
                      <div className="absolute top-3 right-3">
                        <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Plan Detail */}
            {plan && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 mb-6">
                <Card className="border-0 bg-gray-800/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Detalhes: {plan.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Preço</p>
                      <p className="text-2xl font-bold text-emerald-400">{formatCurrency(plan.price)}/mês</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Cobrança</p>
                      <p className="text-lg font-semibold text-white">Recorrente mensalmente</p>
                      <p className="text-xs text-gray-400 mt-1">Cobrado no mesmo dia todo mês</p>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-700" />
                  <h4 className="text-sm font-semibold text-white mb-3">Todas as funcionalidades:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            <div className="text-center">
              <Button
                size="lg"
                className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 px-8 text-base"
                onClick={() => setStep('payment')}
              >
                Assinar agora
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                Cancele quando quiser. Sem compromisso.
              </p>
            </div>
          </motion.div>
        )}

        {/* ===== STEP: PAYMENT FORM ===== */}
        {step === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-0 bg-gray-800/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Pagamento</h3>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => setStep('plans')}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
              </div>

              {/* Order Summary */}
              <div className="rounded-lg bg-gray-900 p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Plano</p>
                    <p className="text-base font-semibold text-white">{plan?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">{plan ? formatCurrency(plan.price) : ''}</p>
                    <p className="text-xs text-gray-400">/mês • Cobrança recorrente</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  📅 Se você assinar hoje, todo dia <strong className="text-gray-300">{new Date().getDate()}</strong> será cobrado o valor da assinatura.
                </p>
              </div>

              {/* Payment Method Selection */}
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                className="mb-6"
              >
                <div className="flex gap-3">
                  <Label
                    className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <RadioGroupItem value="pix" className="sr-only" />
                    <QrCode className={`h-5 w-5 ${paymentMethod === 'pix' ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm font-semibold text-white">PIX</p>
                      <p className="text-xs text-gray-400">Pagamento instantâneo</p>
                    </div>
                  </Label>

                  <Label
                    className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                      paymentMethod === 'credit_card'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <RadioGroupItem value="credit_card" className="sr-only" />
                    <CreditCard className={`h-5 w-5 ${paymentMethod === 'credit_card' ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm font-semibold text-white">Cartão de Crédito</p>
                      <p className="text-xs text-gray-400">Débito automático mensal</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Common Fields (CPF + Phone) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">CPF *</Label>
                  <Input
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">Telefone</Label>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">CEP</Label>
                  <Input
                    placeholder="00000-000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">Número</Label>
                  <Input
                    placeholder="123"
                    value={addressNumber}
                    onChange={(e) => setAddressNumber(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Credit Card Fields */}
              {paymentMethod === 'credit_card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 mb-6"
                >
                  <Separator className="bg-gray-700" />
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-400" />
                    Dados do Cartão
                  </h4>

                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">Número do Cartão *</Label>
                    <div className="relative">
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 pr-16"
                        maxLength={19}
                      />
                      {cardBrand !== 'unknown' && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-400 uppercase">
                          {cardBrand}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">Nome no Cartão *</Label>
                    <Input
                      placeholder="Nome completo como no cartão"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-400 mb-1.5 block">Validade *</Label>
                      <Input
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-400 mb-1.5 block">CVV *</Label>
                      <Input
                        placeholder="000"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">CPF do Titular *</Label>
                    <Input
                      placeholder="000.000.000-00"
                      value={holderCpf}
                      onChange={(e) => setHolderCpf(formatCPF(e.target.value))}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                      maxLength={14}
                    />
                  </div>

                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                    <p className="text-xs text-emerald-300">
                      💳 <strong>Débito automático:</strong> Ao pagar com cartão, o valor será debitado automaticamente todo dia <strong>{new Date().getDate()}</strong> de cada mês. Você pode cancelar a qualquer momento.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* PIX Info */}
              {paymentMethod === 'pix' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6"
                >
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                    <p className="text-xs text-emerald-300">
                      📱 <strong>PIX:</strong> Após confirmar, você receberá um QR Code para pagamento. A cada mês, um novo PIX será gerado automaticamente no dia <strong>{new Date().getDate()}</strong>.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <Shield className="h-4 w-4 text-emerald-400" />
                Pagamento processado com segurança via Asaas • Seus dados de cartão não são armazenados
              </div>

              {/* Confirm Button */}
              <Button
                size="lg"
                className="w-full rounded-full bg-emerald-500 text-white hover:bg-emerald-600 text-base"
                onClick={handleSubmit}
              >
                Confirmar assinatura — {plan ? formatCurrency(plan.price) : 'R$ 0,00'}/mês
              </Button>
            </Card>
          </motion.div>
        )}

        {/* ===== STEP: PROCESSING ===== */}
        {step === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-emerald-400 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Processando pagamento...</h3>
            <p className="text-sm text-gray-400">
              {paymentMethod === 'credit_card'
                ? 'Verificando seu cartão de crédito'
                : 'Gerando QR Code PIX'}
            </p>
          </motion.div>
        )}

        {/* ===== STEP: PIX WAITING ===== */}
        {step === 'pix_waiting' && (
          <motion.div key="pix_waiting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 bg-gray-800/50 p-6">
              <div className="text-center mb-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mb-4">
                  <QrCode className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Escaneie o QR Code PIX</h3>
                <p className="text-sm text-gray-400">
                  Pague <strong className="text-emerald-400">{plan ? formatCurrency(plan.price) : ''}</strong> para ativar seu Premium
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-lg bg-gray-900 mb-4">
                {/* QR Code */}
                <div className="h-56 w-56 bg-white rounded-xl flex items-center justify-center mb-4 p-3">
                  {pixQrCode ? (
                    <img src={`data:image/png;base64,${pixQrCode}`} alt="QR Code PIX" className="h-full w-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <QrCode className="h-20 w-20 text-gray-800 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">QR Code PIX</p>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-3">Ou copie o código PIX:</p>
                <div className="flex items-center gap-2 w-full max-w-md">
                  <Input
                    readOnly
                    value={pixCode || 'Código PIX indisponível'}
                    className="bg-gray-800 border-gray-700 text-xs text-gray-300"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-gray-700 text-gray-300 hover:text-white"
                    onClick={copyPixCode}
                    disabled={!pixCode}
                  >
                    {copied ? <CheckCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 mb-4">
                <p className="text-xs text-emerald-300">
                  📅 Após o pagamento, seu Premium será ativado automaticamente. Todo dia <strong>{nextBillingDay}</strong> será gerada uma nova cobrança PIX.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Shield className="h-4 w-4 text-emerald-400" />
                Pagamento processado com segurança via Asaas
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:text-white"
                  onClick={() => setStep('plans')}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
                <Button
                  className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600"
                  onClick={() => {
                    // Poll for payment confirmation
                    // In production, the webhook would handle this
                    setStep('success');
                  }}
                >
                  <Check className="h-4 w-4 mr-1" /> Já paguei
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ===== STEP: SUCCESS ===== */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-0 bg-gray-800/50 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 mb-6"
              >
                <Crown className="h-10 w-10 text-emerald-400" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-2">Premium Ativado! 🎉</h3>
              <p className="text-gray-400 mb-6">
                {paymentMethod === 'credit_card'
                  ? `Seu cartão ****${cardLast4} será debitado automaticamente todo dia ${nextBillingDay}.`
                  : `Seu Premium está ativo! Todo dia ${nextBillingDay} será gerada uma nova cobrança PIX.`}
              </p>

              <div className="rounded-lg bg-gray-900 p-4 mb-6 max-w-sm mx-auto">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-xs text-gray-500">Plano</p>
                    <p className="text-sm font-semibold text-white">{plan?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valor</p>
                    <p className="text-sm font-semibold text-emerald-400">{plan ? formatCurrency(plan.price) : ''}/mês</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pagamento</p>
                    <p className="text-sm font-semibold text-white">
                      {paymentMethod === 'credit_card' ? `Cartão ****${cardLast4}` : 'PIX'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Próxima cobrança</p>
                    <p className="text-sm font-semibold text-white">Dia {nextBillingDay}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6">
                <Shield className="h-4 w-4 text-emerald-400" />
                Gerenciado com segurança via Asaas
              </div>

              <Button
                size="lg"
                className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 px-8"
                onClick={() => {
                  // Force page reload to update user state
                  window.location.reload();
                }}
              >
                Começar a ouvir
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
