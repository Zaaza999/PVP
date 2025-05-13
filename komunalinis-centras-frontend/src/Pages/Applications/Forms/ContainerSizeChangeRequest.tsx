import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";

const ContainerSizeChangeRequestForm: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useFormSubmit("ContainerSizeChangeRequest");

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">Prašymas – Pakeisti konteinerio dydį</h2>

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
        <legend className="w-auto px-2">Konteinerio talpos keitimas</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Dabartinė talpa (litrais)</label>
            <input
              type="number"
              name="currentCapacityLiters"
              className="form-control"
              value={formData.currentCapacityLiters || ""}
              onChange={handleChange}
              required
              min={0}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nauja talpa (litrais)</label>
            <input
              type="number"
              name="newCapacityLiters"
              className="form-control"
              value={formData.newCapacityLiters || ""}
              onChange={handleChange}
              required
              min={0}
            />
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

export default ContainerSizeChangeRequestForm;
