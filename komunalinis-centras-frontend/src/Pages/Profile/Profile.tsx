// src/Pages/UserProfile.tsx
// --------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getUser,
  updateUser,
  getUserReservations,
  deleteReservation,
  cancelSubscription,
} from "../Axios/apiServises";
import "../styles.css";

/* ===== DTO ===== */
interface Role { roleName: string; id: string; }
interface User {
  id: string;
  roleId: number;
  role?: Role;
  firstName: string | null;
  lastName: string | null;
  username: string;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
  subscription: boolean;
}
interface Reservation {
  reservationId: number;
  timeSlotId: number;
  reservationDate: string;
  status: string;
}
interface Application {
  applicationId: number;
  formType: string;
  submittedAt: string;
  approved: boolean;
  /* galimi įvairūs ID laukai iš API */
  userId?: string;
  submittedByUserId?: string;
  submittedBy?: { id: string; firstName?: string; lastName?: string };
}

/* ===== auth helper ===== */
const getCurrentUserId = (): string | null => {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    const d: any = jwtDecode(t);
    return d.userId ?? d.id ?? d.sub ?? d.nameid ?? null;
  } catch {
    return null;
  }
};

/* ===== utils ===== */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

/* ===== COMPONENT ===== */
const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  /* --- basic fields --- */
  const [firstName, setFirstName]     = useState<string | null>(null);
  const [lastName, setLastName]       = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail]             = useState<string | null>(null);

  /* --- address parts --- */
  const [street,      setStreet]      = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city,        setCity]        = useState("");

  /* --- reservations & applications --- */
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  /* --- LOAD EVERYTHING --------------------------------------- */
  useEffect(() => {
    if (!currentUserId) return;

    /* profilis */
    getUser(currentUserId)
      .then((u) => {
        setUser(u);
        setFirstName(u.firstName);
        setLastName(u.lastName);
        setPhoneNumber(u.phoneNumber);
        setEmail(u.email);

        if (u.address) {
          const m = u.address.match(/^(.+?)\s+(\S+),\s*(.+)$/);
          if (m) { setStreet(m[1]); setHouseNumber(m[2]); setCity(m[3]); }
          else   { setStreet(u.address); }
        }
      })
      .catch(console.error);

    /* rezervacijos */
    getUserReservations(currentUserId)
      .then(setReservations)
      .catch(console.error);

    /* prašymai */
    const fetchUserApplications = async () => {
      try {
        const res = await fetch("http://localhost:5190/applications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });
        if (!res.ok) throw new Error("Nepavyko gauti prašymų");
        const data: Application[] = await res.json();

        setApplications(
          data.filter((a) =>
            a.userId === currentUserId ||
            a.submittedByUserId === currentUserId ||
            a.submittedBy?.id === currentUserId
          )
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserApplications();
  }, [currentUserId]);

  if (!user) return <p>Kraunama...</p>;

  /* --- helpers ----------------------------------------------- */
  const formattedAddress = () =>
    `${street.trim()} ${houseNumber.trim()}, ${city.trim()}`;

  /* --- save --------------------------------------------------- */
  const save = () => {
    updateUser(user.id, {
      ...user,
      firstName:   firstName   ?? "",
      lastName:    lastName    ?? "",
      address:     formattedAddress(),
      phoneNumber: phoneNumber ?? "",
      email:       email       ?? "",
    })
      .then((u) => { setUser(u); setIsEditing(false); })
      .catch(console.error);
  };

  const cancel = () => {
    setFirstName(user.firstName); setLastName(user.lastName);
    setPhoneNumber(user.phoneNumber); setEmail(user.email);

    if (user.address) {
      const m = user.address.match(/^(.+?)\s+(\S+),\s*(.+)$/);
      if (m) { setStreet(m[1]); setHouseNumber(m[2]); setCity(m[3]); }
      else   { setStreet(user.address); setHouseNumber(""); setCity(""); }
    } else { setStreet(""); setHouseNumber(""); setCity(""); }

    setIsEditing(false);
  };

  const delRes = (id: number) =>
    deleteReservation(id)
      .then(() => setReservations(r => r.filter(x => x.reservationId !== id)))
      .catch(console.error);

  const unsubscribe = () => {
    cancelSubscription(user.id)
      .then(() => setUser({ ...user, subscription: false }))
      .catch(console.error);
  };

  /* ===== RENDER ============================================== */
  return (
    <div className="container user-profile">
      <h2>Naudotojo profilis</h2>
      <button className="btn" onClick={() => navigate("/")}>Grįžti</button>

      {/* -------- PROFILE CARD ---------- */}
      <div className="card">
        {isEditing ? (
          <div className="form">
            <div className="form-group">
              <label>Vardas:</label>
              <input value={firstName ?? ""} onChange={e=>setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Pavardė:</label>
              <input value={lastName ?? ""} onChange={e=>setLastName(e.target.value)} />
            </div>

            <fieldset className="address-fieldset">
              <legend>Adresas</legend>
              <div className="form-group">
                <label>Gatvė:</label>
                <input value={street} onChange={e=>setStreet(e.target.value)} placeholder="Liepų g."/>
              </div>
              <div className="form-group">
                <label>Namas / butas:</label>
                <input value={houseNumber} onChange={e=>setHouseNumber(e.target.value)} placeholder="34"/>
              </div>
              <div className="form-group">
                <label>Gyvenvietė:</label>
                <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Garliava"/>
              </div>
            </fieldset>

            <div className="form-group">
              <label>Telefonas:</label>
              <input value={phoneNumber ?? ""} onChange={e=>setPhoneNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label>El. paštas:</label>
              <input type="email" value={email ?? ""} onChange={e=>setEmail(e.target.value)} />
            </div>

            <button className="btn" onClick={save}>Išsaugoti</button>
            <button className="btn btn-delete" onClick={cancel}>Atšaukti</button>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Vardas:</strong> {user.firstName}</p>
            <p><strong>Pavardė:</strong> {user.lastName}</p>
            <p><strong>Adresas:</strong> {user.address}</p>
            <p><strong>Telefonas:</strong> {user.phoneNumber}</p>
            <p><strong>El. paštas:</strong> {user.email}</p>
            <p><strong>Vartotojo rolė:</strong> {user.role?.roleName ?? "Nenurodyta"}</p>
            <p><strong>Atliekų grafiko prenumerata:</strong> {user.subscription ? "Aktyvi" : "Neaktyvi"}</p>
            {user.subscription && (
              <button className="btn btn-delete" onClick={unsubscribe}>Atšaukti prenumeratą</button>
            )}
            <button className="btn" onClick={() => setIsEditing(true)}>Redaguoti</button>
          </div>
        )}
      </div>

      {/* -------- My Reservations ---------- */}
      {localStorage.getItem("userRole") === "Client" && (
        <>
          <h3>Mano rezervacijos</h3>
          {reservations.length === 0 ? (
            <p>Nėra rezervacijų</p>
          ) : (
            <table className="reservations-table">
              <thead>
                <tr><th>ID</th><th>Langas</th><th>Data</th><th>Statusas</th><th /></tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.reservationId}>
                    <td>{r.reservationId}</td>
                    <td>{r.timeSlotId}</td>
                    <td>{formatDate(r.reservationDate)}</td>
                    <td>{r.status}</td>
                    <td>
                      <button className="btn btn-delete" onClick={() => delRes(r.reservationId)}>
                        Atšaukti
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* -------- My Applications ---------- */}
          <h3>Mano prašymai</h3>
          {applications.length === 0 ? (
            <p>Nėra pateiktų prašymų</p>
          ) : (
            <div className="application-list">
              {applications.map(app => (
                <div key={app.applicationId} className="card application-card">
                  <p><strong>ID:</strong> {app.applicationId}</p>
                  <p><strong>Forma:</strong> {app.formType}</p>
                  <p><strong>Pateikta:</strong> {formatDate(app.submittedAt)}</p>
                  <p><strong>Patvirtinta:</strong> {app.approved ? "Taip" : "Ne"}</p>
                </div>
              ))}
            </div>
          )} 
              </>
      )}
    </div>
  );
};

export default UserProfile;
