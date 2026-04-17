import { useMutation } from "@tanstack/react-query";
import { calculateCustomFormula } from "../api/financialsApi";
import type {
  CustomFormulaRequest,
  CustomFormulaResponse,
} from "../types/financials";

export function useCalculateCustomFormula(ticker: string) {
  return useMutation<CustomFormulaResponse, Error, CustomFormulaRequest>({
    mutationFn: (request) => calculateCustomFormula(ticker, request),
  });
}