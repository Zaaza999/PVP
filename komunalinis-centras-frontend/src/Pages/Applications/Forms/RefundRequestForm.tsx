import React, { useState } from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";
import "../../styles.css";

const RefundRequestForm: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useFormSubmit("WasteFeeExemption");  

  return (
    <form onSubmit={handleSubmit} className="weekly-schedule-container">
      <h2 style={{ textAlign: "center" }}>Prašymas grąžinti permoką</h2>

      <p>Skirta: Kauno rajono savivaldybei</p>

      <div className="form-group">
        <label>Vardas, pavardė</label>
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
        <label>Mokėtojo kodas</label>
        <input
          name="mokejimoKodas"
          value={formData.mokejimoKodas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Prašymo data</label>
        <input
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange}
        />
      </div>

      <hr />

      <p style={{ fontWeight: 600 }}>Prašymo turinys:</p>

      <div className="form-group">
        <label>Pervedimo data</label>
        <input
          name="pervedimoData"
          type="date"
          value={formData.pervedimoData}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>
          Suma žodžiais (pvz.: „vienas euras nulis centų“)
        </label>
        <input
          name="sumaZodziais"
          value={formData.sumaZodziais}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Operacijos numeris</label>
        <input
          name="operacijosNr"
          value={formData.operacijosNr}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Kam grąžinti (vardas, pavardė)</label>
        <input
          name="grazintiKam"
          value={formData.grazintiKam}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Banko sąskaitos numeris</label>
        <input
          name="saskaitosNr"
          value={formData.saskaitosNr}
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

export default RefundRequestForm;
