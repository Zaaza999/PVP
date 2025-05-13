import React from "react";
import ApplicationStatusManager from "../ApplicationStatusManager";

interface ContainerFrequencyChangeData {
  correspondenceAddress?: string;
  phoneNumber?: string;
  emailAddress?: string;
  propertyAddress: string;
  propertyOwnerFullName: string;
  effectiveFrom: string;
  frequencyPerMonth: number;
  applicantFullName: string;
  approved: boolean;
  id: number;
  formType: string;
}

const ContainerFrequencyChangeForm: React.FC<{ data: ContainerFrequencyChangeData }> = ({ data }) => {
  return (
    <div>
      <div className="container mt-4 p-4 rounded bg-light">
        <h2 className="text-center mb-4">
          Prašymo detalės – Konteinerio ištuštinimo dažnumo keitimas
        </h2>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Kontaktinė informacija</legend>
          <p><strong>Adresas korespondencijai:</strong> {data.correspondenceAddress || "-"}</p>
          <p><strong>Telefono numeris:</strong> {data.phoneNumber || "-"}</p>
          <p><strong>El. pašto adresas:</strong> {data.emailAddress || "-"}</p>
        </fieldset>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Turto informacija</legend>
          <p><strong>Turto adresas:</strong> {data.propertyAddress}</p>
          <p><strong>Savininko vardas, pavardė:</strong> {data.propertyOwnerFullName}</p>
        </fieldset>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Paslaugos keitimas</legend>
          <p><strong>Įsigaliojimo data:</strong> {data.effectiveFrom?.slice(0, 10)}</p>
          <p><strong>Išvežimų dažnumas per mėnesį:</strong> {data.frequencyPerMonth} kartų</p>
        </fieldset>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Pareiškėjas</legend>
          <p><strong>Pareiškėjo vardas, pavardė:</strong> {data.applicantFullName}</p>
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

export default ContainerFrequencyChangeForm;
