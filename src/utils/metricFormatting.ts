export type MetricFormatType =
  | "percent"
  | "currency_compact"
  | "number";

export type MetricDisplayConfig = {
  title: string;
  format: MetricFormatType;
};

export const METRIC_DISPLAY_CONFIG: Record<string, MetricDisplayConfig> = {
  revenue_growth_yoy: {
    title: "Revenue Growth YoY",
    format: "percent",
  },
  net_margin: {
    title: "Net Margin",
    format: "percent",
  },
  free_cash_flow: {
    title: "Free Cash Flow",
    format: "currency_compact",
  },
  roe_ending: {
    title: "ROE",
    format: "percent",
  },
};

export function formatMetricValue(
  value: number | null,
  format: MetricFormatType
): string {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (format === "percent") {
    return `${(value * 100).toFixed(2)}%`;
  }

  if (format === "currency_compact") {
    return formatCompactNumber(value);
  }

  return value.toFixed(2);
}

export function formatCompactNumber(value: number | null): string {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  return value.toFixed(2);
}