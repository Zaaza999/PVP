import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ApplicationDetail.css";

const formatKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleString("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const ApplicationDetail: React.FC = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(`http://localhost:5190/applications/${id}`);
        if (!res.ok) throw new Error("Prašymas nerastas");
        const data = await res.json();
        setApplication(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchApplication();
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!application) return <div className="container"><p>Įkeliama...</p></div>;

  const handleApprovalChange = async (status: boolean) => {
    try {
      const res = await fetch(`http://localhost:5190/applications/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(status)
      });
  
      if (!res.ok) throw new Error("Nepavyko atnaujinti būsenos");
  
      setApplication((prev: any) => ({
        ...prev,
        approved: status
      }));
    } catch (err) {
      alert("Klaida keičiant patvirtinimo būseną");
      console.error(err);
    }
  };
  

  return (
    <div className="container">
      <h2>Prašymo informacija</h2>
      <div className="card">
        <p><strong>ID:</strong> {application.applicationId}</p>
        <p><strong>Forma:</strong> {application.formType}</p>
        <p><strong>Pateikta:</strong> {formatDate(application.submittedAt)}</p>
        <p>
          <strong>Vartotojas:</strong>{" "}
          {application.submittedBy
            ? `${application.submittedBy.firstName} ${application.submittedBy.lastName}`
            : application.submittedByUserId}
        </p>
        <p>
          <strong>Patvirtinta:</strong>{" "}
          {application.approved ? "Patvirtinta" : "Nepatvirtinta"}
        </p>


        <div className="data-section">
          <h3>Duomenys</h3>
          <div className="data-list">
            {Object.entries(application.data || {}).map(([key, value]) => (
              <div key={key} className="data-item">
                <span className="data-key">{formatKey(key)}:</span>
                <span className="data-value">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons">
      <button
          className="btn-reject"
          onClick={() => handleApprovalChange(false)}
          disabled={application.approved === false}
        >
          Atmesti
        </button>
        <button
          className="btn-approve"
          onClick={() => handleApprovalChange(true)}
          disabled={application.approved === true}
        >
          Patvirtinti
        </button>
      </div>

    </div>
  );
};

export default ApplicationDetail;
