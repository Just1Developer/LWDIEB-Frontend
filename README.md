# The Dashboard Frontend

### This is more of a technical developer manual. The Setup Guide is located in the Backend Repository.

---

## Widget Guide

### There is a Guide to creating new Widgets, see `CREATE_WIDGET_GUIDE.md` for more info

## Clean up for build and build (Linter)

### Run `pnpm check` to check for prettier issues

### Simply run `pnpm prettier`. This will update all files recursively and adjust everything it can to be pretty :3

### After that, run `pnpm build` to make an optimized production build and run it with `pnpm start` instead of `pnpm dev`

# DIEB Frontend | Nextjs 15

## Installation Steps

### 1. Install packages

```bash
pnpm i
```

### 2. Set up the backend

### 3. Copy-Paste .env from example file

**(do not rename the example file, create a new one!)**

### 3. Start server

```bash
pnpm run dev
```

## Testing

Tests should only be run on production builds, because the dev server is too unstable. If you wish for playwright to run its own server, change `reuseExistingServer: true` to `false` in line 22 of `playwright.config.ts`

For running Tests requiring Login, Cookies have to be set in `tests/setup.ts` with the id, access, refresh token and session ID. It is recommended to use the development keycloak for testing.

### Run all End-to-End tests:

```bash
pnpm test
```

or (no UI):

```bash
npx playwright test
```

## Features

- Next.js 15
- Tailwind + shadcn-ui (Styling)
- Light/Dark Theme (next-themes) + Customizable Themes
- Zod (Validation)
- Prettier (Formatter)
- ESLint

## Some Stuff for me:

```bash
npx prisma generate
```

and

```bash
npx prisma db push
```
