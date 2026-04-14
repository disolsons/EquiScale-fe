import { useQuery } from "@tanstack/react-query";
import { getCompanyPrice } from "../api/financialsApi";

export function useCompanyPrice(ticker: string) {
  return useQuery({
    queryKey: ["companyPrice", ticker],
    queryFn: () => getCompanyPrice(ticker),
    enabled: ticker.trim().length > 0,
  });
}