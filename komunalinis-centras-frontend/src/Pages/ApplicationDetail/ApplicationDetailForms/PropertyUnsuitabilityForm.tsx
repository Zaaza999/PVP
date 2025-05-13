import React from "react";
import ApplicationStatusManager from "../ApplicationStatusManager";

interface PropertyUnsuitabilityData {
  correspondenceAddress?: string;
  phoneNumber?: string;
  emailAddress?: string;
  propertyAddress: string;
  propertyOwnerFullName: string;
  area: number;
  buildingUniqueNumber: string;
  applicantFullName: string;
  approved: boolean;
  id: number;
  formType: string;
}

const PropertyUnsuitabilityForm: React.FC<{ data: PropertyUnsuitabilityData }> = ({ data }) => {
  return (
    <div>
      <div className="container mt-4 p-4 rounded bg-light">
        <h2 className="text-center mb-4">
          Prašymo detalės – Pripažinti nekilnojamąjį turtą netinkamu naudoti
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
          <p><strong>Plotas (m²):</strong> {data.area}</p>
          <p><strong>Pastato unikalus numeris:</strong> {data.buildingUniqueNumber}</p>
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

export default PropertyUnsuitabilityForm;
