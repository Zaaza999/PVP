import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../Axios/apiServises";
import {jwtDecode} from "jwt-decode";
import { formatWorkerRoleName } from "../../utils/formatWorkerRoleName";
import "./WorkerDetails.css";

interface JwtPayload {
  userId: string;
  [key: string]: any;
}

const WorkerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<any>(null);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded: JwtPayload = jwtDecode(token);
    const userId = decoded.userId ?? decoded.sub;
    if (!userId) return;

    getUser(userId)
        .then((user) => {
          setUserRole(user.role?.roleName);
        })
        .catch((err) => {
          console.error("Nepavyko gauti naudotojo duomenų:", err);
        });
  }, []);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const response = await fetch(`http://localhost:5190/users/${id}`);
        if (!response.ok) throw new Error("Nepavyko gauti darbuotojo duomenų");
        const data = await response.json();
        setWorker(data);
      } catch (err) {
        console.error("Klaida:", err);
      }
    };

    fetchWorker();
  }, [id]);

const handleDelete = async () => {
  const confirmed = window.confirm("Ar tikrai norite ištrinti šį darbuotoją?");
  if (!confirmed || !id) return;

  try {
    const response = await fetch(`http://localhost:5190/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Nepavyko ištrinti. Kodas: ${response.status}`);
    }

    alert("Darbuotojas ištrintas");
    navigate("/worker-list");
  } catch (err) {
    console.error("Klaida trinant darbuotoją:", err);
    alert("Įvyko klaida trinant darbuotoją.");
  }
};


  if (!worker) return <p>Kraunama...</p>;

  return (
    <div className="container">
      <div className="worker-profile">
        <div className="worker-header">
          <div className="avatar-placeholder">👤</div>
          <div>
            <h2>{worker.firstName || "---------"} {worker.lastName || "---------"}</h2>
            <p className="role-text">{formatWorkerRoleName(worker.role?.name) || "---------"}</p>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Vardas:</span>
            <span className="value">{worker.firstName || "---------"}</span>
          </div>
          <div className="detail-item">
            <span className="label">Pavardė:</span>
            <span className="value">{worker.lastName || "---------"}</span>
          </div>
          <div className="detail-item">
            <span className="label">El. paštas:</span>
            <span className="value">{worker.email || "---------"}</span>
          </div>
          <div className="detail-item">
            <span className="label">Telefono numeris:</span>
            <span className="value">{worker.phoneNumber || "---------"}</span>
          </div>
          <div className="detail-item">
            <span className="label">Adresas:</span>
            <span className="value">{worker.address || "---------"}</span>
          </div>
        </div>

        <div className="button-group">
          <button className="worker-back-button" onClick={() => navigate(-1)}>Grįžti atgal</button>
          {userRole === "admin" && (
              <>
                <button className="worker-edit-button" onClick={() => navigate(`/worker-list/${id}/edit`)}>Redaguoti</button>
                <button className="worker-delete-button" onClick={handleDelete}>Ištrinti</button>
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDetails;
