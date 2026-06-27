# SpotiPlay

Plataforma de streaming de música com Next.js 16, TypeScript, Tailwind CSS, Prisma e PostgreSQL.

## Funcionalidades

- Streaming de música com player completo
- Sistema de assinatura Premium (Asaas - PIX/Cartão)
- Lives ao vivo com transmissão de áudio via WebSocket
- Podcasts com upload de episódios
- Painel de criador com analytics
- Painel administrativo
- Sistema de anúncios para usuários free
- Busca de músicas no YouTube

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (Neon) + Prisma ORM
- **State**: Zustand + TanStack Query
- **Real-time**: Socket.io (mini-service)
- **Payments**: Asaas API
- **Charts**: Recharts

## Setup

1. Clone o repositório
2. `bun install`
3. Configure `.env` (veja `.env.example`)
4. `bun run db:push`
5. Acesse `/api/auth/seed` para criar usuários demo
6. `bun run dev`

## Credenciais Demo

- Admin: admin@soundflow.com / admin123
- User: user@soundflow.com / user123

## Deploy

Configurado para Vercel. Adicione as variáveis de ambiente no painel da Vercel.
