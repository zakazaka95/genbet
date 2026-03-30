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
    <div className="min-h-screen bg-background">
      <TopBar onCreateMarket={() => setModalOpen(true)} />

      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-heading gradient-gold-text mb-2">
            Prediction Markets
          </h2>
          <p className="text-muted-foreground text-sm">
            AI-powered crypto price predictions on GenLayer
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin-slow mb-4" />
            <p className="text-muted-foreground font-mono text-sm">
              Loading markets...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
            <p className="text-destructive font-mono text-sm">{error}</p>
            <button
              onClick={fetchMarkets}
              className="mt-2 text-xs text-primary hover:underline font-mono"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && markets.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-4xl mb-3">🏜️</p>
            <p className="text-muted-foreground font-heading">
              No markets yet. Create the first one!
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

      <CreateMarketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchMarkets}
      />
    </div>
  );
}
