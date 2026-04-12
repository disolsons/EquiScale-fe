import { useQuery } from "@tanstack/react-query";
import { getMetricTrace } from "../api/financialsApi";

export function useMetricTrace(
  ticker: string,
  category: string | null,
  metricName: string | null,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["metricTrace", ticker, category, metricName],
    queryFn: () => {
      if (!category || !metricName) {
        throw new Error("Metric trace requires category and metric name");
      }

      return getMetricTrace(ticker, category, metricName);
    },
    enabled:
      enabled &&
      ticker.trim().length > 0 &&
      !!category &&
      !!metricName,
  });
}