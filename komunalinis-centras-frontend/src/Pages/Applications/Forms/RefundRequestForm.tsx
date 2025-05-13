import React from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";

const RefundRequestForm: React.FC = () => {
  const { formData, handleChange, handleSubmit } = useFormSubmit("RefundRequest");

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">
        Prašymas grąžinti sumokėtą vietinę rinkliavą
      </h2>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Pareiškėjas</legend>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Vardas, pavardė</label>
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
          <div className="col-md-6">
            <label className="form-label">Adresas korespondencijai</label>
            <input
              type="text"
              name="correspondenceAddress"
              className="form-control"
              value={formData.correspondenceAddress || ""}
              onChange={handleChange}
              required
              placeholder="Pvz.: El. paštas arba adresas"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mb-4">
        <legend className="w-auto px-2">Mokėjimo informacija</legend>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Mokėtojo kodas</label>
            <input
              type="text"
              name="payerCode"
              className="form-control"
              value={formData.payerCode || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Mokėjimo data</label>
            <input
              type="date"
              name="paymentDate"
              className="form-control"
              value={formData.paymentDate || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Mokėta suma (€)</label>
            <input
              type="number"
              name="paymentAmount"
              step="0.01"
              className="form-control"
              value={formData.paymentAmount || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Operacijos numeris</label>
            <input
              type="text"
              name="transactionNumber"
              className="form-control"
              value={formData.transactionNumber || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">Grąžinimo sąskaita</label>
            <input
              type="text"
              name="refundAccountNumber"
              className="form-control"
              value={formData.refundAccountNumber || ""}
              onChange={handleChange}
              required
              placeholder="Pvz.: LTXX123456789012345"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Mokėjimo priežastis</label>
          <textarea
            name="paymentReason"
            className="form-control"
            value={formData.paymentReason || ""}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Nurodykite mokėjimo priežastį..."
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

export default RefundRequestForm;