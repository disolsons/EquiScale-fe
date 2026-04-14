import { useState } from "react";
import { useFinancialDataset } from "../hooks/useFinancialDataset";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useCompanyPrice } from "../hooks/useCompanyPrice";
import MetricCards from "../components/MetricCards";
import FinancialReportTable from "../components/FinancialReportTable";
import type { FinancialReportResponse } from "../types/financials";

function formatLastUpdated(value: string | null): string {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return (
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(date) + " UTC"
  );
}

function getLatestAnnualReportPeriod(
  report: FinancialReportResponse | null
): string {
  if (!report || !report.periods || report.periods.length === 0) {
    return "N/A";
  }

  const sortedPeriods = [...report.periods].sort().reverse();
  return sortedPeriods[0] ?? "N/A";
}

function formatFiscalYearEnd(value: string | null): string {
  if (!value) {
    return "N/A";
  }

  if (value.length === 4) {
    return `${value.slice(0, 2)}/${value.slice(2)}`;
  }

  return value;
}

function formatFilingDate(value: string | null): string {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function formatPriceDate(value: string | null): string {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function formatPrice(value: number | null, currency: string | null): string {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return currency ? `${formatted} ${currency}` : formatted;
}

function HeaderItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={{ minWidth: "180px" }}>
      <div
        style={{
          fontSize: "12px",
          color: "#7a7a7a",
          marginBottom: "6px",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: 1.35,
          color: "#222",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FilingLinkBlock({
  form,
  filingDate,
  filingUrl,
}: {
  form: string | null;
  filingDate: string | null;
  filingUrl: string | null;
}) {
  const filingSummary =
    form || filingDate
      ? [form, formatFilingDate(filingDate)].filter(Boolean).join(" · ")
      : "N/A";

  return (
    <div style={{ minWidth: "220px" }}>
      <div
        style={{
          fontSize: "12px",
          color: "#7a7a7a",
          marginBottom: "6px",
          fontWeight: 500,
        }}
      >
        Latest annual filing
      </div>

      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: 1.35,
          color: "#222",
          marginBottom: filingUrl ? "6px" : 0,
        }}
      >
        {filingSummary}
      </div>

      {filingUrl ? (
        <a
          href={filingUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#1d4ed8",
            textDecoration: "none",
          }}
        >
          Open filing
        </a>
      ) : null}
    </div>
  );
}

function PriceBlock({
  closePrice,
  currency,
  priceDate,
}: {
  closePrice: number | null;
  currency: string | null;
  priceDate: string | null;
}) {
  return (
    <div style={{ minWidth: "180px" }}>
      <div
        style={{
          fontSize: "12px",
          color: "#7a7a7a",
          marginBottom: "6px",
          fontWeight: 500,
        }}
      >
        Last close
      </div>

      <div
        style={{
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#111",
          marginBottom: "6px",
        }}
      >
        {formatPrice(closePrice, currency)}
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#666",
          fontWeight: 500,
        }}
      >
        as of {formatPriceDate(priceDate)}
      </div>
    </div>
  );
}

export default function CompanyPage() {
  const [inputTicker, setInputTicker] = useState("NVDA");
  const [submittedTicker, setSubmittedTicker] = useState("NVDA");

  const {
    data,
    isLoading: isDatasetLoading,
    isError: isDatasetError,
    error: datasetError,
  } = useFinancialDataset(submittedTicker);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useCompanyProfile(submittedTicker);

  const {
    data: price,
    isLoading: isPriceLoading,
    isError: isPriceError,
    error: priceError,
  } = useCompanyPrice(submittedTicker);

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#f7f8fa",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>EquiScale</h1>
      <p style={{ marginTop: 0, color: "#666", marginBottom: "24px" }}>
        Company financials viewer
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmittedTicker(inputTicker.trim().toUpperCase());
        }}
        style={{ display: "flex", gap: "12px", marginBottom: "24px" }}
      >
        <input
          value={inputTicker}
          onChange={(e) => setInputTicker(e.target.value)}
          placeholder="Enter ticker, e.g. NVDA"
          style={{
            padding: "10px 12px",
            minWidth: "240px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Load
        </button>
      </form>

      {(isDatasetLoading || isProfileLoading || isPriceLoading) && (
        <p>Loading company data...</p>
      )}

      {isDatasetError && (
        <div
          style={{
            padding: "16px",
            border: "1px solid #f0caca",
            borderRadius: "12px",
            background: "#fff5f5",
            color: "#8a2d2d",
            marginBottom: "16px",
          }}
        >
          Error:{" "}
          {datasetError instanceof Error ? datasetError.message : "Unknown dataset error"}
        </div>
      )}

      {isProfileError && (
        <div
          style={{
            padding: "16px",
            border: "1px solid #f0caca",
            borderRadius: "12px",
            background: "#fff5f5",
            color: "#8a2d2d",
            marginBottom: "16px",
          }}
        >
          Error:{" "}
          {profileError instanceof Error ? profileError.message : "Unknown profile error"}
        </div>
      )}

      {isPriceError && (
        <div
          style={{
            padding: "16px",
            border: "1px solid #f0caca",
            borderRadius: "12px",
            background: "#fff5f5",
            color: "#8a2d2d",
            marginBottom: "16px",
          }}
        >
          Error:{" "}
          {priceError instanceof Error ? priceError.message : "Unknown price error"}
        </div>
      )}

      {data && (
        <div>
          <section
            style={{
              border: "1px solid #ddd",
              borderRadius: "16px",
              background: "#fff",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "24px",
                flexWrap: "wrap",
                marginBottom: "24px",
              }}
            >
              <div style={{ minWidth: "280px", flex: 1 }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#7a7a7a",
                    marginBottom: "6px",
                    fontWeight: 500,
                  }}
                >
                  Company
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    lineHeight: 1.1,
                  }}
                >
                  {profile?.company_name ?? data.ticker}
                </h2>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginTop: "10px",
                    fontWeight: 500,
                  }}
                >
                  {data.ticker}
                  {profile?.exchange ? ` · ${profile.exchange}` : ""}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "40px",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <PriceBlock
                  closePrice={price?.close_price ?? null}
                  currency={price?.currency ?? null}
                  priceDate={price?.price_date ?? null}
                />
                <HeaderItem
                  label="Latest annual report filed"
                  value={getLatestAnnualReportPeriod(data.income_statement)}
                />
                <FilingLinkBlock
                  form={profile?.latest_annual_form ?? null}
                  filingDate={
                    profile?.latest_annual_filing_date
                      ? String(profile.latest_annual_filing_date)
                      : null
                  }
                  filingUrl={profile?.latest_annual_filing_url ?? null}
                />
                <HeaderItem
                  label="Last updated"
                  value={formatLastUpdated(data.last_updated)}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "40px",
                flexWrap: "wrap",
                paddingTop: "20px",
                borderTop: "1px solid #eee",
              }}
            >
              <HeaderItem
                label="Industry"
                value={profile?.industry ?? "N/A"}
              />
              <HeaderItem
                label="Fiscal year end"
                value={formatFiscalYearEnd(profile?.fiscal_year_end ?? null)}
              />
            </div>
          </section>

          <MetricCards ticker={data.ticker} metrics={data.metrics} />

          <FinancialReportTable
            ticker={data.ticker}
            title="Income Statement"
            report={data.income_statement}
          />

          <FinancialReportTable
            ticker={data.ticker}
            title="Balance Sheet"
            report={data.balance_sheet}
          />

          <FinancialReportTable
            ticker={data.ticker}
            title="Cash Flow"
            report={data.cash_flow}
          />
        </div>
      )}
    </div>
  );
}