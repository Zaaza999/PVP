import React from "react";
import ApplicationStatusManager from "../ApplicationStatusManager";

interface RefundRequestData {
  applicantFullName: string;
  correspondenceAddress: string;
  payerCode: string;
  paymentDate: string;
  paymentAmount: number;
  transactionNumber: string;
  refundAccountNumber: string;
  paymentReason: string;
  id: number;
  formType: string;
  approved: boolean;
}

const RefundRequestForm: React.FC<{ data: RefundRequestData }> = ({ data }) => {
  return (
    <div>
      <div className="container mt-4 p-4 rounded bg-light">
        <h2 className="text-center mb-4">
          Prašymo detalės – Grąžinti sumokėtą vietinę rinkliavą
        </h2>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Pareiškėjas</legend>
          <p><strong>Vardas, pavardė:</strong> {data.applicantFullName}</p>
          <p><strong>Adresas korespondencijai:</strong> {data.correspondenceAddress}</p>
        </fieldset>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Mokėjimo informacija</legend>
          <p><strong>Mokėtojo kodas:</strong> {data.payerCode}</p>
          <p><strong>Mokėjimo data:</strong> {data.paymentDate.slice(0, 10)}</p>
          <p><strong>Mokėta suma (€):</strong> {data.paymentAmount.toFixed(2)}</p>
          <p><strong>Operacijos numeris:</strong> {data.transactionNumber}</p>
          <p><strong>Grąžinimo sąskaita:</strong> {data.refundAccountNumber}</p>
          <p><strong>Mokėjimo priežastis:</strong> {data.paymentReason}</p>
        </fieldset>
      </div>

      <ApplicationStatusManager
        approved={data.approved}
        formType={data.formType}
        formId={data.id}
      />
    </div>
  );
};

export default RefundRequestForm;
