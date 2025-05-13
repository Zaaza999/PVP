import React, { useState } from "react";

interface ApplicationStatusManagerProps {
  approved: boolean;
  formType: string;
  formId: number;
}

const ApplicationStatusManager: React.FC<ApplicationStatusManagerProps> = ({
  approved,
  formType,
  formId,
}) => {
  const [status, setStatus] = useState(approved ? "Patvirtinta" : "Nepatvirtinta");

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleStatusSubmit = async () => {
    const approvedValue = status === "Patvirtinta";

    try {
      const response = await fetch(`http://localhost:5190/applications/${formType}/${formId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved: approvedValue }),
      });

      if (!response.ok) {
        throw new Error("Nepavyko atnaujinti būsenos");
      }

      alert("Būsena sėkmingai atnaujinta");
    } catch (error) {
      alert("Įvyko klaida keičiant būseną");
      console.error(error);
    }
  };

  return (
    <div className="container rounded bg-light">
      <div className="row align-items-end mb-4 border p-3">
        {/* Left: Current status */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Dabartinė būsena</label>
          <div>
            <span className={`badge fs-5 ${status === "Patvirtinta" ? "bg-success" : "bg-warning text-dark"}`}>
              {status}
            </span>
          </div>
        </div>

        {/* Middle: Status dropdown */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Keičiama būsena</label>
          <select className="form-select" value={status} onChange={handleStatusChange}>
            <option value="Patvirtinta">Patvirtinta</option>
            <option value="Nepatvirtinta">Nepatvirtinta</option>
          </select>
        </div>

        {/* Right: Submit button */}
        <div className="col-md-4 text-end">
          <button className="btn btn-primary mt-2" onClick={handleStatusSubmit}>
            Atnaujinti būseną
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusManager;
