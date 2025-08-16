FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm i
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 8787
CMD ["npm", "start"]
