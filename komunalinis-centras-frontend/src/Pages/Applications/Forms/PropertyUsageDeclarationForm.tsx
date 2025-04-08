import React, { useState } from "react";
import "../../styles.css";

const PropertyUsageDeclarationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    patalpuAdresas: "",
    korespondencijosAdresas: "",
    data: "",
    entries: [
      {
        adresas: "",
        unikalusNr: "",
        paskirtisRegistras: "",
        paskirtisFaktine: "",
        plotasRegistras: "",
        plotasFaktine: "",
      },
    ],
    vardasPavarde: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (typeof index === "number") {
      const newEntries = [...formData.entries];
      newEntries[index] = { ...newEntries[index], [name]: value };
      setFormData({ ...formData, entries: newEntries });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addEntry = () => {
    setFormData((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        {
          adresas: "",
          unikalusNr: "",
          paskirtisRegistras: "",
          paskirtisFaktine: "",
          plotasRegistras: "",
          plotasFaktine: "",
        },
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
        Nekilnojamojo turto ploto / paskirties tikslinimo deklaracija
      </h2>

      <p>
        Užpildykite šią deklaraciją, jei turto faktinė paskirtis ar plotas
        skiriasi nuo Nekilnojamojo turto registro duomenų.
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

      <hr />

      <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
        Nekilnojamojo turto objektų sąrašas:
      </p>

      {formData.entries.map((entry, index) => (
        <div key={index} className="form" style={{ gap: "10px" }}>
          <div className="form-group">
            <input
              name="adresas"
              placeholder="Pastato adresas"
              value={entry.adresas}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div className="form-group">
            <input
              name="unikalusNr"
              placeholder="Unikalus Nr."
              value={entry.unikalusNr}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div className="form-group">
            <input
              name="paskirtisRegistras"
              placeholder="Paskirtis registruota"
              value={entry.paskirtisRegistras}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div className="form-group">
            <input
              name="plotasRegistras"
              placeholder="Plotas registruotas (m²)"
              value={entry.plotasRegistras}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div className="form-group">
            <input
              name="paskirtisFaktine"
              placeholder="Paskirtis faktinė"
              value={entry.paskirtisFaktine}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div className="form-group">
            <input
              name="plotasFaktine"
              placeholder="Plotas faktinis (m²)"
              value={entry.plotasFaktine}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        </div>
      ))}

      <div className="form-group" style={{ marginTop: "10px" }}>
        <button type="button" onClick={addEntry} className="btn">
          Pridėti dar vieną objektą
        </button>
      </div>

      <hr />

      <p style={{ fontSize: "0.95rem" }}>
        Sutinku, kad būtų vykdoma objekto patikra. Įsipareigoju apie bet kokius
        duomenų pasikeitimus informuoti raštu per 30 kalendorinių dienų.
      </p>

      <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Pridedama:</p>
      <ul style={{ fontSize: "0.95rem", paddingLeft: "20px" }}>
        <li>Patalpų eksplikacija</li>
        <li>Nekilnojamojo turto registro išrašas</li>
      </ul>

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

export default PropertyUsageDeclarationForm;
