import React from "react";
import ApplicationStatusManager from "../ApplicationStatusManager";

interface PropertyUsageDeclarationEntry {
  address: string;
  buildingUniqueNumber: string;
  registeredPurpose: string;
  actualPurpose: string;
  registeredArea: number;
  actualArea: number;
}

interface PropertyUsageDeclarationData {
  correspondenceAddress?: string;
  phoneNumber?: string;
  emailAddress?: string;
  propertyAddress: string;
  propertyOwnerFullName: string;
  applicantFullName: string;
  entries: PropertyUsageDeclarationEntry[];
  statusId: number;
  id: number;
  formType: string;
}

const PropertyUsageDeclarationForm: React.FC<{ data: PropertyUsageDeclarationData }> = ({ data }) => {
  return (
    <div>
      <div className="container mt-4 p-4 rounded bg-light">
        <h2 className="text-center mb-4">
          Prašymo detalės – Nekilnojamojo turto faktinio naudojimo deklaravimas
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
          <legend className="w-auto px-2">Deklaruojami objektai</legend>
          {data.entries && data.entries.length > 0 ? (
            data.entries.map((entry, index) => (
              <div key={index} className="border p-3 mb-3">
                <h6>Objektas #{index + 1}</h6>
                <p><strong>Adresas:</strong> {entry.address}</p>
                <p><strong>Unikalus numeris:</strong> {entry.buildingUniqueNumber}</p>
                <p><strong>Paskirtis (registrų):</strong> {entry.registeredPurpose}</p>
                <p><strong>Paskirtis (faktinė):</strong> {entry.actualPurpose}</p>
                <p><strong>Plotas (registrų, m²):</strong> {entry.registeredArea}</p>
                <p><strong>Plotas (faktinis, m²):</strong> {entry.actualArea}</p>
              </div>
            ))
          ) : (
            <p>Objektai nenurodyti.</p>
          )}
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

export default PropertyUsageDeclarationForm;
