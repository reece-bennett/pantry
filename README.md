# Pantry

A recipe storage and shopping list planning app.

## Setup

Install app dependencies with `npm install` and start the database with `docker compose up`.

Create a `.env` file in the root directory with the contents:

```sh
DATABASE_URL="postgresql://postgres:example@localhost:5432/postgres?schema=public"
```

Run `npx prisma migrate dev` to apply the database migrations and seed the database with example data.

## Developing

To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Database

Pantry uses [Prisma ORM](https://www.prisma.io/) for database migrations and queries.

### Making changes

1. Edit the schema at `prisma/schema.prisma` as required (and `prisma/seed.ts` for new seed data)
2. Optionally run `npx prisma db push` to push changes to the database for testing without creating a migration
3. Run `npx prisma migrate dev --name <migration_name>` to create a migration with the changes

### Other commands

- `npx prisma migrate reset` to reset the database back to the last migration and runs seeding
- `npx prisma generate` to generate the client (should be automatically ran on most `migrate` or `db` commands)
