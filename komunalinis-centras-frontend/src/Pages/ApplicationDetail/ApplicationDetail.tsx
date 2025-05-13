import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Import all form components
import ContainerFrequencyChange from "./ApplicationDetailForms/ContainerFrequencyChangeForm";
import ContainerRequest from "./ApplicationDetailForms/ContainerRequestForm";
import ContainerSizeChangeRequest from "./ApplicationDetailForms/ContainerSizeChangeRequest";
import EmailInvoiceRequest from "./ApplicationDetailForms/EmailInvoiceRequestForm";
import PayerDataChangeRequest from "./ApplicationDetailForms/PayerDataChangeRequestForm";
import PropertyUnsuitability from "./ApplicationDetailForms/PropertyUnsuitabilityForm";
import PropertyUsageDeclaration from "./ApplicationDetailForms/PropertyUsageDeclarationForm";
import RefundRequest from "./ApplicationDetailForms/RefundRequestForm";
import ResidentCountDeclaration from "./ApplicationDetailForms/ResidentCountDeclarationForm";
import WasteFeeExemptionBusiness from "./ApplicationDetailForms/WasteFeeExemptionBusinessForm";
import WasteFeeExemption from "./ApplicationDetailForms/WasteFeeExemptionForm"; 
import { Link } from "react-router-dom";


// Map formType to component
const formComponentMap: Record<string, React.FC<{ data: any }>> = {
  ContainerFrequencyChange,
  ContainerRequest,
  ContainerSizeChangeRequest,
  EmailInvoiceRequest,
  PayerDataChangeRequest,
  PropertyUnsuitability,
  PropertyUsageDeclaration,
  RefundRequest,
  ResidentCountDeclaration,
  WasteFeeExemptionBusiness,
  WasteFeeExemption,
};

const ApplicationDetail: React.FC = () => {
  const { formType, formId } = useParams<{ formType: string; formId: string }>();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://localhost:5190/applications/${formType}/${formId}`);
        if (!response.ok) throw new Error("Nepavyko gauti formos duomenų");
        const data = await response.json();
        setFormData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formType, formId]);

  if (loading) return <p>Kraunama...</p>;
  if (error) return <p>Klaida: {error}</p>;

  const FormComponent = formComponentMap[formType!];
  console.log(FormComponent);
  if (!FormComponent) {
    return <p>Formos tipas „{formType}“ nėra palaikomas.</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Formos detalės</h2>
      <FormComponent data={formData} /> 
      <div className="button-wrapper">
        <Link to="/application-list" className="back-button">
          Grįžti
        </Link>
      </div>
    </div> 
  );
};

export default ApplicationDetail;
