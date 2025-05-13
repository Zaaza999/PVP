import React from "react";
import ApplicationStatusManager from "../ApplicationStatusManager";

interface PayerDataChangeRequestData {
  propertyOwnerFullName: string;
  companyCode?: string;
  correspondenceAddress?: string;
  phoneNumber?: string;
  emailAddress?: string;

  tenantFullName: string;
  tenantCompanyCode: string;
  propertyAddress: string;
  buildingUniqueNumber: string;
  registeredArea: number;
  registeredPurpose: string;
  leaseStartDateOrUsageStartDate: string;

  paymentNoticeMailingAddress: string;
  paymentNoticeEmail: string;
  representativePosition: string;

  statusId: number;
  id: number;
  formType: string;
}

const PayerDataChangeRequestForm: React.FC<{ data: PayerDataChangeRequestData }> = ({ data }) => {
  return (
    <div>
      <div className="container mt-4 p-4 rounded bg-light">
        <h2 className="text-center mb-4">
          Prašymo detalės – Mokėtojo duomenų pakeitimas
        </h2>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Esami duomenys</legend>
          <p><strong>Turto savininko vardas, pavardė:</strong> {data.propertyOwnerFullName}</p>
          <p><strong>Įmonės kodas:</strong> {data.companyCode || "-"}</p>
          <p><strong>Adresas korespondencijai:</strong> {data.correspondenceAddress || "-"}</p>
          <p><strong>Telefono numeris:</strong> {data.phoneNumber || "-"}</p>
          <p><strong>El. paštas:</strong> {data.emailAddress || "-"}</p>
        </fieldset>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Nauji mokėtojo duomenys</legend>
          <p><strong>Nuomininko vardas, pavardė:</strong> {data.tenantFullName}</p>
          <p><strong>Nuomininko įmonės kodas:</strong> {data.tenantCompanyCode}</p>
          <p><strong>Turto adresas:</strong> {data.propertyAddress}</p>
          <p><strong>Pastato unikalus numeris:</strong> {data.buildingUniqueNumber}</p>
          <p><strong>Registruotas plotas (m²):</strong> {data.registeredArea}</p>
          <p><strong>Registruota paskirtis:</strong> {data.registeredPurpose}</p>
          <p><strong>Naudojimo pradžios data:</strong> {data.leaseStartDateOrUsageStartDate?.slice(0, 10)}</p>
        </fieldset>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Mokėjimo pranešimų informacija</legend>
          <p><strong>Siuntimo adresas:</strong> {data.paymentNoticeMailingAddress}</p>
          <p><strong>El. pašto adresas:</strong> {data.paymentNoticeEmail}</p>
          <p><strong>Atstovo pareigos:</strong> {data.representativePosition}</p>
        </fieldset>
      </div>

      <ApplicationStatusManager
        statusId={data.statusId}
        formType={data.formType}
        formId={data.id}
      />
    </div>
  );
};

export default PayerDataChangeRequestForm;
