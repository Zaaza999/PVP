import React, { useState } from "react";
import "../../styles.css";

const WasteFeeExemptionBusinessForm: React.FC = () => {
  const [formData, setFormData] = useState({
    patalpuAdresas: "",
    korespondencijosAdresas: "",
    data: "",
    turtoAdresas: "",
    bendrasPlotas: "",
    unikalusNr: "",
    laikotarpisNuo: "",
    laikotarpisIki: "",
    vardasPavarde: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="weekly-schedule-container">
      <h2 className="mb-4" style={{ textAlign: "center" }}>
        Prašymas – Atleisti nuo kintamosios vietinės rinkliavos dedamosios
        mokėjimo (Juridiniams asmenims)
      </h2>

      <p>
        Užpildykite šią formą, jei deklaruojate, kad nekilnojamojo turto
        objekte nebuvo vykdoma ūkinė veikla ir norite būti atleisti nuo
        kintamosios rinkliavos mokėjimo.
      </p>

      <div className="form-group">
        <label>Patalpų adresas, savininko vardas, pavardė</label>
        <input
          name="patalpuAdresas"
          value={formData.patalpuAdresas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Adresas korespondencijai, telefono Nr., el. paštas</label>
        <input
          name="korespondencijosAdresas"
          value={formData.korespondencijosAdresas}
          onChange={handleChange}
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
        <label>
          Nekilnojamojo turto objekto adresas, bendras plotas, unikalus numeris
        </label>
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

      <hr />

      <p style={{ fontSize: "0.95rem" }}>
        Pasibaigus deklaruotam laikotarpiui įsipareigoju pateikti:
      </p>
      <ul style={{ fontSize: "0.95rem", paddingLeft: "20px" }}>
        <li>
          Pažymą iš vandens tiekėjo, kad sunaudota ne daugiau kaip 1 m³ per 3
          mėn.
        </li>
        <li>
          arba pažymą iš elektros tiekėjo, kad sunaudota ne daugiau kaip 45 kWh
          per 3 mėn.
        </li>
        <li>
          Jei sunaudota daugiau nei 45 kWh – pateikiama informacija apie
          autonominius įrenginius ir kita pagrindžianti informacija
        </li>
        <li>
          Dokumentą (-us), patvirtinantį (-čius), kad nekilnojamojo turto
          objekte nebuvo vykdoma ūkinė veikla
        </li>
      </ul>

      <p style={{ fontSize: "0.95rem", marginTop: "10px" }}>
        Leidžiu naudoti mano asmens duomenis ir juos įtraukti į Administratoriaus
        registrą. Suprantu, kad Administratorius turi teisę tikrinti
        pateiktus duomenis.
      </p>

      <p style={{ fontSize: "0.95rem" }}>
        Patvirtinu, kad nurodytoms aplinkybėms pasikeitus, per 30 kalendorinių
        dienų informuosiu raštu.
      </p>

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

export default WasteFeeExemptionBusinessForm;
