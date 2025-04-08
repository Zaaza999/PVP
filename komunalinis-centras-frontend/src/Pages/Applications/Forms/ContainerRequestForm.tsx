import React, { useState } from "react";
import "../../styles.css";

const ContainerRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    vardas: "",
    adresas: "",
    kontaktai: "",
    data: "",
    talpa: "",
    daznumas: "",
    elPastasSaskaitai: "",
    pareiskejas: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      <h2 style={{ textAlign: "center" }}>Prašymas dėl mišrių atliekų konteinerio</h2>

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
        <label>Telefono numeris, el. pašto adresas</label>
        <input
          name="kontaktai"
          value={formData.kontaktai}
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
        <label>
          Pasirinkite norimą mišrių atliekų konteinerio talpą (litrais):
        </label>
        <select name="talpa" value={formData.talpa} onChange={handleChange}>
          <option value="">Pasirinkite</option>
          <option value="120">120</option>
          <option value="140">140</option>
          <option value="240">240</option>
        </select>
      </div>

      <div className="form-group">
        <label>Kiek kartų per metus konteinerį ištuštinti?</label>
        <select
          name="daznumas"
          value={formData.daznumas}
          onChange={handleChange}
        >
          <option value="">Pasirinkite</option>
          <option value="12">12 kartų</option>
          <option value="26">26 kartai</option>
          <option value="52">52 kartai</option>
        </select>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
          * Pagal taisykles konteineris gali būti tuštinamas 1 kartą per mėnesį,
          kai deklaruotas tik vienas ar nė vienas asmuo.
        </p>
      </div>

      <div className="form-group">
        <label>El. paštas sąskaitoms gauti</label>
        <input
          name="elPastasSaskaitai"
          value={formData.elPastasSaskaitai}
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

export default ContainerRequestForm;
