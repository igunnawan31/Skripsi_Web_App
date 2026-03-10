FROM node:latest

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

RUN pnpm install

COPY . .

WORKDIR /app/apps/api
RUN pnpm prisma generate --schema=./prisma/schema.prisma
RUN pnpm build

EXPOSE 8000

CMD ["sh", "-c", "pnpm prisma migrate deploy && (pnpm prisma db seed || echo 'Seed skipped, data may already exist') && node dist/src/main.js"]

