import { useState } from "react";
import { Market, getAssetDisplay, resolveMarket } from "@/lib/genlayer";
import { Button } from "@/components/ui/button";

interface MarketCardProps {
  market: Market;
  index: number;
  onResolved: () => void;
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

export function MarketCard({ market, index, onResolved }: MarketCardProps) {
  const [resolving, setResolving] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const asset = getAssetDisplay(market.asset);

  const handleResolve = async () => {
    setResolving(true);
    setError(null);
    try {
      const hash = await resolveMarket(index);
      setTxHash(typeof hash === "string" ? hash : String(hash));
      onResolved();
    } catch (e: any) {
      setError(e?.message || "Resolution failed");
    } finally {
      setResolving(false);
    }
  };

  const statusDot = () => {
    if (!market.has_resolved) {
      return (
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          <span className="text-[11px] font-mono text-muted-foreground">Pending</span>
        </div>
      );
    }
    const isAbove = market.outcome === "above";
    return (
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${isAbove ? "bg-success" : "bg-destructive"}`} />
        <span className={`text-[11px] font-mono ${isAbove ? "text-success" : "text-destructive"}`}>
          {isAbove ? "Above" : "Below"}
        </span>
      </div>
    );
  };

  return (
    <div className="group rounded-sm border border-border bg-card p-5 card-hover flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-heading">{asset.emoji}</span>
          <span className="text-base font-bold font-heading text-foreground tracking-tight">
            {asset.name}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">#{index}</span>
        </div>
        {statusDot()}
      </div>

      <div className="mb-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">
          Target Price
        </p>
        <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
          ${market.target_price != null ? Number(market.target_price).toLocaleString() : "—"}
        </p>
      </div>

      <p className="text-[11px] font-mono text-muted-foreground mb-5">
        {market.resolution_date ?? "—"}
      </p>

      <div className="mt-auto">
        {!market.has_resolved && !resolving && !txHash && (
          <Button
            onClick={handleResolve}
            variant="outline"
            className="w-full h-9 rounded-sm border-primary/40 text-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary/10 hover:border-primary/60"
          >
            ⚡ Resolve
          </Button>
        )}

        {resolving && (
          <div className="flex items-center justify-center gap-2 rounded-sm border border-border bg-secondary/50 p-3">
            <div className="h-3.5 w-3.5 rounded-full border-[1.5px] border-primary border-t-transparent animate-spin" />
            <span className="text-xs text-muted-foreground font-mono">
              Waiting for AI consensus…
            </span>
          </div>
        )}

        {txHash && (
          <div className="rounded-sm border border-success/30 bg-success/5 p-3 text-center">
            <p className="text-xs text-success font-medium mb-1">Resolved</p>
            <a
              href={`https://explorer-asimov.genlayer.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-primary hover:underline"
            >
              {shortenHash(txHash)} ↗
            </a>
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-[11px] text-destructive font-mono">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
