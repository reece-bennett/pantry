# Pantry

A recipe storage and shopping list planning app.

## Setup

Install app dependencies with `npm install` and start the database with `docker compose up db -d`.

Create a `.env` file in the root directory with the contents:

```sh
DATABASE_URL="postgresql://postgres:example@localhost:5432/postgres?schema=public"
```

Run `npx prisma migrate dev` and `npx prisma db seed` to apply the database migrations, generate the client, and seed the database with example data.

## Developing

To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open

# or expose to the network
npm run dev -- --host
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Docker

Build the SvelteKit image with `docker build -t reecebennett/pantry-app .` then start with `docker compose up -d`.

To build a multi-platform image enable `Use containerd for pulling and storing images` in the Docker Desktop settings then run `docker buildx build --platform linux/amd64,linux/arm64 -t reecebennett/pantry-app:latest --push .`.

When deploying on another machine run `docker compose pull` to download new images from Docker Hub (or `docker pull reecebennett/pantry-app` to just download the new app image), then `docker compose up -d`.

## Database

Pantry uses [Prisma ORM](https://www.prisma.io/) for database migrations and queries.

### Making changes

1. Edit the schema at `prisma/schema.prisma` as required (and `prisma/seed.ts` for new seed data)
2. Format with `npx prisma format` and validate with `npx prisma validate`
3. Optionally run `npx prisma db push` to push changes to the database for testing without creating a migration
4. Run `npx prisma migrate dev --name <migration_name>` to create a migration with the changes

### Other commands

- `npx prisma migrate reset` to reset the database back to the last migration and runs seeding
- `npx prisma generate` to generate the client (should be automatically ran on most `migrate` or `db` commands)
- `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma` to diff the DB against the schema
