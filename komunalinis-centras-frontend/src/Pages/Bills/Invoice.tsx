import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Payment {
  id: number;
  amount: number;
  currency: string;
  provider: string;
  providerTxnId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: number;
  amount: number;
  remaining: number;
  currency: string;
  dueDate: string;
  status: string;
  topic: string;
  payments: Payment[];
}

const API = "http://localhost:5190";

const MONTHS = [
  "Sausis", "Vasaris", "Kovas", "Balandis",
  "Gegužė", "Birželis", "Liepa", "Rugpjūtis",
  "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"
];

const STATUS_MAP: Record<string, string> = {
  paid: "Apmokėta",
  issued: "Neapmokėta",
  pending: "Laukia apmokėjimo",
  cancelled: "Atšaukta"
};

export default function InvoicePage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [vals, setVals] = useState<Record<number, string>>({});
  const [sel, setSel] = useState<Record<number, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [loading, setLd] = useState(true);
  const [showPaid, setPaid] = useState(false);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLd(true);
    try {
      const res = await fetch(`${API}/invoices`);
      const data: Invoice[] = await res.json();
      setRows(data);
      const v: Record<number,string> = {};
      const c: Record<number,boolean> = {};
      data.forEach(inv => {
        v[inv.id] = inv.remaining.toFixed(2);
        c[inv.id] = false;
      });
      setVals(v);
      setSel(c);
    } finally {
      setLd(false);
    }
  }

  async function paySelected() {
    const items = Object.entries(sel)
      .filter(([, chk]) => chk)
      .map(([id]) => ({ invoiceId: +id, amount: parseFloat(vals[+id]) }))
      .filter(i => !isNaN(i.amount) && i.amount > 0);

    if (items.length === 0) {
      alert("Pažymėkite sąskaitas ir įveskite sumas");
      return;
    }

    setBusy(true);
    try {
      const resp = await fetch(`${API}/payments/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });
      if (!resp.ok) throw new Error(await resp.text());
      const { redirectUrl } = await resp.json();
      window.location.href = redirectUrl;
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  let view = rows.filter(inv => showPaid ? inv.remaining === 0 : inv.remaining > 0);

  if (showPaid && monthFilter !== null) {
    view = view.filter(inv => new Date(inv.dueDate).getMonth() === monthFilter);
  }

  const totalSelected = view
    .filter(inv => sel[inv.id])
    .reduce((sum, inv) => {
      const n = parseFloat(vals[inv.id]);
      return (!isNaN(n) && n > 0 && n <= inv.remaining) ? sum + n : sum;
    }, 0);

  const totalAll = view.reduce((sum, inv) => {
    const v = showPaid
      ? inv.payments.reduce((s,p) => s + p.amount, 0)
      : inv.remaining;
    return sum + v;
  }, 0);

  const paidCount = showPaid ? view.length : 0;
  const cur = rows[0]?.currency || "";

  if (loading) return <p className="center">Kraunama…</p>;

  return (
    <div className="container">
      <h1>Sąskaitos</h1>

      <div className="summary">
        <strong>
          {showPaid ? "Viso sumokėta:" : "Viso likučių:"}{" "}
          {totalAll.toFixed(2)} {cur}
        </strong>
      </div>

      <div className="toolbar" style={{ display: "flex", alignItems: "center" }}>
        <button className="btn" onClick={() => setPaid(p => !p)}>
          {showPaid ? "Rodyti neapmokėtas" : "Rodyti apmokėtas"}
        </button>

        {!showPaid && (
          <button
            className="btn btn-primary"
            disabled={busy || totalSelected === 0}
            onClick={paySelected}
          >
            Apmokėti ({totalSelected.toFixed(2)} {cur})
          </button>
        )}

        {showPaid && (
          <select
            className="btn"
            style={{ marginLeft: "auto" }}
            value={monthFilter ?? ""}
            onChange={e => {
              const v = e.target.value;
              setMonthFilter(v === "" ? null : parseInt(v, 10));
            }}
          >
            <option value="">Visi mėnesiai</option>
            {Array.from(new Set(
              rows
                .filter(inv => inv.remaining === 0)
                .map(inv => new Date(inv.dueDate).getMonth())
            ))
              .sort((a,b) => a - b)
              .map(m => (
                <option key={m} value={m}>
                  {MONTHS[m]}
                </option>
              ))}
          </select>
        )}
      </div>

      {showPaid && (
        <p className="summary">
          Apmokėtų sąskaitų skaičius: {paidCount}
        </p>
      )}

      {view.length === 0 ? (
        <p>{showPaid ? "Nėra apmokėtų" : "Nėra neapmokėtų"}</p>
      ) : (
        <table>
          <thead>
            <tr>
              {!showPaid && <th></th>}
              <th>Tema</th>
              {showPaid ? (
                <>
                  <th>Originali suma</th>
                  <th>Sumokėta</th>
                </>
              ) : (
                <th>Likutis</th>
              )}
              <th>Terminas</th>
              <th>Būsena</th>
              {!showPaid && <th>Suma</th>}
            </tr>
          </thead>
          <tbody>
            {view.map(inv => {
              const paidSoFar = inv.payments.reduce((s,p) => s + p.amount, 0);
              return (
                <tr key={inv.id} className={inv.remaining === 0 ? "paid" : ""}>
                  {!showPaid && (
                    <td>
                      <input
                        type="checkbox"
                        checked={sel[inv.id]}
                        onChange={e => setSel({ ...sel, [inv.id]: e.target.checked })}
                      />
                    </td>
                  )}
                  <td>{inv.topic}</td>
                  {showPaid ? (
                    <>
                      <td>{inv.amount.toFixed(2)} {inv.currency}</td>
                      <td>{paidSoFar.toFixed(2)} {inv.currency}</td>
                    </>
                  ) : (
                    <td>{inv.remaining.toFixed(2)} {inv.currency}</td>
                  )}
                  <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td>{STATUS_MAP[inv.status.toLowerCase()] || inv.status}</td>
                  {!showPaid && (
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={vals[inv.id]}
                        onChange={e => setVals({ ...vals, [inv.id]: e.target.value })}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <Link to="/" className="back-button">
        ↩ Grįžti
      </Link>
    </div>
  );
}
