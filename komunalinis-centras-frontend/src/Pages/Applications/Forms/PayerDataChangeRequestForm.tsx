import React, { useState } from "react";
import "../../styles.css";

const PayerDataChangeRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    juridinisAsmuo: "",
    adresas: "",
    imonesKodas: "",
    telefonas: "",
    elPastas: "",
    data: "",
    nuomininkas: "",
    nuomininkoKodas: "",
    turtoAdresas: "",
    unikalusNr: "",
    paskirtis: "",
    plotas: "",
    sutartiesData: "",
    pastuAdresas: "",
    elPastasSaskaitai: "",
    pareigos: "",
    pareiskejas: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        Prašymas pakeisti Vietinės rinkliavos mokėtojo duomenis
      </h2>

      <p>Skirta: UAB Komunalinių paslaugų centrui</p>

      <div className="form-group">
        <label>Juridinio asmens pavadinimas / vardas, pavardė</label>
        <input
          name="juridinisAsmuo"
          value={formData.juridinisAsmuo}
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

      <div className="form form-group" style={{ gap: "10px" }}>
        <input
          name="imonesKodas"
          placeholder="Įmonės kodas"
          value={formData.imonesKodas}
          onChange={handleChange}
        />
        <input
          name="telefonas"
          placeholder="Telefonas"
          value={formData.telefonas}
          onChange={handleChange}
        />
        <input
          name="elPastas"
          placeholder="El. paštas"
          value={formData.elPastas}
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

      <hr />

      <p style={{ fontWeight: 600 }}>Prašymo turinys:</p>

      <div className="form-group">
        <label>
          Mokėjimo pranešimą teikti nuomininko vardu (jei aktualu):
        </label>
        <input
          name="nuomininkas"
          placeholder="Nuomininko vardas"
          value={formData.nuomininkas}
          onChange={handleChange}
        />
        <input
          name="nuomininkoKodas"
          placeholder="Įmonės kodas"
          value={formData.nuomininkoKodas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Turto adresas, unikalus Nr., paskirtis, plotas</label>
        <input
          name="turtoAdresas"
          placeholder="Adresas"
          value={formData.turtoAdresas}
          onChange={handleChange}
        />
        <input
          name="unikalusNr"
          placeholder="Unikalus Nr."
          value={formData.unikalusNr}
          onChange={handleChange}
        />
        <input
          name="paskirtis"
          placeholder="Paskirtis"
          value={formData.paskirtis}
          onChange={handleChange}
        />
        <input
          name="plotas"
          placeholder="Plotas (m²)"
          value={formData.plotas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>
          Nuomos / panaudos sutarties sudarymo data arba naudojimo pradžia
        </label>
        <input
          name="sutartiesData"
          value={formData.sutartiesData}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Kur siųsti mokėjimo pranešimus (adresas)</label>
        <input
          name="pastuAdresas"
          value={formData.pastuAdresas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>
          El. pašto adresas mokėjimo pranešimams (jei pageidaujate el. paštu)
        </label>
        <input
          name="elPastasSaskaitai"
          type="email"
          value={formData.elPastasSaskaitai}
          onChange={handleChange}
        />
      </div>

      <hr />

      <p style={{ fontSize: "0.95rem" }}>
        Tvirtinu, kad prašyme nurodyti duomenys yra teisingi. Pridedami
        faktines aplinkybes pagrindžiantys dokumentai (pvz., panaudos / nuomos
        sutartis).
      </p>

      <div className="form form-group" style={{ gap: "10px" }}>
        <input
          name="pareigos"
          placeholder="Atstovo pareigos"
          value={formData.pareigos}
          onChange={handleChange}
        />
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

export default PayerDataChangeRequestForm;
