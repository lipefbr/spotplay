'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  Music2,
  Download,
  Headphones,
  Shuffle,
  Sparkles,
  CreditCard,
  QrCode,
  Shield,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { subscriptionPlans } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/asaas';

type PaymentMethod = 'pix' | 'credit_card';

export default function PremiumView() {
  const [selectedPlan, setSelectedPlan] = useState('premium_individual');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [showPayment, setShowPayment] = useState(false);

  const plan = subscriptionPlans.find((p) => p.id === selectedPlan);

  const features = [
    { icon: Music2, label: 'Sem anúncios' },
    { icon: Download, label: 'Download offline' },
    { icon: Headphones, label: 'Qualidade máxima' },
    { icon: Shuffle, label: 'Pular ilimitado' },
    { icon: Sparkles, label: 'IA DJ' },
    { icon: Zap, label: 'Áudio Hi-Fi' },
  ];

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
            SoundFlow Premium
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

      {/* Plan Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Escolha seu plano</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subscriptionPlans.filter((p) => p.price > 0).map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Card
                className={`relative cursor-pointer border-0 p-5 transition-all ${
                  selectedPlan === p.id
                    ? 'bg-emerald-500/20 ring-2 ring-emerald-500'
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedPlan(p.id)}
              >
                {p.popular && (
                  <Badge className="absolute -top-2 right-4 bg-emerald-500 text-white text-[10px]">
                    Popular
                  </Badge>
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
      </div>

      {/* Plan Detail */}
      {plan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Card className="border-0 bg-gray-800/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Detalhes do plano: {plan.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">Preço</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(plan.price)}/mês
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Período</p>
                <p className="text-lg font-semibold text-white">
                  {plan.period === 'monthly' ? 'Mensal' : 'Anual'}
                </p>
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

      {/* Payment Section */}
      {!showPayment ? (
        <div className="text-center">
          <Button
            size="lg"
            className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 px-8 text-base"
            onClick={() => setShowPayment(true)}
          >
            Assinar agora
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            Cancele quando quiser. Sem compromisso.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 bg-gray-800/50 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Pagamento</h3>

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
                    <p className="text-xs text-gray-400">Visa, Mastercard, Elo</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {/* PIX Payment */}
            {paymentMethod === 'pix' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center p-6 rounded-lg bg-gray-900">
                  <div className="h-48 w-48 bg-white rounded-xl flex items-center justify-center mb-4">
                    <div className="text-center p-4">
                      <QrCode className="h-24 w-24 text-gray-800 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">QR Code PIX</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Escaneie o QR Code ou copie o código</p>
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <Input
                      readOnly
                      value="00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6..."
                      className="bg-gray-800 border-gray-700 text-xs text-gray-300"
                    />
                    <Button variant="outline" size="sm" className="shrink-0 border-gray-700 text-gray-300 hover:text-white">
                      Copiar
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Pagamento processado com segurança via Asaas
                </div>
              </motion.div>
            )}

            {/* Credit Card Payment */}
            {paymentMethod === 'credit_card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">Número do Cartão</Label>
                  <Input
                    placeholder="0000 0000 0000 0000"
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">Validade</Label>
                    <Input
                      placeholder="MM/AA"
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-400 mb-1.5 block">CVV</Label>
                    <Input
                      placeholder="000"
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">Nome no Cartão</Label>
                  <Input
                    placeholder="Nome completo"
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-400 mb-1.5 block">CPF</Label>
                  <Input
                    placeholder="000.000.000-00"
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Pagamento processado com segurança via Asaas
                </div>
              </motion.div>
            )}

            {/* Confirm Button */}
            <div className="mt-6">
              <Button
                size="lg"
                className="w-full rounded-full bg-emerald-500 text-white hover:bg-emerald-600 text-base"
              >
                Confirmar pagamento — {plan ? formatCurrency(plan.price) : 'R$ 0,00'}/mês
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2 text-gray-400 hover:text-white"
                onClick={() => setShowPayment(false)}
              >
                Voltar
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
