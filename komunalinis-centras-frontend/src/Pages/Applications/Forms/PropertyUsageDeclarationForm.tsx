import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";


interface PropertyUsageDeclarationEntry {
  address: string;
  buildingUniqueNumber: string;
  registeredPurpose: string;
  actualPurpose: string;
  registeredArea: number | string;
  actualArea: number | string;
}

const emptyEntry: PropertyUsageDeclarationEntry = {
  address: "",
  buildingUniqueNumber: "",
  registeredPurpose: "",
  actualPurpose: "",
  registeredArea: "",
  actualArea: "",
};


const PropertyUsageDeclarationForm: React.FC = () => {
  const { formData, setFormData, handleChange, handleSubmit } = useFormSubmit("PropertyUsageDeclaration");

  const handleEntryChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedEntries = [...(formData.entries || [])];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [e.target.name]: e.target.value,
    };
    setFormData({ ...formData, entries: updatedEntries });
  };

  const addEntry = () => {
    const updatedEntries = [...(formData.entries || []), { ...emptyEntry }];
    setFormData({ ...formData, entries: updatedEntries });
  };

  const removeEntry = (index: number) => {
    const updatedEntries = [...(formData.entries || [])];
    updatedEntries.splice(index, 1);
    setFormData({ ...formData, entries: updatedEntries });
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">
        Prašymas – Nekilnojamojo turto faktinio naudojimo deklaravimas
      </h2>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Kontaktinė informacija</legend>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Adresas korespondencijai</label>
            <input
              type="text"
              name="correspondenceAddress"
              className="form-control"
              value={formData.correspondenceAddress || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Telefono numeris</label>
            <input
              type="text"
              name="phoneNumber"
              className="form-control"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">El. pašto adresas</label>
            <input
              type="email"
              name="emailAddress"
              className="form-control"
              value={formData.emailAddress || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Turto informacija</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Turto adresas</label>
            <input
              type="text"
              name="propertyAddress"
              className="form-control"
              value={formData.propertyAddress || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Savininko vardas, pavardė</label>
            <input
              type="text"
              name="propertyOwnerFullName"
              className="form-control"
              value={formData.propertyOwnerFullName || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Deklaruojami objektai</legend>
        {(formData.entries || []).map((entry: PropertyUsageDeclarationEntry, index: number) => (
          <div key={index} className="border p-3 mb-3">
            <h6>Objektas #{index + 1}</h6>
            <div className="row mb-2">
              <div className="col-md-6">
                <label className="form-label">Adresas</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={entry.address || ""}
                  onChange={(e) => handleEntryChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Unikalus numeris</label>
                <input
                  type="text"
                  name="buildingUniqueNumber"
                  className="form-control"
                  value={entry.buildingUniqueNumber || ""}
                  onChange={(e) => handleEntryChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <label className="form-label">Paskirtis (registrų)</label>
                <input
                  type="text"
                  name="registeredPurpose"
                  className="form-control"
                  value={entry.registeredPurpose || ""}
                  onChange={(e) => handleEntryChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Paskirtis (faktinė)</label>
                <input
                  type="text"
                  name="actualPurpose"
                  className="form-control"
                  value={entry.actualPurpose || ""}
                  onChange={(e) => handleEntryChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <label className="form-label">Plotas (registrų, m²)</label>
                <input
                  type="number"
                  name="registeredArea"
                  step="0.01"
                  className="form-control"
                  value={entry.registeredArea || ""}
                  onChange={(e) => handleEntryChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Plotas (faktinis, m²)</label>
                <input
                  type="number"
                  name="actualArea"
                  step="0.01"
                  className="form-control"
                  value={entry.actualArea || ""}
                  onChange={(e) => handleEntryChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="text-end">
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeEntry(index)}>
                Pašalinti
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={addEntry}>
          Pridėti objektą
        </button>
      </fieldset>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Pareiškėjas</legend>
        <div className="mb-4">
          <label className="form-label">Pareiškėjo vardas, pavardė</label>
          <input
            type="text"
            name="applicantFullName"
            className="form-control"
            value={formData.applicantFullName || ""}
            onChange={handleChange}
            required
            placeholder="Pvz.: Vardas Pavardė"
          />
        </div>
      </fieldset>

      <div className="text-end">
        <button type="submit" className="btn btn-primary">
          Pateikti prašymą
        </button>
      </div>
    </form>
  );
};

export default PropertyUsageDeclarationForm;
