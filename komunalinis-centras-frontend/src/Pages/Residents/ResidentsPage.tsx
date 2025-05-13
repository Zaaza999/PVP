import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../Axios/apiServises";
import { getResidents } from "../Axios/apiServises";
import "./ResidentsPage.css";

interface Resident {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phoneNumber?: string;
}

interface JwtPayload {
    userId: string;
    [key: string]: any;
}

const ResidentsList: React.FC = () => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const [nameFilter, setNameFilter] = useState<string>("");
    const [surnameFilter, setSurnameFilter] = useState<string>("");
    const filteredResidents = residents.filter(r =>
        r.firstName.toLowerCase().includes(nameFilter.toLowerCase()) &&
        r.lastName.toLowerCase().includes(surnameFilter.toLowerCase())
    );
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = (resident: Resident) => {
        setSelectedResident(resident);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResident(null);
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Neteisingas prisijungimas.");
            return;
        }

        const decoded: JwtPayload = jwtDecode(token);
        const userId = decoded.userId ?? decoded.sub;

        if (!userId) {
            setError("Nepavyko identifikuoti naudotojo.");
            return;
        }

        getUser(userId)
            .then(user => {
                if (!["worker", "admin"].includes(user.role?.roleName?.toLowerCase() || "")) {
                    setError("Neturite prieigos prie šio puslapio.");
                    return;
                }
                getResidents()
                    .then((res: Resident[]) => setResidents(res))
                    .catch(() => setError("Nepavyko gauti gyventojų sąrašo."));
            })
            .catch(() => setError("Nepavyko patikrinti naudotojo rolės."));
    }, []);

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    return (
        <div>
            <h2>Gyventojų sąrašas</h2>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Filtruoti pagal vardą"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filtruoti pagal pavardę"
                    value={surnameFilter}
                    onChange={(e) => setSurnameFilter(e.target.value)}
                />
            </div>
            <table>
                <thead>
                <tr>
                    <th>Vardas</th>
                    <th>Pavardė</th>
                    <th>El. paštas</th>
                    <th>Veiksmai</th>
                </tr>
                </thead>
                <tbody>
                {filteredResidents.map((r) => (
                    <tr key={r.id}>
                        <td>{r.firstName}</td>
                        <td>{r.lastName}</td>
                        <td>{r.email}</td>
                        <td>
                            <button className="details-button" onClick={() => openModal(r)}>Plačiau</button>
                        </td>
                    </tr>
                ))}
                {filteredResidents.length === 0 && (
                    <tr>
                        <td colSpan={4}>Gyventojų nėra.</td>
                    </tr>
                )}
                </tbody>
            </table>
            {isModalOpen && selectedResident && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Gyventojo informacija</h3>
                        <p><strong>Vardas:</strong> {selectedResident.firstName}</p>
                        <p><strong>Pavardė:</strong> {selectedResident.lastName}</p>
                        <p><strong>El. paštas:</strong> {selectedResident.email}</p>
                        <p><strong>Adresas:</strong> {selectedResident.address ?? 'Nenurodyta'}</p>
                        <p><strong>Telefonas:</strong> {selectedResident.phoneNumber ?? 'Nenurodyta'}</p>
                        <button onClick={closeModal}>Uždaryti</button>
                    </div>
                </div>
            )}
            <div className="button-wrapper">
                <button className="back-button" onClick={() => navigate("/")}>
                    Grįžti į pagrindinį puslapį
                </button>
            </div>
        </div>
    );
};

export default ResidentsList;
