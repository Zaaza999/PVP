import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";

interface Resident {
  fullName: string;
  personalData: string;
  additionalInfo?: string;
}

const emptyResident: Resident = {
  fullName: "",
  personalData: "",
  additionalInfo: "",
};

const ResidentCountDeclarationForm: React.FC = () => {
  const { formData, setFormData, handleChange, handleSubmit } = useFormSubmit("ResidentCountDeclaration");

  const handleResidentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...(formData.residents || [])];
    updated[index] = {
      ...updated[index],
      [e.target.name]: e.target.value,
    };
    setFormData({ ...formData, residents: updated });
  };

  const addResident = () => {
    const updated = [...(formData.residents || []), { ...emptyResident }];
    setFormData({ ...formData, residents: updated });
  };

  const removeResident = (index: number) => {
    const updated = [...(formData.residents || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, residents: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">
        Prašymas – Gyventojų skaičiaus deklaravimas
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
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Bendras plotas (m²)</label>
            <input
              type="number"
              name="area"
              step="0.01"
              className="form-control"
              value={formData.area || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Deklaruojami gyventojai</legend>
        {(formData.residents || []).map((resident: Resident, index: number) => (
          <div key={index} className="border p-3 mb-3">
            <h6>Gyventojas #{index + 1}</h6>
            <div className="row mb-2">
              <div className="col-md-6">
                <label className="form-label">Vardas, pavardė</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={resident.fullName || ""}
                  onChange={(e) => handleResidentChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Asmens duomenys</label>
                <input
                  type="text"
                  name="personalData"
                  className="form-control"
                  value={resident.personalData || ""}
                  onChange={(e) => handleResidentChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Papildoma informacija</label>
              <input
                type="text"
                name="additionalInfo"
                className="form-control"
                value={resident.additionalInfo || ""}
                onChange={(e) => handleResidentChange(index, e)}
              />
            </div>
            <div className="text-end">
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeResident(index)}>
                Pašalinti
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={addResident}>
          Pridėti gyventoją
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

export default ResidentCountDeclarationForm;
