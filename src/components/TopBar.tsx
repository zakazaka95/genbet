import { Button } from "@/components/ui/button";

interface TopBarProps {
  onCreateMarket: () => void;
}

export function TopBar({ onCreateMarket }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <h1 className="text-xl font-bold font-heading gradient-gold-text">
            GenBet
          </h1>
          <span className="ml-2 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-mono text-primary">
            TESTNET
          </span>
        </div>
        <Button onClick={onCreateMarket} className="gradient-gold font-semibold glow-primary">
          <span className="mr-1">➕</span> Create Market
        </Button>
      </div>
    </header>
  );
}
