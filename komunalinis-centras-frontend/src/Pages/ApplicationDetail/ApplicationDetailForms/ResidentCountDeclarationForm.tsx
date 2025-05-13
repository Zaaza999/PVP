import React from "react";
import ApplicationStatusManager from "../ApplicationStatusManager";

interface Resident {
  id: number;
  fullName: string;
  personalData: string;
  additionalInfo?: string;
  residentCountDeclarationId: number;
}

interface ResidentCountDeclarationData {
  propertyAddress: string;
  propertyOwnerFullName: string;
  correspondenceAddress?: string;
  phoneNumber?: string;
  emailAddress?: string;
  applicantFullName: string;
  area: number;
  residents: Resident[];
  id: number;
  formType: string;
  approved: boolean;
}

const ResidentCountDeclarationForm: React.FC<{ data: ResidentCountDeclarationData }> = ({ data }) => {
  return (
    <div>
      <div className="container mt-4 p-4 rounded bg-light">
        <h2 className="text-center mb-4">
          Prašymo detalės – Gyventojų skaičiaus deklaravimas
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
          <p><strong>Bendras plotas (m²):</strong> {data.area}</p>
        </fieldset>

        <fieldset className="border p-3 mb-4">
          <legend className="w-auto px-2">Deklaruojami gyventojai</legend>
          {data.residents && data.residents.length > 0 ? (
            data.residents.map((resident, index) => (
              <div key={resident.id} className="border p-3 mb-3">
                <h6>Gyventojas #{index + 1}</h6>
                <p><strong>Vardas, pavardė:</strong> {resident.fullName}</p>
                <p><strong>Asmens duomenys:</strong> {resident.personalData}</p>
                <p><strong>Papildoma informacija:</strong> {resident.additionalInfo || "-"}</p>
              </div>
            ))
          ) : (
            <p>Gyventojai nenurodyti.</p>
          )}
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

export default ResidentCountDeclarationForm;
