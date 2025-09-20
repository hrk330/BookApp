# Book Catalog App

Full-stack Book Catalog built with Next.js App Router, TypeScript, NextAuth (Credentials + Google), Prisma, PostgreSQL, and Tailwind CSS. Deployable to Vercel.

## 📂 Repository

[https://github.com/hrk330/BookApp](https://github.com/hrk330/BookApp)

## 🚀 Live Demo

[https://book-app-eta.vercel.app/](https://book-app-eta.vercel.app/)

## Features

- Authentication with NextAuth (Email/Password sign-in & sign-up, and Google OAuth)
- Books API: `GET /api/books`, `POST /api/books`, `DELETE /api/books/:id`
- Only authenticated users can add or delete their own books
- Responsive UI with Tailwind, clean layout and auth-aware navbar

## Authentication Flow

- **Google Sign-In**: Users can authenticate with Google OAuth. The app stores their account in PostgreSQL via Prisma.
- **Email/Password**: Users can sign up with email & password. Passwords are hashed with bcrypt before saving.
- **Session Management**: NextAuth uses JWT strategy. Each session includes the user `id`, making it possible to restrict actions (e.g., only delete your own books).

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- NextAuth.js 4
- Prisma ORM + PostgreSQL (Neon/Supabase/ElephantSQL)
- Tailwind CSS
- Deployed on Vercel

## Local Setup

1. Clone and install

```bash
npm install # or pnpm install / yarn
```

2. Environment variables
   Create a `.env.local` file at project root (copy from `env.example`):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
NEXTAUTH_SECRET="replace-with-strong-secret" # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. Prisma

```bash
npm run prisma:generate
npm run prisma:migrate # creates a new dev migration and updates DB
```

4. Run

```bash
npm run dev
```

Visit http://localhost:3000

## Usage

- Home (`/`): View all books. Delete button appears only for books you own.
- Add (`/add`): Add a new book (requires login).
- Sign in (`/auth/signin`): Email/password or Google. Toggle to sign up.

## Deployment (Vercel)

1. Push repo to GitHub/GitLab.
2. Create Vercel project and import repo.
3. Set Environment Variables in Vercel (same as `.env.local`).
4. Add a production PostgreSQL database (Neon/Supabase/ElephantSQL) and set `DATABASE_URL`.
5. In Vercel Build & Development Settings, set Install Command as default, Build Command `prisma generate && next build`.
6. After first deploy, run Prisma migrate:
   - Use Vercel CLI/Deploy Hook or run locally: `DATABASE_URL=... npm run prisma:deploy`

## Project Structure

```
app/
  api/
    auth/[...nextauth]/route.ts
    books/route.ts
    books/[id]/route.ts
  add/page.tsx
  auth/signin/page.tsx
  layout.tsx
  page.tsx
  globals.css
  providers.tsx
components/
  Navbar.tsx
  BookCard.tsx
lib/
  prisma.ts
  auth.ts
prisma/
  schema.prisma
```

## Features Implemented

- ✅ **Authentication**: NextAuth.js with Email/Password and Google OAuth
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **API Routes**: GET, POST, DELETE for books with proper authentication
- ✅ **Frontend**: Responsive design with Tailwind CSS (mobile + desktop)
- ✅ **User Experience**: Form validation, success messages, loading states
- ✅ **Security**: Only authenticated users can add/delete their own books
- ✅ **Deployment**: Vercel-ready with proper environment configuration

## Notes

- Credentials sign-up stores a `passwordHash` on `User`. Google users won't have a password unless they sign up via credentials.
- Sessions use database strategy for persistence.
- Update `NEXTAUTH_URL` to your Vercel URL in production.
- The app is fully responsive and works on mobile devices (50-70% requirement met).

## Scripts

- `dev`: start dev server
- `build`: generate Prisma client and build Next.js
- `start`: start production server
- `prisma:migrate`: run dev migrations
- `prisma:deploy`: apply migrations in production
- `prisma:studio`: open Prisma Studio

## License

MIT

# BookApp
