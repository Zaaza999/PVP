// src/Pages/Profile/UserProfile.tsx – telefonas → PhoneNumber
//-------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getUser,
  updateUser,
  getUserReservations,
  deleteReservation,
} from "../Axios/apiServises";
import "../styles.css";

/* ===== DTO ===== */
interface User {
  id: string;
  roleId: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  address: string | null;
  phoneNumber: string | null; // ← IdentityUser field
  email: string | null;
}
interface Reservation {
  reservationId: number;
  userId: number;
  timeSlotId: number;
  reservationDate: string;
  status: string;
  topicId: number;
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

/* ===== COMPONENT ===== */
const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName]       = useState<string | null>(null);
  const [lastName, setLastName]         = useState<string | null>(null);
  const [address, setAddress]           = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber]   = useState<string | null>(null);
  const [email, setEmail]               = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  /* --- load user --- */
  useEffect(() => {
    if (!currentUserId) return;

    getUser(currentUserId)
      .then((u: User) => {
        setUser(u);
        setFirstName(u.firstName);
        setLastName(u.lastName);
        setAddress(u.address);
        setPhoneNumber(u.phoneNumber);
        setEmail(u.email);
      })
      .catch(console.error);

    getUserReservations(currentUserId as string)
      .then(setReservations)
      .catch(console.error);
  }, [currentUserId]);

  if (!user) return <p>Kraunama...</p>;

  /* --- save */
  const save = () => {
    updateUser(user.id, {
      ...user,
      firstName:   firstName   ?? "",
      lastName:    lastName    ?? "",
      address:     address     ?? "",
      phoneNumber: phoneNumber ?? "",
      email:       email       ?? "",
    })
      .then((u: User) => {
        setUser(u);
        setIsEditing(false);
      })
      .catch(console.error);
  };
  const cancel = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAddress(user.address);
    setPhoneNumber(user.phoneNumber);
    setEmail(user.email);
    setIsEditing(false);
  };

  const delRes = (id: number) =>
    deleteReservation(id)
      .then(() => setReservations(r => r.filter(x => x.reservationId !== id)))
      .catch(console.error);

  /* ===== render ===== */
  return (
    <div className="container user-profile">
      <h2>Naudotojo profilis</h2>
      <button className="btn" onClick={() => navigate("/")}>Grįžti</button>

      <div className="card">
        {isEditing ? (
          <div className="form">
            {/* Vardas */}
            <div className="form-group"><label>Vardas:</label><input type="text" value={firstName ?? ""} onChange={e => setFirstName(e.target.value)} /></div>
            {/* Pavardė */}
            <div className="form-group"><label>Pavardė:</label><input type="text" value={lastName ?? ""} onChange={e => setLastName(e.target.value)} /></div>
            {/* Adresas */}
            <div className="form-group"><label>Adresas:</label><input type="text" value={address ?? ""} onChange={e => setAddress(e.target.value)} /></div>
            {/* Telefonas */}
            <div className="form-group"><label>Telefonas:</label><input type="text" value={phoneNumber ?? ""} onChange={e => setPhoneNumber(e.target.value)} /></div>
            {/* El. paštas */}
            <div className="form-group"><label>El. paštas:</label><input type="email" value={email ?? ""} onChange={e => setEmail(e.target.value)} /></div>
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
            <button className="btn" onClick={() => setIsEditing(true)}>Redaguoti</button>
          </div>
        )}
      </div>

      {/* Rezervacijos */}
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
                <td>{new Date(r.reservationDate).toLocaleString()}</td>
                <td>{r.status}</td>
                <td><button className="btn btn-delete" onClick={() => delRes(r.reservationId)}>Atšaukti</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserProfile;
