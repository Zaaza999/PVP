// src/Pages/Bills/Bills.tsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import "../styles.css";

/* ====== Tipai ====== */
interface Invoice {
  id: string;
  period: string;    // pvz. 2025‑01
  date: string;      // išrašymo data
  amount: number;    // bendra suma (€)
  paid: number;      // kiek jau apmokėta (€)
}

/* ====== Mock duomenys (vietoj API) ====== */
const initialInvoices: Invoice[] = [
  { id: "2025‑01‑001", period: "2025‑01", date: "2025‑02‑01", amount: 18.75, paid: 0 },
  { id: "2024‑12‑002", period: "2024‑12", date: "2025‑01‑01", amount: 18.75, paid: 18.75 },
  { id: "2024‑11‑003", period: "2024‑11", date: "2024‑12‑01", amount: 18.75, paid: 18.75 },
];

/* ====== Modalas ====== */
interface PayModalProps {
  invoice: Invoice;
  onClose: () => void;
  onConfirm: (sum: number) => void;
}

const PayModal: React.FC<PayModalProps> = ({ invoice, onClose, onConfirm }) => {
  const outstanding = +(invoice.amount - invoice.paid).toFixed(2);
  const [sum, setSum] = useState<number>(outstanding);
  const invalid = sum <= 0 || sum > outstanding;

  return createPortal(
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Apmokėti sąskaitą</h3>
        <p>
          Sąskaita <strong>{invoice.id}</strong><br />
          Iš viso: € {invoice.amount.toFixed(2)} &nbsp; • &nbsp; Liko: € {outstanding.toFixed(2)}
        </p>

        <div className="form-group" style={{ marginTop: "15px" }}>
          <label htmlFor="pay-sum">Mokama suma (€)</label>
          <input
            id="pay-sum"
            type="number"
            min={0.01}
            step={0.01}
            max={outstanding}
            value={sum}
            onChange={(e) => setSum(+e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn" disabled={invalid} onClick={() => onConfirm(+sum.toFixed(2))}>
            Apmokėti
          </button>
          <button className="btn btn-delete" onClick={onClose}>Atšaukti</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ====== Pagrindinis puslapis ====== */
const InvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selected, setSelected] = useState<Invoice | null>(null);

  /* — skaičiuojamosios reikšmės — */
  const totalPaid       = invoices.reduce((s, i) => s + i.paid, 0);
  const totalOutstanding= invoices.reduce((s, i) => s + (i.amount - i.paid), 0);

  /* — mygtuko „Apmokėti“ paspaudimas — */
  const handlePay = (invoice: Invoice) => setSelected(invoice);

  /* — patvirtinimas modale — */
  const confirmPayment = (sum: number) => {
    if (!selected) return;
    setInvoices(prev =>
      prev.map(i =>
        i.id === selected.id
          ? { ...i, paid: +(Math.min(i.amount, i.paid + sum).toFixed(2)) }
          : i
      )
    );
    setSelected(null);
  };

  /* ====== lentelės renderis ====== */
  return (
    <main className="container">
      <h2>Sąskaitos</h2>

      {/* Suvestinė */}
      <div className="card" style={{ display: "flex", gap: "30px", justifyContent: "space-between" }}>
        <div><strong>Iš viso apmokėta:</strong> € {totalPaid.toFixed(2)}</div>
        <div><strong>Liko apmokėti:</strong> € {totalOutstanding.toFixed(2)}</div>
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
              <th>Apmokėta (€)</th>
              <th>Liko (€)</th>
              <th>Būsena</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => {
              const outstanding = +(inv.amount - inv.paid).toFixed(2);
              const isPaid = outstanding === 0;
              return (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  <td>{inv.period}</td>
                  <td>{inv.date}</td>
                  <td>{inv.amount.toFixed(2)}</td>
                  <td>{inv.paid.toFixed(2)}</td>
                  <td>{outstanding.toFixed(2)}</td>
                  <td>
                    {isPaid ? (
                      <span style={{ color: "#4caf50", fontWeight: 600 }}>Apmokėta</span>
                    ) : (
                      <span style={{ color: "#e65100", fontWeight: 600 }}>Neapmokėta</span>
                    )}
                  </td>
                  <td>
                    {!isPaid && (
                      <button className="btn" onClick={() => handlePay(inv)}>
                        Apmokėti
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="button-wrapper">
          <button className="back-button" onClick={() => navigate("/")}>Grįžti į pagrindinį puslapį</button>
        </div>
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
