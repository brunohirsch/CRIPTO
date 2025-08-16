# Backend (Node + Express + TypeScript)

Integrações:
- Binance (Spot + UserAsset)
- Mercado Bitcoin v4 (authorize/accounts/balances)
- CoinMarketCap (quotes/latest em USD/BRL)
- Persistência de **Configurações** (Prisma): `cfopOverrides` e `rowOrder`

## Setup
```bash
cd backend
cp .env.example .env   # cole suas chaves
npm i
npm run prisma:push
npm run dev            # http://localhost:8787
```

## Endpoints
- `GET /api/portfolio` → { totalUSD, totalBRL, breakdown[], settings }
- `GET /api/balances/binance`
- `GET /api/balances/mercadobitcoin`
- `GET /api/prices/quotes?symbols=BTC,ETH&convert=USD,BRL`
- `GET/POST/DELETE /api/manual`
- `GET /api/settings`
- `PUT /api/settings/cfop` → body: `{ overrides: { SYMBOL: "C|F|O|P", ... } }`
- `PUT /api/settings/order` → body: `{ order: ["BTC","ETH",...] }`
