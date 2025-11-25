import React, { useState } from "react";
import { exportTransactions } from "../utils/exportTransactions";

const ExportTransactionsButton: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      await exportTransactions({
        format,
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      });
    } catch (error) {
      console.error(error);
      alert("Export failed. Check console for details.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginTop: "1rem",
        flexWrap: "wrap",
      }}
    >
      <label>
        From:
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{ marginLeft: "4px", padding: "4px" }}
        />
      </label>

      <label>
        To:
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ marginLeft: "4px", padding: "4px" }}
        />
      </label>

      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as "csv" | "json")}
        style={{ padding: "4px" }}
      >
        <option value="csv">CSV</option>
        <option value="json">JSON</option>
      </select>

      <button
        onClick={handleExport}
        disabled={loading}
        style={{
          padding: "8px 14px",
          backgroundColor: "#4f46e5",
          color: "#fff",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Exporting..." : "Export"}
      </button>
    </div>
  );
};

export default ExportTransactionsButton;
