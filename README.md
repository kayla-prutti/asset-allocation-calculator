# Asset Allocation Calculator

A React portfolio planner that turns a USD investment amount and a custom crypto mix (2-5 assets, weighted by percentage) into exactly how much of each asset to buy, using live Coinbase exchange rates.

## Live app

[Open the calculator](https://kayla-prutti.github.io/asset-allocation-calculator/)

## Features

- Enter an investment amount with USD formatting (commas, up to two decimal places), validated against a $0-$1 trillion range
- Build a custom mix of 2-5 crypto assets, searchable from Coinbase's live currency list (falls back to a small built-in list if that request fails)
- Set each asset's weight by hand; the mix must total exactly 100%, with inline error styling when it's under or over
- See the resulting mix as an interactive donut chart and legend — hover, focus, or click a slice or legend row to highlight it, with a tooltip that follows the highlighted slice
- Once the amount and mix are both valid, each asset shows its dollar allocation and the exact amount of crypto it buys at current rates
- The allocation panel greys out while the inputs are incomplete or invalid, so it's clear the numbers aren't final yet
- Shows a clear error state and lets the user retry a failed exchange-rate request
- Reset buttons for clearing the investment amount and restoring the default mix
- Supports keyboard users and screen readers with labelled inputs, `aria-invalid`/`role="alert"` error states, and a listbox-pattern asset picker
- Uses a responsive layout for desktop and mobile screens

## How the calculation works

Coinbase returns the amount of cryptocurrency available for one US dollar. For example, a BTC rate of `0.000015` means one dollar buys `0.000015 BTC`.

For an investment amount `I` and an asset with weight `w` (as a percentage) and exchange rate `r`:

```
dollar amount = I × (w / 100)
crypto amount = dollar amount × r
```

This is applied per asset across the whole mix, so `Σw` must equal 100% for the totals to add up to the full investment amount.

Rates and the available currency list are fetched from:
`https://api.coinbase.com/v2/exchange-rates?currency=USD`
`https://api.coinbase.com/v2/currencies/crypto`

## Project structure

- `App.tsx` — owns the shared state (investment amount, asset mix, live rates) and renders the two main panels
- `PortfolioEditor` (+ `CurrencyInput`, `CryptoInput`) — the "Choose assets and amount" panel
- `AllocationSummary` (+ `AllocationChart`, `AllocationLegend`) — the "Your crypto allocation" panel
- `hooks/` — `useExchangeRates`, `useCryptoCurrencies` (data fetching)
- `utils/` — `portfolio.ts` (mix math/validation), `formatters.ts` (number/currency formatting)
- `services/coinbaseApi.ts` — the Coinbase API client

## Tech stack

- React 19
- TypeScript
- Vite
- CSS custom properties for shared design tokens

## Run locally

Requirements: Node.js `22.18` or later.

```sh
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Available commands

```sh
npm run dev         # Start the development server
npm run type-check  # Check TypeScript types
npm run build       # Type-check and create a production build
npm run preview     # Preview the production build
```
