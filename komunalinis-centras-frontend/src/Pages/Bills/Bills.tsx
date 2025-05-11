import React, { useState } from "react";
import { createPortal } from "react-dom";
import "../styles.css";            // jau turi – kortelių & lentelių išvaizdai

/* ====== Tipai ====== */
type InvoiceStatus = "Paid" | "Unpaid";

interface Invoice {
  id: string;
  period: string;       // pvz. 2025‑01
  date: string;         // išrašymo data
  amount: number;       // €
  status: InvoiceStatus;
}

/* ====== Mock duomenys (vietoj API) ====== */
const initialInvoices: Invoice[] = [
  { id: "2025‑01‑001", period: "2025‑01", date: "2025‑02‑01", amount: 18.75, status: "Unpaid" },
  { id: "2024‑12‑002", period: "2024‑12", date: "2025‑01‑01", amount: 18.75, status: "Paid"   },
  { id: "2024‑11‑003", period: "2024‑11", date: "2024‑12‑01", amount: 18.75, status: "Paid"   },
];

/* ====== Modalas ====== */
interface PayModalProps {
  invoice: Invoice;
  onClose: () => void;
  onConfirm: () => void;
}

const PayModal: React.FC<PayModalProps> = ({ invoice, onClose, onConfirm }) =>
  createPortal(
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Apmokėti sąskaitą</h3>
        <p>
          Sąskaita <strong>{invoice.id}</strong> &nbsp;
          (€ {invoice.amount.toFixed(2)})
        </p>
        <div className="modal-actions">
          <button className="btn" onClick={onConfirm}>Apmokėti</button>
          <button className="btn btn-delete" onClick={onClose}>Atšaukti</button>
        </div>
      </div>
    </div>,
    document.body
  );

/* ====== Pagrindinis puslapis ====== */
const InvoicePage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selected, setSelected] = useState<Invoice | null>(null);

  /* — skaičiuojamosios reikšmės — */
  const totalPaid   = invoices.filter(i => i.status === "Paid"  ).reduce((s, i) => s + i.amount, 0);
  const totalUnpaid = invoices.filter(i => i.status === "Unpaid").reduce((s, i) => s + i.amount, 0);

  /* — mygtuko „Apmokėti“ paspaudimas — */
  const handlePay = (invoice: Invoice) => setSelected(invoice);

  /* — patvirtinimas modale (čia jungtum back‑end / gateway) — */
  const confirmPayment = () => {
    if (!selected) return;
    setInvoices(prev =>
      prev.map(i => i.id === selected.id ? { ...i, status: "Paid" } : i)
    );
    setSelected(null);
  };

  return (
    <main className="container">
      <h2>Sąskaitos</h2>

      {/* Suvestinė */}
      <div className="card" style={{ display:"flex", gap:"30px", justifyContent:"space-between" }}>
        <div><strong>Iš viso apmokėta:</strong> € {totalPaid.toFixed(2)}</div>
        <div><strong>Neapmokėta:</strong> € {totalUnpaid.toFixed(2)}</div>
      </div>

      {/* Lentelė */}
      <div className="table-container">
        <table className="time-slots-table">
          <thead>
            <tr>
              <th>Nr.</th>
              <th>Laikotarpis</th>
              <th>Išrašyta</th>
              <th>Suma (€)</th>
              <th>Būsena</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.period}</td>
                <td>{inv.date}</td>
                <td>{inv.amount.toFixed(2)}</td>
                <td>
                  {inv.status === "Paid"
                    ? <span style={{ color:"#4caf50", fontWeight:600 }}>Apmokėta</span>
                    : <span style={{ color:"#e65100", fontWeight:600 }}>Neapmokėta</span>}
                </td>
                <td>
                  {inv.status === "Unpaid" && (
                    <button className="btn" onClick={() => handlePay(inv)}>
                      Apmokėti
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modalas */}
      {selected && (
        <PayModal
          invoice={selected}
          onClose={() => setSelected(null)}
          onConfirm={confirmPayment}
        />
      )}
    </main>
  );
};

export default InvoicePage;
