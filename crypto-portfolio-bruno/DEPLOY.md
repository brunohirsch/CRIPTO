# Guia rápido de deploy (Render + GitHub Pages)

1) **Render** → New → Blueprint → selecione seu repo. Preencha as variáveis de ambiente:
   - `CMC_API_KEY` (CoinMarketCap)
   - `BINANCE_API_KEY` e `BINANCE_API_SECRET` (Read Only)
   - `MB_API_ID` e `MB_API_SECRET` (Mercado Bitcoin v4)
   - `TRUSTED_ORIGINS` = `https://SEU-USUARIO.github.io`
2) Espere o deploy terminar; copie a URL do serviço (ex.: `https://SEUAPP.onrender.com`).
3) **GitHub** (repo) → Settings → Variables → Actions → `VITE_API_BASE` = `https://SEUAPP.onrender.com/api`.
4) **GitHub Pages**: Settings → Pages → habilite **GitHub Actions** e salve.
5) Faça um commit (qualquer alteração) para disparar o workflow. Ao final, o GitHub mostra a URL pública.
