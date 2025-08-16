# BRUNO HIRSCH · CRIPTOMOEDAS — Plataforma Full-Stack

**Pronto para deploy**: Backend (Express/TS) + Frontend (React/Vite) + edição de **CFOP** (C/F/O/P) e **ordem por arrastar**.
Tema escuro inspirado na Binance (sem uso de logomarca). Logo próprio **BH** em SVG.

## Como publicar

### 1) Backend no Render
- Conecte o repo e siga o `backend/render.yaml` (Blueprint).
- **Env Vars** obrigatórias: `CMC_API_KEY`, `BINANCE_API_KEY`, `BINANCE_API_SECRET`, `MB_API_ID`, `MB_API_SECRET`.
- `TRUSTED_ORIGINS`: coloque `https://SEU-USUARIO.github.io` (domínio do Pages).

### 2) Frontend no GitHub Pages
- Em **Settings → Pages → Build and deployment**: selecione **GitHub Actions**.
- Em **Settings → Variables → Actions**, crie `VITE_API_BASE` com a URL da API do Render + `/api` (ex.: `https://SEUAPP.onrender.com/api`).
- Faça um commit na branch `main` → o Pages publica a UI.

### 3) Usando
- Abra o link do Pages → clique em **Editar CFOP & Ordem** para customizar as classificações e arrastar as linhas.
- Clique em **Salvar mudanças** para persistir (no backend/SQLite).

## Notas
- CFOP default: BTC/ETH = C; rank ≤50 = F; 51–200 = O; demais = P.
- Overrides e ordem ficam salvos em `Setting` (Prisma) com chaves `cfopOverrides` e `rowOrder`.
- As suas chaves ficam somente no Render (seguras). Nunca exponha no frontend.
