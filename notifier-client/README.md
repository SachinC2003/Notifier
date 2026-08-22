# Notifier Client

The Next.js dashboard for the Notifier API. It runs on port `3001` and connects to the server at `http://localhost:3000` by default.

## Local development

Install dependencies, then create `.env.local` if the API is not using the default address:

```bash
npm install
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3001`.

## Scripts

```bash
npm run dev    # Start the development server on port 3001
npm run lint   # Run ESLint
npm run build  # Create a production build
npm start      # Run the production build
```

The API must allow this client origin. The server defaults `FRONTEND_URL` to `http://localhost:3001`.

## Project structure

```text
src/app/         # Routes and pages
src/components/  # Shared UI components
src/lib/api/     # API client and endpoint helpers
```
