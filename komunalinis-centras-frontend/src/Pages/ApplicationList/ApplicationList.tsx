import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFormTitle } from "../../utils/formTitleHelper";

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};


const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:5190/applications");
        if (!response.ok) throw new Error("Nepavyko gauti duomenų");
        const data = await response.json();
        console.log(data);
        setApplications(data);
      } catch (err) {
        console.error("Klaida:", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Pateiktų prašymų sąrašas</h2>

      <div className="d-flex flex-column gap-3">
        {applications.map((application: any) => (
          <div key={application.id} className="w-100">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Forma: {getFormTitle(application.formType)}</h5>
                <p className="card-text mb-1">
                  <strong>Pateikta:</strong> {formatDate(application.date)}
                </p>
                <p className="card-text">
                  <strong>Būsena:</strong>{" "}
                  <span>
                    {application.status?.name || "Nežinoma būsena"}
                  </span>
                </p>
                <div className="text-end">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/application-list/${application.formType}/${application.id}`)}
                  >
                    Peržiūrėti
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationList;
