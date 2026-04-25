// Fetches current tier prices from /api/pricing.
// Falls back to hardcoded values if the API is unreachable (first paint).
import { useQuery } from "@tanstack/react-query";

export type PricingTiers = {
  kids: number;
  teens: number;
  adults: number;
  cyber: number;
  trial: number;
};

export const DEFAULT_PRICES: PricingTiers = {
  kids: 5500,
  teens: 7000,
  adults: 8500,
  cyber: 11000,
  trial: 500,
};

const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

async function fetchPrices(): Promise<PricingTiers> {
  const res = await fetch(`${apiBase}/api/pricing`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("pricing fetch failed");
  const json = (await res.json()) as { prices: PricingTiers };
  return json.prices;
}

export function usePricing() {
  return useQuery({
    queryKey: ["pricing"],
    queryFn: fetchPrices,
    staleTime: 5 * 60 * 1000, // 5 min — prices change rarely
    retry: 1,
    placeholderData: DEFAULT_PRICES,
  });
}
