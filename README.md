# Upvite

Web client for Uprising.

## Setup

This project contains submodules. Run `git submodule init` after you clone this repository to initialize the submodules. It is also recommended to run `git submodule update` after you pull from upstream.

## Developing

Ensure you have copied the `.env.example` file to `.env` and filled in the values.
Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
