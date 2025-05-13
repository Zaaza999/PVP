import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";

const ContainerFrequencyChangeForm: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useFormSubmit("ContainerFrequencyChange");

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">Prašymas – Pakeisti konteinerio ištuštinimo dažnumą</h2>

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
        <legend className="w-auto px-2">Paslaugos keitimas</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Nuo kada įsigalioja</label>
            <input
              type="date"
              name="effectiveFrom"
              className="form-control"
              value={formData.effectiveFrom || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Išvežimo dažnumas per mėnesį</label>
            <select
              name="frequencyPerMonth"
              className="form-select"
              value={formData.frequencyPerMonth || ""}
              onChange={handleChange}
              required
            >
              <option value="">Pasirinkite</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Pareiškėjas</legend>
        <div className="mb-3">
          <label className="form-label">Pareiškėjo vardas, pavardė</label>
          <input
            type="text"
            name="applicantFullName"
            className="form-control"
            value={formData.applicantFullName || ""}
            onChange={handleChange}
            required
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

export default ContainerFrequencyChangeForm;