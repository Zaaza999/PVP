import React, { useState } from "react";
import "../../styles.css";

const WasteFeeExemptionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    patalpuAdresas: "",
    savininkoVardas: "",
    korespondencijosAdresas: "",
    telefonas: "",
    elPastas: "",
    data: "",
    turtoAdresas: "",
    bendrasPlotas: "",
    unikalusNr: "",
    laikotarpisNuo: "",
    laikotarpisIki: "",
    vandensTiekimas: "",
    elektrosSkaitiklis: "",
    vandensParodymai: "",
    elektrosParodymai: "",
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
        mokėjimo
      </h2>

      <p>
        Užpildykite šią formą, jeigu pageidaujate būti atleisti nuo kintamosios
        vietinės rinkliavos dalies mokėjimo laikotarpiu, kai nekilnojamojo
        turto objekte nėra gyvenama.
      </p>

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
        <label>
          Nekilnojamojo turto objekto adresas, plotas, unikalus numeris
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

      <p>
        Informacija apie vandens ir elektros sunaudojimą nekilnojamojo turto
        objekte:
      </p>

      <div className="form-group">
        <label>Vandens tiekimo būsena:</label>
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
        <label>Elektros skaitiklio būsena:</label>
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
        <label>Vandens parodymai laikotarpio pradžioje (jei yra):</label>
        <input
          name="vandensParodymai"
          placeholder="m³"
          value={formData.vandensParodymai}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>
          Elektros parodymai laikotarpio pradžioje (jei yra):{" "}
        </label>
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

      <hr style={{ margin: "20px 0" }} />

      <p style={{ fontSize: "0.95rem" }}>
        Patvirtinu, kad prašyme pateikti duomenys yra teisingi. Jei duomenys
        pasikeistų – informuosiu raštu per 30 kalendorinių dienų. Leidžiu
        tvarkyti mano asmens duomenis ir įtraukti juos į Administratoriaus
        tvarkomą registrą.
      </p>

      <p style={{ fontSize: "0.95rem", marginTop: "10px" }}>
        Jeigu laikotarpiu sunaudojama daugiau nei 1 m³ vandens arba 45 kWh
        elektros per 3 mėn., įsipareigoju pateikti papildomą paaiškinimą su
        įrodymais.
      </p>

      <button type="submit" className="btn" style={{ marginTop: "20px" }}>
        Pateikti prašymą
      </button>
    </form>
  );
};

export default WasteFeeExemptionForm;
