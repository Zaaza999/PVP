import React, { useState } from "react";
import "../styles.css";

import WasteFeeExemptionForm from "./Forms/WasteFeeExemptionForm";
import WasteFeeExemptionBusinessForm from "./Forms/WasteFeeExemptionBusinessForm";
import PropertyUnsuitabilityForm from "./Forms/PropertyUnsuitabilityForm";
import PropertyUsageDeclarationForm from "./Forms/PropertyUsageDeclarationForm";
import ResidentCountDeclarationForm from "./Forms/ResidentCountDeclarationForm";
import ContainerRequestForm from "./Forms/ContainerRequestForm";
import ContainerFrequencyChangeForm from "./Forms/ContainerFrequencyChangeForm";
import EmailInvoiceRequestForm from "./Forms/EmailInvoiceRequestForm";
import RefundRequestForm from "./Forms/RefundRequestForm";
import PayerDataChangeRequestForm from "./Forms/PayerDataChangeRequestForm";

const formsList = [
  { title: "1. Prašymas atleisti nuo kintamos vietinės rinkliavos (fiziniams)", component: <WasteFeeExemptionForm /> },
  { title: "2. Prašymas atleisti nuo kintamos vietinės rinkliavos (juridiniams)", component: <WasteFeeExemptionBusinessForm /> },
  { title: "3. Prašymas dėl NT objekto įtraukimo į netinkamų/nenaudojamų sąrašą", component: <PropertyUnsuitabilityForm /> },
  { title: "4. NT ploto / paskirties tikslinimo deklaracija", component: <PropertyUsageDeclarationForm /> },
  { title: "5. Asmenų skaičiaus deklaracija", component: <ResidentCountDeclarationForm /> },
  { title: "6. Konteinerio užsakymo prašymas", component: <ContainerRequestForm /> },
  { title: "7. Konteinerio ištuštinimo dažnio keitimas", component: <ContainerFrequencyChangeForm /> },
  { title: "8. Konteinerio dydžio keitimas", component: <EmailInvoiceRequestForm /> },
  { title: "9. Prašymas dėl sąskaitų el. paštu", component: <RefundRequestForm /> },
  { title: "10. Permokos grąžinimo prašymas", component: <PayerDataChangeRequestForm /> },
];

const Application: React.FC = () => {
  const [isListOpen, setIsListOpen] = useState(true);
  const [selectedFormIndex, setSelectedFormIndex] = useState<number | null>(null);

  const toggleList = () => setIsListOpen((prev) => !prev);

  return (
    <div className="weekly-schedule-container">
      <div
        className="form-toggle-header"
        onClick={toggleList}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        <div
          className="arrow-circle"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#FFC107",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
            transform: isListOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          ▶
        </div>
        <h2 style={{ margin: 0 }}>Galimi prašymų šablonai</h2>
      </div>

      {isListOpen && (
        <ul style={{ listStyle: "none", paddingLeft: "0", marginBottom: "30px" }}>
          {formsList.map((form, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>{form.title}</span>
              <button
                className="btn"
                style={{ padding: "6px 12px", fontSize: "0.9rem", whiteSpace: "nowrap" }}
                onClick={() => setSelectedFormIndex(index)}
              >
                Atidaryti
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedFormIndex !== null && (
        <div style={{ marginTop: "30px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <button
              className="btn btn-delete"
              onClick={() => setSelectedFormIndex(null)}
              style={{ padding: "6px 12px", fontSize: "0.9rem" }}
            >
              Uždaryti formą
            </button>
          </div>
          {formsList[selectedFormIndex].component}
        </div>
      )}

    </div>
  );
};

export default Application;
