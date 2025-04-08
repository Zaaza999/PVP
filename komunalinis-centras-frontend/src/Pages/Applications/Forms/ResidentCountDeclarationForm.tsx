import React, { useState } from "react";
import "../../styles.css";

const ResidentCountDeclarationForm: React.FC = () => {
  type Gyventojas = {
    vardas: string;
    asmensDuomenys: string;
    papildomaInfo: string;
  };

  const [formData, setFormData] = useState({
    patalpuAdresas: "",
    korespondencijosAdresas: "",
    data: "",
    turtoAdresas: "",
    bendrasPlotas: "",
    gyventojai: [{ vardas: "", asmensDuomenys: "", papildomaInfo: "" }],
    vardasPavarde: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (typeof index === "number") {
      setFormData((prev) => {
        const updatedGyventojai = [...prev.gyventojai];
        if (
          name === "vardas" ||
          name === "asmensDuomenys" ||
          name === "papildomaInfo"
        ) {
          updatedGyventojai[index][name as keyof Gyventojas] = value;
        }
        return { ...prev, gyventojai: updatedGyventojai };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addGyventojas = () => {
    setFormData((prev) => ({
      ...prev,
      gyventojai: [
        ...prev.gyventojai,
        { vardas: "", asmensDuomenys: "", papildomaInfo: "" },
      ],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="weekly-schedule-container">
      <h2 style={{ textAlign: "center" }}>
        Asmenų skaičiaus gyvenamajame būste / individualiame name deklaracija
      </h2>

      <p>
        Užpildykite šią formą, jei deklaruojate faktiškai gyvenančių asmenų
        skaičių objekte ir norite pateikti tai patvirtinančią informaciją.
      </p>

      <div className="form-group">
        <label>Patalpų adresas, savininko vardas, pavardė</label>
        <input
          name="patalpuAdresas"
          value={formData.patalpuAdresas}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <div className="form-group">
        <label>Adresas korespondencijai, tel. Nr., el. paštas</label>
        <input
          name="korespondencijosAdresas"
          value={formData.korespondencijosAdresas}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <div className="form-group">
        <label>Data</label>
        <input
          name="data"
          type="date"
          value={formData.data}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <div className="form">
        <div className="form-group">
          <label>Nekilnojamojo turto adresas</label>
          <input
            name="turtoAdresas"
            placeholder="Adresas"
            value={formData.turtoAdresas}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <label>Bendras plotas (m²)</label>
          <input
            name="bendrasPlotas"
            placeholder="Plotas"
            value={formData.bendrasPlotas}
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>

      <hr />

      <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
        Asmenys, faktiškai gyvenantys objekte:
      </p>

      {formData.gyventojai.map((gyv, index) => (
        <div
          key={index}
          className="form"
          style={{ gap: "10px", marginBottom: "10px" }}
        >
          <div className="form-group" style={{ flex: 1 }}>
            <input
              name="vardas"
              placeholder="Vardas, pavardė"
              value={gyv.vardas}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <input
              name="asmensDuomenys"
              placeholder="Asmens duomenys"
              value={gyv.asmensDuomenys}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <input
              name="papildomaInfo"
              placeholder="Papildoma informacija"
              value={gyv.papildomaInfo}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        </div>
      ))}

      <div className="form-group" style={{ marginTop: "10px" }}>
        <button type="button" onClick={addGyventojas} className="btn">
          Pridėti asmenį
        </button>
      </div>

      <hr />

      <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Pridedama:</p>
      <ul style={{ fontSize: "0.95rem", paddingLeft: "20px" }}>
        <li>Pažyma iš seniūnijos apie deklaruotus, bet negyvenančius asmenis</li>
        <li>
          Pažyma apie faktiškai gyvenančius asmenis iš bendrijos ar
          administratoriaus
        </li>
        <li>Mokymo įstaigos pažyma apie studijas kitoje savivaldybėje</li>
        <li>Darbovietės pažyma apie darbą kitoje savivaldybėje</li>
        <li>Kita atitinkama pažyma</li>
      </ul>

      <p style={{ fontSize: "0.95rem" }}>
        Leidžiu naudoti savo asmens duomenis ir įtraukti juos į registrą.
        Suprantu, kad Administratorius gali tikrinti deklaracijos duomenų
        teisingumą.
      </p>

      <p style={{ fontSize: "0.95rem" }}>
        Patvirtinu, kad duomenims pasikeitus, apie tai informuosiu per 30
        kalendorinių dienų raštu.
      </p>

      <div className="form-group">
        <label>Atliekų turėtojo vardas, pavardė (parašas)</label>
        <input
          name="vardasPavarde"
          placeholder="Vardas Pavardė"
          value={formData.vardasPavarde}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <button type="submit" className="btn" style={{ marginTop: "20px" }}>
        Pateikti deklaraciją
      </button>
    </form>
  );
};

export default ResidentCountDeclarationForm;
