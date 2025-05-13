import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerList.css";

const WorkersList: React.FC = () => {
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("http://localhost:5190/users/workers");
        if (!response.ok) throw new Error("Nepavyko gauti darbuotojų duomenų");
        const data = await response.json();
        setWorkers(data);
      } catch (err) {
        console.error("Klaida:", err);
      }
    };

    fetchWorkers();
  }, []);

  return (
    <div className="container">
      <h2>Darbuotojų sąrašas</h2>
      {workers.map((worker: any) => (
        <div key={worker.id} className="card worker-card">
          <p><strong>Vardas:</strong> {worker.firstName} {worker.lastName}</p>
          <p><strong>El. paštas:</strong> {worker.email}</p>
          {/* Optional button */}
          <button className="view-worker-button" onClick={() => navigate(`/worker-list/${worker.id}`)}>Peržiūrėti</button> 
        </div>
      ))} 
        <div className="button-wrapper">
            <button className="view-worker-button" onClick={() => navigate("/")}>
                Grįžti į pagrindinį puslapį
            </button>
        </div>
    </div>
  );
};

export default WorkersList;
