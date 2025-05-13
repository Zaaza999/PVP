import React from "react";
import ApplicationStatusManager from "../ApplicationStatusManager"; // adjust the path if needed

interface WasteFeeExemptionData {
  propertyAddress: string;
  propertyOwnerFullName: string;
  correspondenceAddress?: string;
  phoneNumber?: string;
  emailAddress?: string;
  area: number;
  buildingUniqueNumber: string;
  periodFrom: string;
  periodTo: string;
  waterSupplyStatus: string;
  electricityMeterStatus: string;
  initialWaterReading?: number;
  initialElectricityReading?: number;
  applicantFullName: string;
  statusId: number;
  id: number;
  formType: string;
}

const WasteFeeExemptionForm: React.FC<{ data: WasteFeeExemptionData }> = ({ data }) => {
  return (
    <div>
      <div className="container mt-4 p-4 rounded bg-light">
        <h2 className="text-center mb-4">
          Prašymo detalės – Atleidimas nuo vietinės rinkliavos
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
          <legend className="w-auto px-2">Laikotarpis ir infrastruktūra</legend>
          <p><strong>Laikotarpio pradžia:</strong> {data.periodFrom.slice(0, 10)}</p>
          <p><strong>Laikotarpio pabaiga:</strong> {data.periodTo.slice(0, 10)}</p>
          <p><strong>Vandens tiekimo būsena:</strong> {data.waterSupplyStatus}</p>
          <p><strong>Elektros skaitiklio būsena:</strong> {data.electricityMeterStatus}</p>
          <p><strong>Pradiniai vandens parodymai (m³):</strong> {data.initialWaterReading ?? "-"}</p>
          <p><strong>Pradiniai elektros parodymai (kWh):</strong> {data.initialElectricityReading ?? "-"}</p>
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

export default WasteFeeExemptionForm;
