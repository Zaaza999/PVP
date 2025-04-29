import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ApplicationList.css";

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

const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5190/applications");
        if (!response.ok) throw new Error("Nepavyko gauti duomenų");
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error("Klaida:", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="container">
      <h2>Gauti prašymai</h2>
      {applications.map((application: any) => (
        <div key={application.applicationId} className="card application-card">
          <p><strong>ID:</strong> {application.applicationId}</p>
          <p><strong>Forma:</strong> {application.formType}</p>
          <p><strong>Pateikta:</strong> {formatDate(application.submittedAt)}</p>
          <p>
            <strong>Patvirtinta:</strong>{" "}
            {application.approved ? "Patvirtinta" : "Nepatvirtinta"}
          </p>
          <button
            className="form-link-button"
            onClick={() => navigate(`/application-list/${application.applicationId}`)}
          >
            Peržiūrėti
          </button>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;
