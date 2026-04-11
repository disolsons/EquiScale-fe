import { useQuery } from "@tanstack/react-query";
import { getFinancialDataset } from "../api/financialsApi";

export function useFinancialDataset(ticker: string) {
  return useQuery({
    queryKey: ["financialDataset", ticker],
    queryFn: () => getFinancialDataset(ticker),
    enabled: ticker.trim().length > 0,
  });
}