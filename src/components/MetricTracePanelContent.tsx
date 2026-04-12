import type { MetricTraceResponse } from "../types/financials";
import {
  METRIC_DISPLAY_CONFIG,
  formatCompactNumber,
  formatMetricValue,
} from "../utils/metricFormatting";

type MetricTracePanelContentProps = {
  trace: MetricTraceResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
};

function getLatestAndPreviousValues(values: Record<string, number | null>): {
  latestPeriod: string | null;
  latestValue: number | null;
  previousPeriod: string | null;
  previousValue: number | null;
} {
  const periods = Object.keys(values).sort().reverse();

  const latestPeriod = periods[0] ?? null;
  const previousPeriod = periods[1] ?? null;

  return {
    latestPeriod,
    latestValue: latestPeriod ? values[latestPeriod] ?? null : null,
    previousPeriod,
    previousValue: previousPeriod ? values[previousPeriod] ?? null : null,
  };
}

function getLatestValue(values: Record<string, number | null>): {
  period: string | null;
  value: number | null;
} {
  const periods = Object.keys(values).sort().reverse();

  for (const period of periods) {
    const value = values[period];
    if (value !== null && value !== undefined) {
      return { period, value };
    }
  }

  return { period: null, value: null };
}

export default function MetricTracePanelContent({
  trace,
  isLoading,
  errorMessage,
}: MetricTracePanelContentProps) {
  if (isLoading) {
    return <p>Loading trace...</p>;
  }

  if (errorMessage) {
    return (
      <div
        style={{
          padding: "14px",
          border: "1px solid #f0caca",
          borderRadius: "12px",
          background: "#fff5f5",
          color: "#8a2d2d",
        }}
      >
        {errorMessage}
      </div>
    );
  }

  if (!trace) {
    return <p>No trace data available.</p>;
  }

  const latestMetricValue = getLatestValue(trace.metric_values);
  const metricDisplayConfig = METRIC_DISPLAY_CONFIG[trace.metric_name];

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <section>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Metric
        </div>
        <div style={{ fontSize: "18px", fontWeight: 700 }}>{trace.metric_name}</div>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          Category: {trace.category}
        </div>
      </section>

      <section
        style={{
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "16px",
          background: "#fafafa",
        }}
      >
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Formula
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >
          {trace.formula}
        </div>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "8px" }}>
          Based on the latest available period for each dependency.
        </div>
      </section>

      <section>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Metric result
          {latestMetricValue.period ? ` (${latestMetricValue.period})` : ""}
        </div>
        <div style={{ fontSize: "24px", fontWeight: 700 }}>
          {formatMetricValue(
            latestMetricValue.value,
            metricDisplayConfig?.format ?? "number"
          )}
        </div>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "6px" }}>
          Calculated from the dependency values shown below.
        </div>
      </section>

      <section>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
          Dependencies
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {trace.dependencies.map((dependency) => {
                const isYoyMetric = trace.metric_name.endsWith("_growth_yoy");
                const latestDependencyValue = getLatestValue(dependency.values);
                const latestAndPrevious = getLatestAndPreviousValues(dependency.values);

                return (
                    <div
                    key={dependency.concept}
                    style={{
                        border: "1px solid #eee",
                        borderRadius: "12px",
                        padding: "14px",
                        background: "#fff",
                    }}
                    >
                    <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>
                        {dependency.concept}
                    </div>

                    <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                        Statement: {dependency.statement_type ?? "Derived / unresolved"}
                    </div>

                    {isYoyMetric ? (
                      <div style={{
                          display: "grid",
                          gridTemplateColumns: "72px 1fr",
                          rowGap: "6px",
                          columnGap: "10px",
                          fontSize: "14px",
                          color: "#444",
                        }}
                      >
                        <div style={{ fontWeight: 500 }}>
                          {latestAndPrevious.latestPeriod ?? "Latest"}:
                        </div>
                        <div style={{ fontWeight: 500 }}>
                          {formatCompactNumber(latestAndPrevious.latestValue)}
                        </div>

                        <div style={{ fontWeight: 500 }}>
                          {latestAndPrevious.previousPeriod ?? "Previous"}:
                        </div>
                        <div style={{ fontWeight: 500 }}>
                          {formatCompactNumber(latestAndPrevious.previousValue)}
                        </div>
                      </div>
                    ) : (
                        <>
                        <div style={{ fontSize: "16px", fontWeight: 600 }}>
                            {formatCompactNumber(latestDependencyValue.value)}
                        </div>

                        <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                            {latestDependencyValue.period ?? "No period"}
                        </div>
                        </>
                    )}
                    </div>
                );
            })}
        </div>
      </section>
    </div>
  );
}