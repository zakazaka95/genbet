# { "Depends": "py-genlayer:test" }
from genlayer import *
from dataclasses import dataclass
import json

@allow_storage
@dataclass
class Market:
    asset: str
    target_price: str
    resolution_date: str
    has_resolved: str
    result: str

class CryptoPredictionMarket(gl.Contract):
    markets: DynArray[Market]
    market_count: u256

    def __init__(self):
        self.market_count = u256(0)

    @gl.public.write
    def create_market(self, asset: str, target_price: u256, resolution_date: str):
        market = Market(
            asset=asset,
            target_price=str(target_price),
            resolution_date=resolution_date,
            has_resolved="false",
            result="unresolved"
        )
        self.markets.append(market)
        self.market_count += u256(1)

    @gl.public.write
    def resolve_market(self, market_id: u256):
        market = self.markets[market_id]
        assert market.has_resolved == "false", "Already resolved"
        asset = market.asset
        target = int(market.target_price)

        def get_price() -> str:
            page = gl.get_webpage(
                f"https://coinmarketcap.com/currencies/{asset.lower()}/",
                mode="text"
            )
            prompt = (
                f"What is the current {asset}/USD price? "
                f"Reply ONLY with JSON: {{\"price\": <number>}}\n\n{page[:3000]}"
            )
            return gl.eq_principle_prompt_comparative(
                lambda: gl.exec_prompt(prompt),
                f"Does the extracted {asset} price match within 1%?"
            )

        price = json.loads(get_price())["price"]
        market.result = "above" if price > target else "below"
        market.has_resolved = "true"

    @gl.public.view
    def get_market(self, market_id: u256) -> str:
        m = self.markets[market_id]
        return json.dumps({
            "asset": m.asset,
            "target_price": m.target_price,
            "resolution_date": m.resolution_date,
            "has_resolved": m.has_resolved,
            "result": m.result
        })

    @gl.public.view
    def get_market_count(self) -> u256:
        return self.market_count
