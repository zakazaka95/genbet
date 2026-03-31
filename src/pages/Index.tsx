import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/TopBar";
import { MarketCard } from "@/components/MarketCard";
import { CreateMarketModal } from "@/components/CreateMarketModal";
import { Market, getMarketCount, getMarket } from "@/lib/genlayer";

interface MarketWithIndex {
  market: Market;
  index: number;
}

export default function Index() {
  const [markets, setMarkets] = useState<MarketWithIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchMarkets = useCallback(async () => {
    try {
      const count = await getMarketCount();
      const results: MarketWithIndex[] = [];
      for (let i = 0; i < count; i++) {
        const market = await getMarket(i);
        results.push({ market, index: i });
      }
      setMarkets(results);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to fetch markets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 30000);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onCreateMarket={() => setModalOpen(true)} />

      <main className="container py-10 flex-1">
        {/* Hero */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold font-heading tracking-tight text-foreground mb-2 glow-orange">
            Predict. Resolve. Win.
          </h2>
          <p className="text-sm text-muted-foreground">
            <span className="relative inline-block">
              <span className="text-primary">AI-powered</span>
              <span className="absolute bottom-0 left-0 h-px bg-primary animate-underline-draw" />
            </span>
            {" "}prediction markets on GenLayer
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-5 w-5 rounded-full border-[1.5px] border-primary border-t-transparent animate-spin mb-4" />
            <p className="text-muted-foreground font-mono text-xs">
              Loading markets…
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-destructive font-mono text-xs">{error}</p>
            <button
              onClick={fetchMarkets}
              className="mt-2 text-xs text-primary hover:underline font-mono"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && markets.length === 0 && (
          <div className="rounded-sm border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground font-mono text-sm">
              No markets yet. Create the first one.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map(({ market, index }) => (
            <MarketCard
              key={index}
              market={market}
              index={index}
              onResolved={fetchMarkets}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5">
        <p className="text-center text-xs text-muted-foreground">
          Made by Zaksans
        </p>
      </footer>

      <CreateMarketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchMarkets}
      />
    </div>
  );
}
