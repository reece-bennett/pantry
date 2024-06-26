FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS deploy

WORKDIR /app

COPY --from=build /app/build build/
COPY --from=build /app/node_modules node_modules/
COPY --from=build /app/package.json .
COPY --from=build /app/prisma prisma/

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["npm", "run", "prod"]
