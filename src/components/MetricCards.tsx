import { useMemo, useState } from "react";
import type {
  FinancialMetricsResponse,
  MetricPeriodValueResponse,
} from "../types/financials";
import { useMetricTrace } from "../hooks/useMetricTrace";
import TraceSidePanel from "./TraceSidePanel";
import MetricTracePanelContent from "./MetricTracePanelContent";
import {
  METRIC_DISPLAY_CONFIG,
  formatMetricValue,
} from "../utils/metricFormatting";

type MetricCardsProps = {
  ticker: string;
  metrics: FinancialMetricsResponse | null;
};

type MetricValueResult = {
  value: number | null;
  period: string | null;
  suppressionCode: string | null;
};

type MetricCardConfig = {
  category: string;
  metricName: string;
};

function getLatestMetricValue(
  metrics: FinancialMetricsResponse | null,
  category: string,
  metricName: string
): MetricValueResult {
  if (!metrics) {
    return { value: null, period: null, suppressionCode: null };
  }

  const categoryMetrics = metrics.categories[category];
  if (!categoryMetrics) {
    return { value: null, period: null, suppressionCode: null };
  }

  const metricValues = categoryMetrics[metricName];
  if (!metricValues || metricValues.length === 0) {
    return { value: null, period: null, suppressionCode: null };
  }

  const sortedValues = [...metricValues].sort((a, b) =>
    b.period.localeCompare(a.period)
  );

  for (const entry of sortedValues) {
    if (entry.value !== null && entry.value !== undefined) {
      return {
        value: entry.value,
        period: entry.period,
        suppressionCode: entry.suppression_code,
      };
    }
  }

  const latestEntry = sortedValues[0];
  return {
    value: latestEntry.value,
    period: latestEntry.period,
    suppressionCode: latestEntry.suppression_code,
  };
}

type MetricCardProps = {
  title: string;
  value: string;
  period: string | null;
  suppressionCode: string | null;
  onOpenTrace: () => void;
};

function MetricCard({
  title,
  value,
  period,
  suppressionCode,
  onOpenTrace,
}: MetricCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        background: "#fff",
        minHeight: "130px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "13px",
            color: "#6f6f6f",
            marginBottom: "10px",
            fontWeight: 500,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "8px",
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#8a8a8a",
          }}
        >
          {period ?? "No period"}
        </div>

        {suppressionCode && (
          <div
            style={{
              marginTop: "6px",
              fontSize: "12px",
              color: "#b45309",
            }}
          >
            {suppressionCode}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenTrace}
        style={{
          marginTop: "14px",
          alignSelf: "flex-start",
          border: "none",
          background: "transparent",
          padding: 0,
          color: "#1d4ed8",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        Formula
      </button>
    </div>
  );
}

export default function MetricCards({ ticker, metrics }: MetricCardsProps) {
  const metricCards: MetricCardConfig[] = useMemo(
    () => [
      { category: "growth", metricName: "revenue_growth_yoy" },
      { category: "profitability", metricName: "net_margin" },
      { category: "cash_flow", metricName: "free_cash_flow" },
      { category: "balance_sheet", metricName: "roe_ending" },
    ],
    []
  );

  const [selectedMetric, setSelectedMetric] = useState<{
    title: string;
    category: string;
    metricName: string;
  } | null>(null);

  const metricTraceQuery = useMetricTrace(
    ticker,
    selectedMetric?.category ?? null,
    selectedMetric?.metricName ?? null,
    selectedMetric !== null
  );

  return (
    <>
      <section style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>Key Metrics</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {metricCards.map((metricCard) => {
            const latestMetricValue = getLatestMetricValue(
              metrics,
              metricCard.category,
              metricCard.metricName
            );

            const displayConfig = METRIC_DISPLAY_CONFIG[metricCard.metricName];

            return (
              <MetricCard
                key={`${metricCard.category}-${metricCard.metricName}`}
                title={displayConfig.title}
                value={formatMetricValue(
                  latestMetricValue.value,
                  displayConfig.format
                )}
                period={latestMetricValue.period}
                suppressionCode={latestMetricValue.suppressionCode}
                onOpenTrace={() =>
                  setSelectedMetric({
                    title: displayConfig.title,
                    category: metricCard.category,
                    metricName: metricCard.metricName,
                  })
                }
              />
            );
          })}
        </div>
      </section>

      <TraceSidePanel
        isOpen={selectedMetric !== null}
        title={selectedMetric?.title ?? "Metric trace"}
        onClose={() => setSelectedMetric(null)}
      >
        <MetricTracePanelContent
          trace={metricTraceQuery.data ?? null}
          isLoading={metricTraceQuery.isLoading}
          errorMessage={
            metricTraceQuery.isError
              ? metricTraceQuery.error instanceof Error
                ? metricTraceQuery.error.message
                : "Failed to load metric trace"
              : null
          }
        />
      </TraceSidePanel>
    </>
  );
}