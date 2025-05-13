import React, { useEffect, useState } from "react";

interface ApplicationStatus {
  id: number;
  name: string;
}

interface ApplicationStatusManagerProps {
  statusId: number;
  formType: string;
  formId: number;
}

const ApplicationStatusManager: React.FC<ApplicationStatusManagerProps> = ({
  statusId,
  formType,
  formId,
}) => {
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<number>(statusId);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch("http://localhost:5190/applicationstatuses");
        const data = await response.json();
        setStatuses(data);
        setLoading(false);
      } catch (error) {
        console.error("Klaida gaunant būsenas:", error);
      }
    };

    fetchStatuses();
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatusId(Number(e.target.value));
  };

  const handleStatusSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5190/applications/${formType}/${formId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statusId: selectedStatusId }),
        }
      );

      if (!response.ok) {
        throw new Error("Nepavyko atnaujinti būsenos");
      }

      alert("Būsena sėkmingai atnaujinta");
    } catch (error) {
      alert("Įvyko klaida keičiant būseną");
      console.error(error);
    }
  };

  const currentStatus = statuses.find((s) => s.id === selectedStatusId);

  return (
    <div className="container rounded bg-light">
      <div className="row align-items-end mb-4 border p-3">
        {/* Left: Current status */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Dabartinė būsena</label>
          <div>
            <span>
              {currentStatus?.name || "Nėra"}
            </span>
          </div>
        </div>

        {/* Middle: Status dropdown */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Keičiama būsena</label>
          <select
            className="form-select"
            value={selectedStatusId}
            onChange={handleStatusChange}
            disabled={loading}
          >
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Submit button */}
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary mt-2"
            onClick={handleStatusSubmit}
            disabled={loading}
          >
            Atnaujinti būseną
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusManager;
