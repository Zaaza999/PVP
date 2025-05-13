import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";

const WasteFeeExemptionBusinessForm: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useFormSubmit("WasteFeeExemptionBusiness");

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">
        Prašymas – Atleisti nuo kintamosios vietinės rinkliavos dedamosios mokėjimo (juridiniams asmenims)
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
              placeholder="Pvz.: +37061234567"
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
              placeholder="Pvz.: jonas@pastas.lt"
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
              placeholder="Pvz.: Laisvės al. 10, Kaunas"
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
              placeholder="Pvz.: Jonas Jonaitis"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Plotas (m²)</label>
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
          <div className="col-md-8">
            <label className="form-label">Pastato unikalus numeris</label>
            <input
              type="text"
              name="buildingUniqueNumber"
              className="form-control"
              value={formData.buildingUniqueNumber || ""}
              onChange={handleChange}
              required
              placeholder="Pvz.: 1234-5678-9012"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Laikotarpis</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Laikotarpio pradžia</label>
            <input
              type="date"
              name="periodFrom"
              className="form-control"
              value={formData.periodFrom || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Laikotarpio pabaiga</label>
            <input
              type="date"
              name="periodTo"
              className="form-control"
              value={formData.periodTo || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
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
        <button
          type="submit"
          className="btn btn-primary"
        >
          Pateikti prašymą
        </button>
      </div>
    </form>
  );
};

export default WasteFeeExemptionBusinessForm;
