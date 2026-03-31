# GenBet — AI-Powered Crypto Prediction Markets

Live demo: https://genbet.lovable.app

## What is GenBet?
GenBet is a permissionless crypto prediction market built on GenLayer. Anyone can create a market predicting whether BTC, ETH, SOL, BNB or XRP will be above or below a target price on a given date.

When resolved, a GenLayer Intelligent Contract fetches the live price directly from the web and 5 independent LLM validators reach consensus on the outcome — no centralized oracle, no trusted admin.

## How it works
1. Anyone creates a market (asset, target price, date)
2. On resolution day, call Resolve
3. The Intelligent Contract fetches live price data from CoinMarketCap
4. 5 AI validators independently verify and reach consensus via Optimistic Democracy
5. Result is stored on-chain permanently

## Tech Stack
- **Intelligent Contract:** Python on GenLayer Studio
- **Frontend:** React + Viem via Lovable.dev
- **SDK:** genlayer-js
- **Contract address:** `0xb0533AD764C661E0E105Ac16c0e7a2EB75D992De`

## Track
Prediction Markets & P2P Betting

## Builder
Zaksans
