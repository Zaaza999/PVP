// src/pages/bills/Invoice.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Invoice {
  id: number;
  amount: number;
  remaining: number;
  currency: string;
  dueDate: string;
  status: string;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5190";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [partialAmts, setPartialAmts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [payingAll, setPayingAll] = useState(false);
  const [showPaid, setShowPaid] = useState(false); // toggle paid invoices

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
    const input = partialAmts[invoiceId];
    const amt = parseFloat(input);
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

  const totalAmount = Object.entries(partialAmts)
    .reduce((sum, [id, val]) => {
      const amt = parseFloat(val);
      const invoice = invoices.find(inv => inv.id === Number(id));
      if (!isNaN(amt) && invoice && amt > 0 && amt <= invoice.remaining) {
        return sum + amt;
      }
      return sum;
    }, 0);

  const currency = invoices[0]?.currency || "";

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Mano sąskaitos</h1>
        <button
          className="px-3 py-1 bg-gray-600 text-white rounded"
          onClick={() => setShowPaid(prev => !prev)}
        >
          {showPaid ? 'Rodyti neapmokėtas' : 'Rodyti apmokėtas'}
        </button>
      </div>

      {loading ? (
        <p>Kraunama…</p>
      ) : filteredInvoices.length === 0 ? (
        <p>{showPaid ? 'Nėra apmokėtų sąskaitų.' : 'Nėra neapmokėtų sąskaitų.'}</p>
      ) : (
        <>
          <ul className="space-y-4">
            {filteredInvoices.map(inv => (
              <li
                key={inv.id}
                className="border p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div>
                  <strong>#{inv.id}</strong> — likutis: {inv.remaining.toFixed(2)} {inv.currency}
                  <br />
                  Terminas: {new Date(inv.dueDate).toLocaleDateString()} | Būsena: {inv.status}
                </div>
                {!showPaid && (
                  <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                    <input
                      type="number"
                      className="border p-1 w-24"
                      value={partialAmts[inv.id] || ""}
                      onChange={e =>
                        setPartialAmts(prev => ({
                          ...prev,
                          [inv.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
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

          {!showPaid && (
            <div className="mt-6 flex justify-end items-center space-x-4">
              <span className="text-lg">
                Viso: <strong>{totalAmount.toFixed(2)}</strong> {currency}
              </span>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handlePayAll}
                disabled={payingAll || totalAmount === 0}
              >
                Apmokėti viską
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
