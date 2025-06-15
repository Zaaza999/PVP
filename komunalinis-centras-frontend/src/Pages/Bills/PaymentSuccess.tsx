import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Invoice {
  id: number;
  amount: number;
  remaining: number;
  currency: string;
  dueDate: string;
  status: string;
  topic: string;
}

const API = "http://localhost:5190";

export default function InvoicePage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [vals, setVals] = useState<Record<number, string>>({});
  const [sel,  setSel]  = useState<Record<number, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [loading, setLd] = useState(true);
  const [showPaid, setPaid] = useState(false);

  /* fetch */
  useEffect(() => { load(); }, []);
  async function load() {
    setLd(true);
    try {
      const r = await fetch(`${API}/invoices`);
      const data: Invoice[] = await r.json();
      setRows(data);
      const v:Record<number,string>={}, c:Record<number,boolean>={};
      data.forEach(i => { v[i.id]=i.remaining.toString(); c[i.id]=false; });
      setVals(v); setSel(c);
    } finally { setLd(false); }
  }

  /* pay */
  async function paySelected() {
    const items = Object.entries(sel)
      .filter(([id, chk]) => chk)
      .map(([id]) => ({ invoiceId:+id, amount:parseFloat(vals[+id]) }))
      .filter(i => !isNaN(i.amount) && i.amount>0);

    if (items.length===0) return alert("Pažymėkite sąskaitas");
    setBusy(true);
    try {
      const r = await fetch(`${API}/payments/batch`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ items })
      });
      if(!r.ok) throw new Error(await r.text());
      const { redirectUrl } = await r.json();
      window.location.href = redirectUrl;
    } catch(e:any){ alert(e.message); } finally{ setBusy(false); }
  }

  /* computed */
  const view  = rows.filter(r=>showPaid ? r.remaining===0 : r.remaining>0);
  const total = view.filter(i=>sel[i.id]).reduce((s,i)=>{
    const n=parseFloat(vals[i.id]); return !isNaN(n)&&n>0&&n<=i.remaining? s+n:s;
  },0);
  const cur = rows[0]?.currency||"";

  if (loading) return <p className="center">Kraunama…</p>;

  return (
    <div className="container">
      <h1>Sąskaitos</h1>
      <div className="toolbar">
        <button className="btn" onClick={()=>setPaid(p=>!p)}>
          {showPaid? "Rodyti neapmokėtas":"Rodyti apmokėtas"}
        </button>
        {!showPaid && (
          <button className="btn btn-primary"
                  disabled={busy||total===0}
                  onClick={paySelected}>
            Apmokėti pasirinktas ({total.toFixed(2)} {cur})
          </button>
        )}
      </div>

      {view.length===0 ? (
        <p>{showPaid?"Nėra apmokėtų":"Nėra neapmokėtų"}</p>
      ) : (
        <table>
          <thead>
            <tr>
              {!showPaid && <th></th>}
              <th>Tema</th><th>Likutis</th><th>Terminas</th><th>Būsena</th>
              {!showPaid && <th>Suma</th>}
            </tr>
          </thead>
          <tbody>
            {view.map(inv=>(
              <tr key={inv.id} className={inv.remaining===0?"paid":""}>
                {!showPaid && (
                  <td><input type="checkbox"
                             checked={sel[inv.id]}
                             onChange={e=>setSel({...sel,[inv.id]:e.target.checked})}/></td>
                )}
                <td>{inv.topic}</td>
                <td>{inv.remaining.toFixed(2)} {inv.currency}</td>
                <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td>{inv.status}</td>
                {!showPaid && (
                  <td>
                    <input type="number" min="0" step="0.01"
                           value={vals[inv.id]}
                           onChange={e=>setVals({...vals,[inv.id]:e.target.value})}/>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/" className="back-button">↩ Grįžti</Link>
    </div>
  );
}
