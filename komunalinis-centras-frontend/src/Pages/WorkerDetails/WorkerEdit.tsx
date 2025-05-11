import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./WorkerDetails.css"; // Optionally rename to WorkerEdit.css

const WorkerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch worker data with native fetch
  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const response = await fetch(`http://localhost:5190/users/${id}`);
        if (!response.ok) throw new Error("Nepavyko gauti darbuotojo duomenų");
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error("Klaida:", err);
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5190/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Nepavyko atnaujinti duomenų");

      alert("Darbuotojo duomenys atnaujinti.");
      navigate(`/worker-list/${id}`);
    } catch (err) {
      console.error("Klaida atnaujinant darbuotoją:", err);
      alert("Nepavyko atnaujinti duomenų.");
    }
  };

  if (loading || !formData) return <p>Kraunama...</p>;

  return (
    <div className="container">
      <form className="user-form" onSubmit={handleSubmit}>
        <h2>Redaguoti darbuotoją</h2>

        {Object.entries(fieldMap).map(([field, label]) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{label}</label>
            <input
              type={field === "email" ? "email" : field === "password" ? "password" : "text"}
              id={field}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              required={["firstName", "lastName", "email"].includes(field)}
            />
          </div>
        ))}

        <div className="button-group">
          <button type="button" className="worker-back-button" onClick={() => navigate(-1)}>Atšaukti</button>
          <button type="submit" className="worker-save-button">Išsaugoti</button>
        </div>
      </form>
    </div>
  );
};

const fieldMap: Record<string, string> = {
  firstName: "Vardas",
  lastName: "Pavardė",
  email: "El. paštas",
  phoneNumber: "Telefono numeris",
  address: "Adresas",
};

export default WorkerEdit;
