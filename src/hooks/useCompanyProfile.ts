import { useQuery } from "@tanstack/react-query";
import { getCompanyProfile } from "../api/financialsApi";

export function useCompanyProfile(ticker: string) {
  return useQuery({
    queryKey: ["companyProfile", ticker],
    queryFn: () => getCompanyProfile(ticker),
    enabled: ticker.trim().length > 0,
  });
}