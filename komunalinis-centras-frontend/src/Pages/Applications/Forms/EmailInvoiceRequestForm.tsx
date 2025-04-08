import React, { useState } from "react";
import "../../styles.css";

const EmailInvoiceRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    vardas: "",
    adresas: "",
    telefonas: "",
    data: "",
    elPastas: "",
    pareiskejas: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pateikta forma:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="weekly-schedule-container">
      <h2 style={{ textAlign: "center" }}>
        Prašymas dėl sąskaitų siuntimo el. paštu
      </h2>

      <p>Skirta: UAB Komunalinių paslaugų centro Direktoriui</p>

      <div className="form-group">
        <label>Nekilnojamojo turto objekto savininko vardas, pavardė</label>
        <input
          name="vardas"
          value={formData.vardas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Adresas</label>
        <input
          name="adresas"
          value={formData.adresas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Telefono numeris</label>
        <input
          name="telefonas"
          value={formData.telefonas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Data</label>
        <input
          type="date"
          name="data"
          value={formData.data}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>El. pašto adresas sąskaitų siuntimui</label>
        <input
          name="elPastas"
          type="email"
          value={formData.elPastas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Atliekų turėtojo vardas, pavardė (parašas)</label>
        <input
          name="pareiskejas"
          value={formData.pareiskejas}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn" style={{ marginTop: "20px" }}>
        Pateikti prašymą
      </button>
    </form>
  );
};

export default EmailInvoiceRequestForm;
