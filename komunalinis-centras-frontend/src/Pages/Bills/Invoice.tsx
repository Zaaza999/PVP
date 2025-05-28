// src/pages/bills/Invoice.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";  // Įsitikinkite, kad kelias atitinka jūsų projekto struktūrą 
import { Link, useParams } from "react-router-dom";


interface Invoice {
  id: number;
  amount: number;
  remaining: number;
  currency: string;
  dueDate: string;
  status: string;
  topic: string;
}

// Statusų vertimų žemėlapis
const STATUS_LABELS: Record<string, string> = {
  Issued: "Neapmokėta",
  Paid: "Apmokėta",
};

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5190";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [partialAmts, setPartialAmts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [payingAll, setPayingAll] = useState(false);
  const [showPaid, setShowPaid] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    setLoading(true);
    try {
      const res = await axios.get<Invoice[]>(`${API_URL}/invoices`);
      setInvoices(res.data);
      const initial: Record<number, string> = {};
      res.data.forEach(inv => {
        initial[inv.id] = inv.remaining.toString();
      });
      setPartialAmts(initial);
    } catch (e) {
      console.error(e);
      alert("Nepavyko užkrauti sąskaitų");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay(invoiceId: number) {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    const amt = parseFloat(partialAmts[invoiceId]);
    if (isNaN(amt) || amt <= 0 || amt > invoice.remaining) {
      return alert(`Įveskite sumą tarp 0 ir ${invoice.remaining.toFixed(2)}`);
    }
    try {
      await axios.post(
        `${API_URL}/invoices/${invoiceId}/payments`,
        { amount: amt }
      );
      await loadInvoices();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data ?? "Nepavyko atlikti mokėjimo");
    }
  }

  async function handlePayAll() {
    const entries = Object.entries(partialAmts)
      .map(([id, val]) => ({
        invoiceId: Number(id),
        amount: parseFloat(val)
      }))
      .filter(e => e.amount > 0);

    if (entries.length === 0) {
      return alert("Prašome įvesti bent vieną sumą");
    }

    setPayingAll(true);
    try {
      for (const { invoiceId, amount } of entries) {
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (!invoice) continue;
        if (amount > invoice.remaining) {
          alert(`Sąskaita #${invoiceId}: suma turi būti ≤ ${invoice.remaining.toFixed(2)}`);
          continue;
        }
        await axios.post(
          `${API_URL}/invoices/${invoiceId}/payments`,
          { amount }
        );
      }
      await loadInvoices();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data ?? "Klaida mokant visas sumas");
    } finally {
      setPayingAll(false);
    }
  }

  const filteredInvoices = invoices.filter(inv =>
    showPaid ? inv.remaining === 0 : inv.remaining > 0
  );

  const totalUnpaid = Object.entries(partialAmts).reduce((sum, [id, val]) => {
    const amt = parseFloat(val);
    const inv = invoices.find(i => i.id === Number(id));
    return (!isNaN(amt) && inv && amt > 0 && amt <= inv.remaining)
      ? sum + amt
      : sum;
  }, 0);

  const totalPaid = filteredInvoices
    .filter(inv => inv.remaining === 0)
    .reduce((sum, inv) => sum + inv.amount, 0);

  const currency = invoices[0]?.currency || "";

  return (
    <div className="invoice-page">
      <div className="page-header">
        <h1>Mano sąskaitos</h1>
        <button
          className="invoice-toggle-btn"
          onClick={() => setShowPaid(prev => !prev)}
        >
          {showPaid ? "Rodyti neapmokėtas" : "Rodyti apmokėtas"}
        </button>
      </div>

      {loading ? (
        <p>Kraunama…</p>
      ) : filteredInvoices.length === 0 ? (
        <p>
          {showPaid
            ? "Nėra apmokėtų sąskaitų."
            : "Nėra neapmokėtų sąskaitų."}
        </p>
      ) : (
        <>
          <ul className="invoice-list">
            {filteredInvoices.map(inv => (
              <li key={inv.id} className="invoice-item">
                <div className="details">
                  <strong>#{inv.topic}</strong>
                  <p>
                    {showPaid
                      ? `Sumokėta: ${inv.amount.toFixed(2)} ${inv.currency}`
                      : `Likutis: ${inv.remaining.toFixed(2)} ${inv.currency}`
                    }
                    <br />
                    Terminas: {new Date(inv.dueDate).toLocaleDateString()} | Būsena:{" "}
                    {STATUS_LABELS[inv.status] ?? inv.status}
                  </p>
                </div>
                {!showPaid && (
                  <div className="actions">
                    <input
                      type="number"
                      value={partialAmts[inv.id] || ""}
                      onChange={e =>
                        setPartialAmts(prev => ({
                          ...prev,
                          [inv.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn-pay"
                      onClick={() => handlePay(inv.id)}
                      disabled={payingAll}
                    >
                      Mokėti
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {showPaid ? (
            <div className="invoice-summary">
              <span className="total">
                Bendra sumokėta: <strong>{totalPaid.toFixed(2)}</strong> {currency}
              </span>
            </div>
          ) : (
            <div className="invoice-summary">
              <span className="total">
                Viso: <strong>{totalUnpaid.toFixed(2)}</strong> {currency}
              </span>
              <button
                className="btn-pay-all"
                onClick={handlePayAll}
                disabled={payingAll || totalUnpaid === 0}
              >
                Apmokėti viską
              </button>  

            </div> 
            
            
          )} 
          <div className="button-wrapper">
                <Link to="/" className="back-button">
                  Grįžti
                </Link>
          </div>
        </>
      )}
    </div>
  );
}
