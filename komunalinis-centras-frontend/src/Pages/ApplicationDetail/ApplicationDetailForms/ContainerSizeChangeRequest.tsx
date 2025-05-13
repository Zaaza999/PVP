import React from "react";
import ApplicationStatusManager from "../ApplicationStatusManager";

interface ContainerSizeChangeRequestData {
  correspondenceAddress?: string;
  phoneNumber?: string;
  emailAddress?: string;
  propertyAddress: string;
  propertyOwnerFullName: string;
  currentCapacityLiters: number;
  newCapacityLiters: number;
  applicantFullName: string;
  statusId: number;
  id: number;
  formType: string;
}

const ContainerSizeChangeRequestForm: React.FC<{ data: ContainerSizeChangeRequestData }> = ({ data }) => {
  return (
    <div>
      <div className="container mt-4 p-4 rounded bg-light">
        <h2 className="text-center mb-4">Prašymo detalės – Konteinerio dydžio keitimas</h2>

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
          <legend className="w-auto px-2">Konteinerio talpos keitimas</legend>
          <p><strong>Dabartinė talpa:</strong> {data.currentCapacityLiters} l</p>
          <p><strong>Nauja talpa:</strong> {data.newCapacityLiters} l</p>
        </fieldset>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Pareiškėjas</legend>
          <p><strong>Pareiškėjo vardas, pavardė:</strong> {data.applicantFullName}</p>
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

export default ContainerSizeChangeRequestForm;
