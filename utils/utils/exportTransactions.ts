import { saveAs } from "file-saver";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  metadata?: any;
  createdAt: string;
}

export interface ExportOptions {
  format: "csv" | "json";
  from?: Date;
  to?: Date;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const query = `
    query GetUserTransactions {
      userTransactions {
        id
        userId
        amount
        type
        metadata
        createdAt
      }
    }
  `;

  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  return json?.data?.userTransactions || [];
}

function filterTransactions(data: Transaction[], from?: Date, to?: Date) {
  return data.filter((tx) => {
    const d = new Date(tx.createdAt);
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
}

function toCSV(data: Transaction[]): string {
  const headers = ["id", "userId", "amount", "type", "metadata", "createdAt"];

  const rows = data.map((tx) => [
    tx.id,
    tx.userId,
    tx.amount,
    tx.type,
    JSON.stringify(tx.metadata || {}),
    tx.createdAt,
  ]);

  return [
    headers.join(","),
    ...rows.map((r) =>
      r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
}

function toJSON(data: Transaction[]): string {
  return JSON.stringify(data, null, 2);
}

export async function exportTransactions(options: ExportOptions) {
  const all = await fetchTransactions();
  const filtered = filterTransactions(all, options.from, options.to);

  const content =
    options.format === "csv" ? toCSV(filtered) : toJSON(filtered);

  const blob = new Blob([content], {
    type:
      options.format === "csv"
        ? "text/csv;charset=utf-8;"
        : "application/json",
  });

  saveAs(blob, `transactions.${options.format}`);
}
