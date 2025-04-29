import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";
import "../../styles.css";

const WasteFeeExemptionBusinessForm: React.FC = () => {
  
  const { formData, handleChange, handleSubmit } = useFormSubmit("WasteFeeExemption");

  return (
    <form onSubmit={handleSubmit} className="weekly-schedule-container">
      <h2 className="mb-4" style={{ textAlign: "center" }}>
        Prašymas atleisti nuo vietinės rinkliavos (Juridiniams asmenims)
      </h2>

      <p>
        Pildykite, jei nekilnojamojo turto objekte nevykdoma ūkinė veikla.
      </p>

      <div className="form-group">
        <label>Objekto adresas, savininko vardas, pavardė</label>
        <input
          name="patalpuAdresas"
          value={formData.patalpuAdresas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Kontaktai (adresas, telefonas, el. paštas)</label>
        <input
          name="korespondencijosAdresas"
          value={formData.korespondencijosAdresas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Nekilnojamojo turto informacija</label>
        <input
          name="turtoAdresas"
          placeholder="Adresas"
          value={formData.turtoAdresas}
          onChange={handleChange}
        />
        <input
          name="bendrasPlotas"
          placeholder="Bendras plotas (m²)"
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
        <label>Atleidimo laikotarpis</label>
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
        <label>Prašymo data</label>
        <input
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Atliekų turėtojo vardas, pavardė</label>
        <input
          name="vardasPavarde"
          placeholder="Vardas Pavardė"
          value={formData.vardasPavarde}
          onChange={handleChange}
        />
      </div>

      <div style={{ fontSize: "0.9rem", marginTop: "20px" }}>
        <p>
          Įsipareigoju pateikti vandens/elektros sunaudojimo pažymas arba kitus įrodymus, pagrindžiančius ūkinės veiklos nevykdymą.
        </p>
        <p>
          Leidžiu naudoti mano duomenis Administratoriaus registre ir suprantu pareigą pranešti apie duomenų pasikeitimus per 30 dienų.
        </p>
      </div>

      <button type="submit" className="btn" style={{ marginTop: "20px" }}>
        Pateikti prašymą
      </button>
    </form>
  );
};

export default WasteFeeExemptionBusinessForm;
