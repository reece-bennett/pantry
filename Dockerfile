FROM node:20-alpine AS build

WORKDIR /app

RUN apk update; \
    apk add --no-cache openssl

COPY package*.json .

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine AS deploy

WORKDIR /app

RUN apk update; \
    apk add --no-cache openssl

COPY --from=build /app/build build/
COPY --from=build /app/node_modules node_modules/
COPY --from=build /app/package.json .
COPY --from=build /app/prisma prisma/

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["npm", "run", "prod"]
