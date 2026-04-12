import { useQuery } from "@tanstack/react-query";
import { getConceptTrace } from "../api/financialsApi";

export function useConceptTrace(
  ticker: string,
  statementType: string | null,
  concept: string | null,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["conceptTrace", ticker, statementType, concept],
    queryFn: () => {
      if (!statementType || !concept) {
        throw new Error("Concept trace requires statement type and concept");
      }

      return getConceptTrace(ticker, statementType, concept);
    },
    enabled:
      enabled &&
      ticker.trim().length > 0 &&
      !!statementType &&
      !!concept,
  });
}