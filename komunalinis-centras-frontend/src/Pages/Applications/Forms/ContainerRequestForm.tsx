import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";

const ContainerRequestForm: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useFormSubmit("ContainerRequest");

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">Prašymas – Konteinerio suteikimas</h2>

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
        <legend className="w-auto px-2">Paslaugos informacija</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Sąskaitų gavimo el. paštas</label>
            <input
              type="email"
              name="emailForInvoices"
              className="form-control"
              value={formData.emailForInvoices || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Konteinerio talpa (litrais)</label>
            <select
              name="containerVolumeLiters"
              className="form-select"
              value={formData.containerVolumeLiters || ""}
              onChange={handleChange}
              required
            >
              <option value="">Pasirinkite</option>
              <option value={120}>120</option>
              <option value={140}>140</option>
              <option value={240}>240</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Išvežimo dažnumas per metus</label>
            <select
              name="emptyingFrequencyPerYear"
              className="form-select"
              value={formData.emptyingFrequencyPerYear || ""}
              onChange={handleChange}
              required
            >
              <option value="">Pasirinkite</option>
              <option value={12}>12</option>
              <option value={26}>26</option>
              <option value={52}>52</option>
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

export default ContainerRequestForm;