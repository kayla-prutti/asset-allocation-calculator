# Asset Allocation Calculator

A Vue 3 calculator that splits a USD investment amount into a 70% Bitcoin and 30% Ethereum allocation using live Coinbase exchange rates.

## Live app

[Open the calculator](https://kayla-prutti.github.io/asset-allocation-calculator/)

## Features

- Accepts and formats USD input with commas and up to two decimal places
- Fetches current BTC and ETH rates from the Coinbase exchange-rates API
- Calculates the amount of BTC and ETH to buy for a 70/30 allocation
- Shows a clear error state and lets the user retry a failed rate request
- Includes a Reset button for clearing the investment amount
- Supports keyboard users and screen readers with labelled inputs
- Uses a responsive layout for desktop and mobile screens

## How the calculation works

Coinbase returns the amount of cryptocurrency available for one US dollar. For example, a BTC rate of `0.000015` means one dollar buys `0.000015 BTC`.

For an investment amount `I`:

BTC amount = I × 0.70 × BTC rate
ETH amount = I × 0.30 × ETH rate

Rates are fetched from:
`https://api.coinbase.com/v2/exchange-rates?currency=USD`

## Tech stack

- Vue 3
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
npm run type-check  # Check TypeScript and Vue types
npm run build       # Type-check and create a production build
npm run preview     # Preview the production build
```
