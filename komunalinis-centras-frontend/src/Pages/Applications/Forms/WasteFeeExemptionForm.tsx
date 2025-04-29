import React, { useState } from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";
import "../../styles.css";

const WasteFeeExemptionForm: React.FC = () => {

  const { formData, handleChange, handleSubmit } = useFormSubmit("WasteFeeExemption");  
  
  return (
    <form onSubmit={handleSubmit} className="weekly-schedule-container">
      <h2 className="mb-4" style={{ textAlign: "center" }}>
        Prašymas – Atleisti nuo kintamosios vietinės rinkliavos dedamosios mokėjimo
      </h2>
  
      <div className="form-group">
        <label>Patalpų adresas ir savininko vardas, pavardė</label>
        <input
          name="patalpuAdresas"
          value={formData.patalpuAdresas}
          onChange={handleChange}
          placeholder="Pvz.: Taikos pr. 1, Kaunas – Jonas Jonaitis"
        />
      </div>
  
      <div className="form-group">
        <label>Adresas korespondencijai, telefono Nr., el. paštas</label>
        <input
          name="korespondencijosAdresas"
          value={formData.korespondencijosAdresas}
          onChange={handleChange}
          placeholder="Pvz.: korespondencijos@el.paštas.lt, 860000000"
        />
      </div>
  
      <div className="form-group">
        <label>Prašymo pateikimo data</label>
        <input
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange}
        />
      </div>
  
      <div className="form-group">
        <label>Nekilnojamojo turto objekto adresas, plotas, unikalus numeris</label>
        <input
          name="turtoAdresas"
          placeholder="Adresas"
          value={formData.turtoAdresas}
          onChange={handleChange}
        />
        <input
          name="bendrasPlotas"
          placeholder="Plotas m²"
          value={formData.bendrasPlotas}
          onChange={handleChange}
        />
        <input
          name="unikalusNr"
          placeholder="Unikalus numeris"
          value={formData.unikalusNr}
          onChange={handleChange}
        />
      </div>
  
      <div className="form-group">
        <label>Laikotarpis, kuriam prašoma atleisti</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            name="laikotarpisNuo"
            type="date"
            value={formData.laikotarpisNuo}
            onChange={handleChange}
          />
          <input
            name="laikotarpisIki"
            type="date"
            value={formData.laikotarpisIki}
            onChange={handleChange}
          />
        </div>
      </div>
  
      <div className="form-group">
        <label>Vandens tiekimo būsena</label>
        <select
          name="vandensTiekimas"
          value={formData.vandensTiekimas}
          onChange={handleChange}
        >
          <option value="">Pasirinkite</option>
          <option value="vykdomas">Vykdomas</option>
          <option value="nevykdomas">Nevykdomas</option>
        </select>
      </div>
  
      <div className="form-group">
        <label>Elektros skaitiklio būsena</label>
        <select
          name="elektrosSkaitiklis"
          value={formData.elektrosSkaitiklis}
          onChange={handleChange}
        >
          <option value="">Pasirinkite</option>
          <option value="irengtas">Įrengtas</option>
          <option value="neirengtas">Neįrengtas</option>
        </select>
      </div>
  
      <div className="form-group">
        <label>Vandens parodymai laikotarpio pradžioje</label>
        <input
          name="vandensParodymai"
          placeholder="m³"
          value={formData.vandensParodymai}
          onChange={handleChange}
        />
      </div>
  
      <div className="form-group">
        <label>Elektros parodymai laikotarpio pradžioje</label>
        <input
          name="elektrosParodymai"
          placeholder="kWh"
          value={formData.elektrosParodymai}
          onChange={handleChange}
        />
      </div>
  
      <div className="form-group">
        <label>Atliekų turėtojo vardas, pavardė (parašas)</label>
        <input
          name="vardasPavarde"
          placeholder="Vardas Pavardė"
          value={formData.vardasPavarde}
          onChange={handleChange}
        />
      </div>
  
      <button type="submit" className="btn" style={{ marginTop: "20px" }}>
        Pateikti prašymą
      </button>
    </form>
  );
  
};

export default WasteFeeExemptionForm;
