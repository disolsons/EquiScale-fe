import type { FinancialMetricsResponse } from "../types/financials";

type MetricCardsProps = {
  metrics: FinancialMetricsResponse | null;
};

type MetricValueResult = {
  value: number | null;
  period: string | null;
};

function getLatestMetricValue(
  metrics: FinancialMetricsResponse | null,
  category: string,
  metricName: string
): MetricValueResult {
  if (!metrics) {
    return { value: null, period: null };
  }

  const categoryMetrics = metrics.categories[category];
  if (!categoryMetrics) {
    return { value: null, period: null };
  }

  const metricValues = categoryMetrics[metricName];
  if (!metricValues) {
    return { value: null, period: null };
  }

  const periods = Object.keys(metricValues).sort().reverse();

  for (const period of periods) {
    const value = metricValues[period];
    if (value !== null && value !== undefined) {
      return { value, period };
    }
  }

  return { value: null, period: null };
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return `${(value * 100).toFixed(2)}%`;
}

function formatCurrencyCompact(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type MetricCardProps = {
  title: string;
  value: string;
  period: string | null;
};

function MetricCard({ title, value, period }: MetricCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        background: "#fff",
        minHeight: "110px",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#888",
        }}
      >
        {period ?? "No period"}
      </div>
    </div>
  );
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const revenueGrowth = getLatestMetricValue(
    metrics,
    "growth",
    "revenue_growth_yoy"
  );

  const netMargin = getLatestMetricValue(
    metrics,
    "profitability",
    "net_margin"
  );

  const freeCashFlow = getLatestMetricValue(
    metrics,
    "cash_flow",
    "free_cash_flow"
  );

  const roe = getLatestMetricValue(
    metrics,
    "balance_sheet",
    "roe_ending"
  );

  return (
    <section style={{ marginTop: "24px" }}>
      <h3 style={{ marginBottom: "16px" }}>Key Metrics</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <MetricCard
          title="Revenue Growth YoY"
          value={formatPercent(revenueGrowth.value)}
          period={revenueGrowth.period}
        />

        <MetricCard
          title="Net Margin"
          value={formatPercent(netMargin.value)}
          period={netMargin.period}
        />

        <MetricCard
          title="Free Cash Flow"
          value={formatCurrencyCompact(freeCashFlow.value)}
          period={freeCashFlow.period}
        />

        <MetricCard
          title="ROE"
          value={formatPercent(roe.value)}
          period={roe.period}
        />
      </div>
    </section>
  );
}