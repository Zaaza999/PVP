import React, { useState } from "react";
import "../../styles.css";

const ContainerFrequencyChangeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    vardas: "",
    adresas: "",
    telefonas: "",
    data: "",
    nuoData: "",
    daznis: "",
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
      <h2 style={{ textAlign: "center" }}>
        Prašymas dėl mišrių atliekų konteinerio ištuštinimo dažnio keitimo
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
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Nuo kurios datos taikyti naują ištuštinimo dažnį?</label>
        <input
          name="nuoData"
          type="date"
          value={formData.nuoData}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Pasirinkite naują ištuštinimo dažnį (per mėnesį)</label>
        <select name="daznis" value={formData.daznis} onChange={handleChange}>
          <option value="">Pasirinkite</option>
          <option value="1">1 kartą</option>
          <option value="2">2 kartus</option>
          <option value="4">4 kartus</option>
        </select>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
          * 1 kartą per mėn. galimas tik kai namų valdoje gyvena vienas asmuo
          (remiantis 50.4 punktu).
        </p>
      </div>

      <div className="form-group">
        <label>Atliekų turėtojo vardas, pavardė (parašas)</label>
        <input
          name="pareiskejas"
          placeholder="Vardas Pavardė"
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

export default ContainerFrequencyChangeForm;
