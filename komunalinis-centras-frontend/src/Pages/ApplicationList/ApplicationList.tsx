import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFormTitle } from "../../utils/formTitleHelper";
import { formatApplicationGroupName } from "../../utils/formatApplicationGroupName";

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const groupByApplicationGroup = (apps: any[]) => {
  return apps.reduce((groups: Record<string, any[]>, app) => {
    const groupName = app.applicationGroup?.groupName || "Kita";
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(app);
    return groups;
  }, {});
};

const ApplicationList: React.FC = () => {
  const [groupedApplications, setGroupedApplications] = useState<Record<string, any[]>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userRole = localStorage.getItem("userRole");
        console.log("User current role is: ", userRole);
        if (!userRole) {
          console.warn("No role found in localStorage.");
          return;
        }

        const response = await fetch(`http://localhost:5190/applications/by-role/${userRole}`);
        if (!response.ok) throw new Error("Nepavyko gauti duomenų");

        const data = await response.json();
        const grouped = groupByApplicationGroup(data);
        setGroupedApplications(grouped);
      } catch (err) {
        console.error("Klaida:", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-5 fw-bold border-bottom pb-2">
        Pateiktų prašymų sąrašas
      </h2>

      {Object.entries(groupedApplications).map(([groupName, apps]) => (
        <div key={groupName} className="mb-5">
          <h4 className="text-secondary border-bottom pb-2 mb-3">{formatApplicationGroupName(groupName)}</h4>

          <div className="table-responsive">
            <table className="table table-hover align-middle shadow-sm border rounded">
              <thead className="table-light">
                <tr>
                  <th scope="col">Forma</th>
                  <th scope="col">Pateikta</th>
                  <th scope="col">Būsena</th>
                  <th scope="col" className="text-end">Veiksmas</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((application: any) => (
                  <tr key={application.id}>
                    <td>{getFormTitle(application.formType)}</td>
                    <td>{formatDate(application.date)}</td>
                    <td>
                      <span>
                        {application.status?.name}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          navigate(
                            `/application-list/${application.formType}/${application.id}`
                          )
                        }
                      >
                        Peržiūrėti
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="text-center mt-5">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Grįžti į pagrindinį puslapį
        </button>
      </div>
    </div>

  );
};

export default ApplicationList;
