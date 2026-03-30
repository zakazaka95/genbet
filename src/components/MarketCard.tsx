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

  const statusBadge = () => {
    if (!market.has_resolved) {
      return (
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">
          ⏳ Unresolved
        </span>
      );
    }
    const isAbove = market.outcome === "above";
    return (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-mono ${
          isAbove
            ? "bg-success/15 text-success"
            : "bg-destructive/15 text-destructive"
        }`}
      >
        {isAbove ? "📈 Above" : "📉 Below"}
      </span>
    );
  };

  return (
    <div className="group rounded-lg border border-border bg-card p-5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{asset.emoji}</span>
          <div>
            <h3 className="text-lg font-bold font-heading text-foreground">
              {asset.name}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Market #{index}
            </p>
          </div>
        </div>
        {statusBadge()}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-md bg-secondary/50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Target Price
          </p>
          <p className="text-lg font-bold font-mono text-primary">
            ${market.target_price != null ? Number(market.target_price).toLocaleString() : "—"}
          </p>
        </div>
        <div className="rounded-md bg-secondary/50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Resolution Date
          </p>
          <p className="text-sm font-mono text-foreground">
            {market.resolution_date ?? "—"}
          </p>
        </div>
      </div>

      {!market.has_resolved && !resolving && !txHash && (
        <Button
          onClick={handleResolve}
          variant="outline"
          className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 font-semibold"
        >
          ⚡ Resolve
        </Button>
      )}

      {resolving && (
        <div className="flex items-center justify-center gap-2 rounded-md border border-primary/20 bg-primary/5 p-3">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" />
          <span className="text-sm text-primary animate-pulse-glow font-mono">
            🤖 Waiting for AI consensus...
          </span>
        </div>
      )}

      {txHash && (
        <div className="rounded-md border border-success/30 bg-success/10 p-3 text-center">
          <p className="text-sm text-success font-semibold mb-1">
            ✅ Resolved!
          </p>
          <a
            href={`https://explorer-asimov.genlayer.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-primary hover:underline"
          >
            {shortenHash(txHash)} ↗
          </a>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
          <p className="text-xs text-destructive font-mono">{error}</p>
        </div>
      )}
    </div>
  );
}
