import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS, createMarket, getAssetDisplay } from "@/lib/genlayer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CreateMarketModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateMarketModal({ open, onClose, onCreated }: CreateMarketModalProps) {
  const [asset, setAsset] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!asset || !targetPrice || !date) return;
    setLoading(true);
    setError("");
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      await createMarket(asset, Number(targetPrice), dateStr);
      onCreated();
      onClose();
      setAsset("");
      setTargetPrice("");
      setDate(undefined);
    } catch (e: any) {
      setError(e?.message || "Failed to create market");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading gradient-gold-text text-xl">
            Create Prediction Market
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Asset</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {ASSETS.map((a) => {
                  const d = getAssetDisplay(a);
                  return (
                    <SelectItem key={a} value={a}>
                      {d.emoji} {d.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Target Price (USD)</Label>
            <Input
              type="number"
              placeholder="e.g. 100000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="bg-secondary border-border font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Resolution Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-mono bg-secondary border-border",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "yyyy-MM-dd") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && (
            <p className="text-xs text-destructive font-mono">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || !asset || !targetPrice || !date}
            className="w-full gradient-gold font-semibold glow-primary"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Creating...
              </span>
            ) : (
              "🚀 Create Market"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
