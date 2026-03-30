import { createClient, createAccount } from "genlayer-js";
import { localnet } from "genlayer-js/chains";

const CONTRACT_ADDRESS = "0xb0533AD764C661E0E105Ac16c0e7a2EB75D992De" as const;

const account = createAccount();

export const client = createClient({
  chain: {
    ...localnet,
    rpcUrls: {
      default: { http: ["https://studio.genlayer.com/api"] },
    },
  },
  account,
});

export interface Market {
  asset: string;
  target_price: number;
  resolution_date: string;
  has_resolved: boolean;
  outcome: string | null;
}

const ASSET_MAP: Record<string, { emoji: string; name: string }> = {
  BTC: { emoji: "₿", name: "BTC" },
  ETH: { emoji: "Ξ", name: "ETH" },
  SOL: { emoji: "◎", name: "SOL" },
  BNB: { emoji: "⬡", name: "BNB" },
  XRP: { emoji: "✕", name: "XRP" },
};

export function getAssetDisplay(asset: string) {
  return ASSET_MAP[asset] || { emoji: "●", name: asset };
}

export async function getMarketCount(): Promise<number> {
  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_market_count",
    args: [],
  });
  return Number(result);
}

export async function getMarket(index: number): Promise<Market> {
  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_market",
    args: [index],
  });
  return result as unknown as Market;
}

export async function createMarket(
  asset: string,
  targetPrice: number,
  resolutionDate: string
): Promise<string> {
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "create_market",
    args: [asset, targetPrice, resolutionDate],
    value: 0n,
  });
  return txHash as string;
}

export async function resolveMarket(marketId: number): Promise<string> {
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "resolve_market",
    args: [marketId],
    value: 0n,
  });
  return txHash as string;
}

export const ASSETS = ["BTC", "ETH", "SOL", "BNB", "XRP"] as const;
