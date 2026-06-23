'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Music, Headphones, Download, Wifi, Zap, Star, Check, Play,
  ChevronRight, Menu, X, Volume2, Mic2, Radio, Users, GraduationCap,
  Heart, Smartphone, ArrowRight, Globe, Shield, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscriptionPlans, genres } from '@/lib/mock-data';

interface LandingPageProps {
  onGetStarted: () => void;
}

// Animated section wrapper
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Navigation Bar
function NavBar({ onGetStarted }: { onGetStarted: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SoundFlow</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Recursos', 'Gêneros', 'Planos', 'Criadores'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-300 hover:text-emerald-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10"
              onClick={onGetStarted}
            >
              Entrar
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40"
              onClick={onGetStarted}
            >
              Começar Grátis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-950/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {['Recursos', 'Gêneros', 'Planos', 'Criadores'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-300 hover:text-emerald-400 py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Button variant="ghost" className="text-gray-300 hover:text-white w-full" onClick={onGetStarted}>Entrar</Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full font-semibold" onClick={onGetStarted}>Começar Grátis</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Hero Section
function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  // Client-side only check for SSR-safe rendering
  const isClient = typeof window !== 'undefined';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(5,150,105,0.1),transparent_50%)]" />

      {/* Floating music notes animation - client-only to avoid hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isClient && [0.8, 0.6, 0.9, 0.7, 0.95, 0.55].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-500/10"
            initial={{
              x: `${15 + i * 15}%`,
              y: '100%',
              scale: scale,
              rotate: i * 60,
            }}
            animate={{
              y: '-10%',
              rotate: i * 60 + 360,
            }}
            transition={{
              duration: 15 + i * 1.5,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear',
            }}
          >
            <Music className="w-8 h-8 md:w-12 md:h-12" />
          </motion.div>
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 text-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            A revolução da música brasileira
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight"
        >
          Sua música,{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            sem limites
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Milhões de músicas, podcasts e lives ao vivo. Recomendações com IA,
          áudio Hi-Fi e download offline. Tudo sem anúncios.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-105 group"
            onClick={onGetStarted}
          >
            Começar Grátis
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-full group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Ouça Agora
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '80M+', label: 'Músicas' },
            { value: '5M+', label: 'Artistas' },
            { value: '100M+', label: 'Ouvintes' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Hero Image / Player Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 relative max-w-3xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=600&fit=crop"
              alt="SoundFlow Player"
              className="w-full h-auto object-cover"
            />
            {/* Overlay player */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="flex items-center gap-4 bg-gray-900/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-white/10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
                    alt="Album"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-base truncate">Noites de São Paulo</p>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">Lucas Mendes • Urbanidade</p>
                </div>
                <Button size="icon" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-lg shadow-emerald-500/30 flex-shrink-0">
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'IA de Recomendações',
      description: 'Nossa IA aprende seu gosto musical e sugere faixas perfeitas para cada momento do seu dia.',
      color: 'from-emerald-500 to-green-400',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Download Offline',
      description: 'Baixe suas músicas e playlists favoritas para ouvir sem conexão, onde quer que vá.',
      color: 'from-cyan-500 to-blue-400',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'Áudio Hi-Fi',
      description: 'Qualidade de áudio sem perdas (FLAC) para uma experiência sonora incomparável.',
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    {
      icon: <Radio className="w-6 h-6" />,
      title: 'Podcasts & Lives',
      description: 'Podcasts exclusivos e transmissões ao vivo com seus artistas favoritos.',
      color: 'from-orange-500 to-amber-400',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Sem Anúncios',
      description: 'Ouça suas músicas sem interrupções. Apenas música, do começo ao fim.',
      color: 'from-rose-500 to-red-400',
      bgColor: 'bg-rose-500/10',
      iconColor: 'text-rose-400',
    },
    {
      icon: <Mic2 className="w-6 h-6" />,
      title: 'Letras em Tempo Real',
      description: 'Acompanhe as letras sincronizadas enquanto ouve suas músicas favoritas.',
      color: 'from-teal-500 to-emerald-400',
      bgColor: 'bg-teal-500/10',
      iconColor: 'text-teal-400',
    },
  ];

  return (
    <section id="recursos" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Recursos
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Tudo que você precisa para{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              ouvir mais
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Ferramentas poderosas para transformar sua experiência musical
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.1}>
              <Card className="bg-gray-900/50 border-white/5 hover:border-emerald-500/20 transition-all duration-300 group h-full hover:shadow-lg hover:shadow-emerald-500/5">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center ${feature.iconColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Genre Showcase Section
function GenreSection() {
  return (
    <section id="gêneros" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Gêneros
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Explore todos os{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              estilos
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Do MPB ao Funk, do Sertanejo à Eletrônica — tem música para todos os gostos
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre, index) => (
            <AnimatedSection key={genre.name} delay={index * 0.05}>
              <div className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square">
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${genre.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">
                    {genre.name}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: <Users className="w-8 h-8" />,
      title: 'Crie sua conta',
      description: 'Cadastre-se gratuitamente em segundos. Sem cartão de crédito necessário.',
    },
    {
      number: '02',
      icon: <Star className="w-8 h-8" />,
      title: 'Escolha seu plano',
      description: 'Do gratuito ao Premium Família — escolha o que combina com você.',
    },
    {
      number: '03',
      icon: <Headphones className="w-8 h-8" />,
      title: 'Ouça sem limites',
      description: 'Milhões de músicas, podcasts e lives ao seu alcance.',
    },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-950 to-gray-950" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Simples assim
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Como{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              funciona
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} delay={index * 0.15}>
              <div className="text-center group">
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto group-hover:bg-emerald-500/20 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2">
                    <ChevronRight className="w-6 h-6 text-emerald-500/40" />
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection({ onGetStarted }: { onGetStarted: () => void }) {
  const planIcons: Record<string, React.ReactNode> = {
    free: <Music className="w-5 h-5" />,
    premium_individual: <Headphones className="w-5 h-5" />,
    premium_duo: <Users className="w-5 h-5" />,
    premium_familia: <Heart className="w-5 h-5" />,
    premium_estudante: <GraduationCap className="w-5 h-5" />,
  };

  return (
    <section id="planos" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_70%)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Planos
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Escolha seu{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              plano
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Comece grátis. Upgrade quando quiser. Cancele a qualquer momento.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
          {subscriptionPlans.map((plan, index) => (
            <AnimatedSection key={plan.id} delay={index * 0.08}>
              <Card
                className={`relative bg-gray-900/50 border-white/5 h-full flex flex-col transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 scale-[1.02] md:scale-105'
                    : 'hover:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white border-0 px-3 py-1 shadow-lg shadow-emerald-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      plan.popular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'
                    }`}>
                      {planIcons[plan.id] || <Music className="w-5 h-5" />}
                    </div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      R${plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 text-sm">/mês</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-emerald-400' : 'text-gray-500'
                        }`} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                    onClick={onGetStarted}
                  >
                    {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Pagamento via PIX ou cartão. Processado com segurança pela Asaas.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Creator Section
function CreatorSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section id="criadores" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Para Artistas
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Compartilhe sua música com o{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Brasil
              </span>
            </h2>
            <p className="mt-4 text-gray-400 text-lg leading-relaxed">
              Junte-se a milhares de artistas independentes que já estão no SoundFlow.
              Publique suas músicas, faça lives, crie podcasts e ganhe dinheiro com
              sua arte.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Dashboard completa com analytics',
                'Monetização por streams e lives',
                'Saque direto via PIX',
                'Suporte dedicado para artistas',
                'Ferramentas de promoção',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 group"
                onClick={onGetStarted}
              >
                Seja um Criador
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=500&fit=crop"
                  alt="Criador SoundFlow"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-emerald-400 text-sm font-semibold">Analytics do Criador</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">Ao Vivo</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">45K</p>
                        <p className="text-gray-500 text-xs">Ouvintes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">1.2M</p>
                        <p className="text-gray-500 text-xs">Streams</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">R$3.4K</p>
                        <p className="text-gray-500 text-xs">Receita</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ana Beatriz',
      role: 'Ouvinte Premium',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      text: 'O SoundFlow mudou minha relação com música. As recomendações com IA são incríveis, sempre acertam!',
      rating: 5,
    },
    {
      name: 'Carlos Eduardo',
      role: 'Ouvinte Duo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      text: 'O plano Duo é perfeito para mim e minha esposa. Compartilhamos playlists e economizamos!',
      rating: 5,
    },
    {
      name: 'Marina Oliveira',
      role: 'Criadora',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      text: 'Como artista independente, o SoundFlow me deu visibilidade que nunca tive. Recebo por PIX direitinho!',
      rating: 5,
    },
    {
      name: 'Rafael Santos',
      role: 'Ouvinte Estudante',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      text: 'O desconto estudante é ótimo! Áudio Hi-Fi e offline por menos de 12 reais? Imbatível.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-950 to-gray-950" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Depoimentos
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            O que nossos{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              ouvintes
            </span>{' '}
            dizem
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} delay={index * 0.1}>
              <Card className="bg-gray-900/50 border-white/5 h-full hover:border-emerald-500/10 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-gray-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Download/App Section
function DownloadSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900/80" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-8 md:p-16">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Ouça em qualquer dispositivo
                </h2>
                <p className="mt-4 text-emerald-100/80 text-lg leading-relaxed">
                  Disponível para iOS, Android, desktop e web. Suas playlists
                  sincronizam automaticamente em todos os seus dispositivos.
                </p>
                <div className="mt-6 flex items-center gap-4 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-gray-100 font-bold rounded-full shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={onGetStarted}
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    Baixar App
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10 font-semibold rounded-full"
                    onClick={onGetStarted}
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Web Player
                  </Button>
                </div>
                <div className="mt-6 flex items-center gap-6 justify-center md:justify-start text-white/60 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4" />
                    Áudio Hi-Fi
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    Offline
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-4 h-4" />
                    Sincronização
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="relative">
                  {/* Phone mockup */}
                  <div className="w-48 h-80 md:w-56 md:h-96 bg-gray-950 rounded-[2rem] border-4 border-gray-800 shadow-2xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col">
                      {/* Status bar */}
                      <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-[10px] text-white/60">9:41</span>
                        <div className="flex items-center gap-1">
                          <Wifi className="w-2.5 h-2.5 text-white/60" />
                          <Volume2 className="w-2.5 h-2.5 text-white/60" />
                        </div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-xl mb-4">
                          <img
                            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
                            alt="Now Playing"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-white text-xs md:text-sm font-semibold truncate max-w-full">Noites de São Paulo</p>
                        <p className="text-gray-400 text-[10px] md:text-xs truncate max-w-full">Lucas Mendes</p>
                        {/* Progress bar */}
                        <div className="w-full mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-emerald-400 rounded-full" />
                        </div>
                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4 mt-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center">
                            <Music className="w-3 h-3 text-white/60" />
                          </div>
                          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center">
                            <Heart className="w-3 h-3 text-white/60" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SoundFlow</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              A plataforma de streaming que conecta a música brasileira ao mundo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Produto</h4>
            <ul className="space-y-2">
              {['Recursos', 'Planos', 'Download', 'Web Player'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Comunidade</h4>
            <ul className="space-y-2">
              {['Para Artistas', 'Desenvolvedores', 'Publicidade', 'Investidores'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Suporte</h4>
            <ul className="space-y-2">
              {['Ajuda', 'Contato', 'Termos de Uso', 'Privacidade'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} SoundFlow. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-xs">
            <span>Pagamentos por Asaas</span>
            <span className="text-white/10">|</span>
            <span>Feito com 💚 no Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <NavBar onGetStarted={onGetStarted} />
      <main className="flex-1">
        <HeroSection onGetStarted={onGetStarted} />
        <FeaturesSection />
        <GenreSection />
        <HowItWorksSection />
        <PricingSection onGetStarted={onGetStarted} />
        <CreatorSection onGetStarted={onGetStarted} />
        <TestimonialsSection />
        <DownloadSection onGetStarted={onGetStarted} />
      </main>
      <Footer />
    </div>
  );
}
