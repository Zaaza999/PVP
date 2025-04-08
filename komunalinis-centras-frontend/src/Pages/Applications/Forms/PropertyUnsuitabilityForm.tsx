import React, { useState } from "react";
import "../../styles.css";

const PropertyUnsuitabilityForm: React.FC = () => {
  const [formData, setFormData] = useState({
    patalpuAdresas: "",
    korespondencijosAdresas: "",
    data: "",
    turtoAdresas: "",
    bendrasPlotas: "",
    unikalusNr: "",
    dokumentai: {
      gaisras: false,
      avarija: false,
      patikrinimoAktas: false,
      teismoSprendimas: false,
      kita: false,
    },
    vardasPavarde: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      dokumentai: { ...prev.dokumentai, [name]: checked },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="weekly-schedule-container">
      <h2 style={{ textAlign: "center" }}>
        Prašymas – Dėl nekilnojamojo turto objekto įtraukimo į netinkamų naudoti
        ar nenaudojamų objektų kategoriją
      </h2>

      <p>
        Užpildykite šią formą, jei norite, kad nekilnojamojo turto objektas
        būtų priskirtas netinkamų naudoti / nenaudojamų kategorijai.
      </p>

      <div className="form-group">
        <label>Patalpų adresas, savininko vardas, pavardė</label>
        <input
          name="patalpuAdresas"
          value={formData.patalpuAdresas}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Adresas korespondencijai, tel. Nr., el. paštas</label>
        <input
          name="korespondencijosAdresas"
          value={formData.korespondencijosAdresas}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Data</label>
        <input
          name="data"
          type="date"
          value={formData.data}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Nekilnojamojo turto objekto adresas, plotas, unikalus Nr.</label>
        <input
          name="turtoAdresas"
          placeholder="Adresas"
          value={formData.turtoAdresas}
          onChange={handleInputChange}
        />
        <input
          name="bendrasPlotas"
          placeholder="Plotas m²"
          value={formData.bendrasPlotas}
          onChange={handleInputChange}
        />
        <input
          name="unikalusNr"
          placeholder="Unikalus numeris"
          value={formData.unikalusNr}
          onChange={handleInputChange}
        />
      </div>

      <hr />

      <p style={{ fontSize: "0.95rem" }}>
        Patvirtinu, kad objektas yra netinkamas naudoti pagal paskirtį, jokia
        veikla nevykdoma, negali būti vykdoma ir nebus vykdoma.
      </p>
      <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Pridedami dokumentai:</p>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="gaisras"
            checked={formData.dokumentai.gaisras}
            onChange={handleCheckboxChange}
          />
          Priešgaisrinės apsaugos pažyma (sudegęs objektas)
        </label>

        <label>
          <input
            type="checkbox"
            name="avarija"
            checked={formData.dokumentai.avarija}
            onChange={handleCheckboxChange}
          />
          Statinio avarijos dokumentai
        </label>

        <label>
          <input
            type="checkbox"
            name="patikrinimoAktas"
            checked={formData.dokumentai.patikrinimoAktas}
            onChange={handleCheckboxChange}
          />
          Techninės priežiūros patikrinimo aktas
        </label>

        <label>
          <input
            type="checkbox"
            name="teismoSprendimas"
            checked={formData.dokumentai.teismoSprendimas}
            onChange={handleCheckboxChange}
          />
          Teismo sprendimas dėl nuosavybės apribojimo
        </label>

        <label>
          <input
            type="checkbox"
            name="kita"
            checked={formData.dokumentai.kita}
            onChange={handleCheckboxChange}
          />
          Kita informacija
        </label>
      </div>

      <hr />

      <p style={{ fontSize: "0.95rem" }}>
        Leidžiu naudotis savo asmens duomenimis ir juos įtraukti į
        Administratoriaus registrą. Esu informuotas, kad Administratorius turi
        teisę patikrinti pateiktus duomenis.
      </p>
      <p style={{ fontSize: "0.95rem" }}>
        Patvirtinu, kad nurodytoms aplinkybėms pasikeitus, nedelsiant, bet ne
        vėliau kaip per 30 kalendorinių dienų, raštu informuosiu apie
        pasikeitimus.
      </p>

      <div className="form-group">
        <label>Atliekų turėtojo vardas, pavardė (parašas)</label>
        <input
          name="vardasPavarde"
          placeholder="Vardas Pavardė"
          value={formData.vardasPavarde}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit" className="btn" style={{ marginTop: "20px" }}>
        Pateikti prašymą
      </button>
    </form>
  );
};

export default PropertyUnsuitabilityForm;
