import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";

const PayerDataChangeRequestForm: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useFormSubmit("PayerDataChangeRequest");

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">
        Prašymas pakeisti vietinės rinkliavos mokėtojo duomenis
      </h2>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Esami duomenys</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Turto savininko vardas, pavardė</label>
            <input
              type="text"
              name="propertyOwnerFullName"
              className="form-control"
              value={formData.propertyOwnerFullName || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Įmonės kodas (jei taikoma)</label>
            <input
              type="text"
              name="companyCode"
              className="form-control"
              value={formData.companyCode || ""}
              onChange={handleChange}
            />
          </div>
        </div>

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
            <label className="form-label">El. paštas</label>
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
        <legend className="w-auto px-2">Nauji mokėtojo duomenys</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Nuomininko vardas, pavardė</label>
            <input
              type="text"
              name="tenantFullName"
              className="form-control"
              value={formData.tenantFullName || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nuomininko įmonės kodas</label>
            <input
              type="text"
              name="tenantCompanyCode"
              className="form-control"
              value={formData.tenantCompanyCode || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-8">
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
          <div className="col-md-4">
            <label className="form-label">Pastato unikalus numeris</label>
            <input
              type="text"
              name="buildingUniqueNumber"
              className="form-control"
              value={formData.buildingUniqueNumber || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Registruotas plotas (m²)</label>
            <input
              type="number"
              name="registeredArea"
              step="0.01"
              className="form-control"
              value={formData.registeredArea || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Registruota paskirtis</label>
            <input
              type="text"
              name="registeredPurpose"
              className="form-control"
              value={formData.registeredPurpose || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12">
            <label className="form-label">Sutarties arba naudojimo pradžios data</label>
            <input
              type="date"
              name="leaseStartDateOrUsageStartDate"
              className="form-control"
              value={formData.leaseStartDateOrUsageStartDate || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Mokėjimo pranešimų informacija</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Pranešimų siuntimo adresas</label>
            <input
              type="text"
              name="paymentNoticeMailingAddress"
              className="form-control"
              value={formData.paymentNoticeMailingAddress || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Pranešimų el. pašto adresas</label>
            <input
              type="email"
              name="paymentNoticeEmail"
              className="form-control"
              value={formData.paymentNoticeEmail || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Atstovo pareigos</label>
          <input
            type="text"
            name="representativePosition"
            className="form-control"
            value={formData.representativePosition || ""}
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

export default PayerDataChangeRequestForm;
