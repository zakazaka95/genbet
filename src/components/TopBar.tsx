import { Button } from "@/components/ui/button";
import { GenBetLogo } from "@/components/GenBetLogo";
import { Plus } from "lucide-react";

interface TopBarProps {
  onCreateMarket: () => void;
}

export function TopBar({ onCreateMarket }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GenBetLogo />
          <span className="text-lg font-bold font-heading tracking-tight text-foreground">
            GenBet
          </span>
          <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest ml-1">
            testnet
          </span>
        </div>
        <Button
          onClick={onCreateMarket}
          className="h-9 rounded-sm bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider hover:bg-primary/90 px-5"
        >
          <Plus className="h-3.5 w-3.5 mr-1" strokeWidth={2.5} />
          Create Market
        </Button>
      </div>
    </header>
  );
}
