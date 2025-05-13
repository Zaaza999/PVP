/* ==========================================================
   UserProfile.tsx – naudotojo profilio puslapis
   ========================================================== */

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

/* ---------- Tipai ---------- */
interface Role {
  roleName: string;
  id: string;
}

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

/** Naujo formato prašymai (pagal backend 2025‑05‑14) */
interface Application {
  id: number;
  formType: string;          // pvz. "ContainerFrequencyChange"
  date: string;              // ISO data
  status?: { name: string }; // { name: "Laukiama patvirtinimo" }
  /* papildomi ID iš API (nebūtini, bet palikti) */
  userId?: string;
  submittedByUserId?: string;
  submittedBy?: { id: string; firstName?: string; lastName?: string };
}

/* ---------- Auth helper ---------- */
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.userId ?? decoded.id ?? decoded.sub ?? decoded.nameid ?? null;
  } catch {
    return null;
  }
};

/* ---------- Utils ---------- */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "–";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}/${m}/${day} ${h}:${min}`;
};

/** Human‑friendly pavadinimai formType → lietuviškas pavadinimas */
const formTitles: Record<string, string> = {
  WasteFeeExemption: "Prašymas – Atleidimas nuo vietinės rinkliavos (fiziniai asmenys)",
  WasteFeeExemptionBusiness: "Prašymas – Atleidimas nuo vietinės rinkliavos (juridiniai asmenys)",
  EmailInvoiceRequest: "Prašymas – Sąskaitų gavimas el. paštu",
  PropertyUnsuitability: "Prašymas – Pripažinti NT netinkamu naudoti",
  PropertyUsageDeclaration: "Deklaracija – NT faktinio naudojimo deklaravimas",
  ResidentCountDeclaration: "Deklaracija – Gyventojų skaičiaus deklaravimas",
  ContainerRequest: "Prašymas – Konteinerio suteikimas",
  ContainerFrequencyChange: "Prašymas – Konteinerio ištuštinimo dažnumo keitimas",
  ContainerSizeChange: "Prašymas – Konteinerio dydžio keitimas",
  RefundRequest: "Prašymas – Permokėtos vietinės rinkliavos grąžinimas",
  PayerDataChangeRequest: "Prašymas – Vietinės rinkliavos mokėtojo duomenų keitimas",
};

const getFormTitle = (type: string) => formTitles[type] ?? type;

/* ==========================================================
   COMPONENT
   ========================================================== */

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  /* --- individual fields --- */
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  /* --- address parts --- */
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");

  /* --- reservations & applications --- */
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  /* ========== LOAD DATA ========== */
  useEffect(() => {
    if (!currentUserId) return;

    /* -- profilis -- */
    getUser(currentUserId)
      .then(u => {
        setUser(u);
        setFirstName(u.firstName);
        setLastName(u.lastName);
        setPhoneNumber(u.phoneNumber);
        setEmail(u.email);

        if (u.address) {
          const m = u.address.match(/^(.+?)\s+(\S+),\s*(.+)$/);
          if (m) {
            setStreet(m[1]);
            setHouseNumber(m[2]);
            setCity(m[3]);
          } else {
            setStreet(u.address);
          }
        }
      })
      .catch(console.error);

    /* -- rezervacijos -- */
    getUserReservations(currentUserId)
      .then(setReservations)
      .catch(console.error);

    /* -- prašymai -- */
    (async () => {
      try {
        const res = await fetch("http://localhost:5190/applications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });
        if (!res.ok) throw new Error("Nepavyko gauti prašymų");
        const data: Application[] = await res.json();

        // tik šio vartotojo prašymai
        setApplications(
          data.filter(
            a =>
              a.userId === currentUserId ||
              a.submittedByUserId === currentUserId ||
              a.submittedBy?.id === currentUserId
          )
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, [currentUserId]);

  if (!user) return <p>Kraunama...</p>;

  /* ---------- helper ---------- */
  const formattedAddress = () =>
    `${street.trim()} ${houseNumber.trim()}, ${city.trim()}`;

  /* ---------- save profile ---------- */
  const save = () => {
    updateUser(user.id, {
      ...user,
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      address: formattedAddress(),
      phoneNumber: phoneNumber ?? "",
      email: email ?? "",
    })
      .then(u => {
        setUser(u);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const cancel = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhoneNumber(user.phoneNumber);
    setEmail(user.email);

    if (user.address) {
      const m = user.address.match(/^(.+?)\s+(\S+),\s*(.+)$/);
      if (m) {
        setStreet(m[1]);
        setHouseNumber(m[2]);
        setCity(m[3]);
      } else {
        setStreet(user.address);
        setHouseNumber("");
        setCity("");
      }
    } else {
      setStreet("");
      setHouseNumber("");
      setCity("");
    }

    setIsEditing(false);
  };

  /* ---------- reservations ---------- */
  const delRes = (id: number) =>
    deleteReservation(id)
      .then(() =>
        setReservations(prev => prev.filter(r => r.reservationId !== id))
      )
      .catch(console.error);

  /* ---------- subscription ---------- */
  const unsubscribe = () => {
    cancelSubscription(user.id)
      .then(() => setUser({ ...user, subscription: false }))
      .catch(console.error);
  };

  /* ==========================================================
     RENDER
     ========================================================== */
  return (
    <div className="container user-profile">
      <h2>Naudotojo profilis</h2>
      <button className="btn" onClick={() => navigate("/")}>
        Grįžti
      </button>

      {/* ---------- PROFILE CARD ---------- */}
      <div className="card">
        {isEditing ? (
          /* ========== redagavimo forma ========== */
          <div className="form">
            <div className="form-group">
              <label>Vardas:</label>
              <input
                value={firstName ?? ""}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Pavardė:</label>
              <input
                value={lastName ?? ""}
                onChange={e => setLastName(e.target.value)}
              />
            </div>

            <fieldset className="address-fieldset">
              <legend>Adresas</legend>
              <div className="form-group">
                <label>Gatvė:</label>
                <input
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="Liepų g."
                />
              </div>
              <div className="form-group">
                <label>Namas / butas:</label>
                <input
                  value={houseNumber}
                  onChange={e => setHouseNumber(e.target.value)}
                  placeholder="34"
                />
              </div>
              <div className="form-group">
                <label>Gyvenvietė:</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Garliava"
                />
              </div>
            </fieldset>

            <div className="form-group">
              <label>Telefonas:</label>
              <input
                value={phoneNumber ?? ""}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>El. paštas:</label>
              <input
                type="email"
                value={email ?? ""}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button className="btn" onClick={save}>
              Išsaugoti
            </button>
            <button className="btn btn-delete" onClick={cancel}>
              Atšaukti
            </button>
          </div>
        ) : (
          /* ========== skaitymo režimas ========== */
          <div className="profile-details">
            <p>
              <strong>Vardas:</strong> {user.firstName}
            </p>
            <p>
              <strong>Pavardė:</strong> {user.lastName}
            </p>
            <p>
              <strong>Adresas:</strong> {user.address}
            </p>
            <p>
              <strong>Telefonas:</strong> {user.phoneNumber}
            </p>
            <p>
              <strong>El. paštas:</strong> {user.email}
            </p>
            <p>
              <strong>Vartotojo rolė:</strong>{" "}
              {user.role?.roleName ?? "Nenurodyta"}
            </p>
            <p>
              <strong>Atliekų grafiko prenumerata:</strong>{" "}
              {user.subscription ? "Aktyvi" : "Neaktyvi"}
            </p>
            {user.subscription && (
              <button className="btn btn-delete" onClick={unsubscribe}>
                Atšaukti prenumeratą
              </button>
            )}
            <button className="btn" onClick={() => setIsEditing(true)}>
              Redaguoti
            </button>
          </div>
        )}
      </div>

      {/* ---------- MY RESERVATIONS ---------- */}
      {localStorage.getItem("userRole") === "client" && (
        <>
          <h3>Mano rezervacijos</h3>
          {reservations.length === 0 ? (
            <p>Nėra rezervacijų</p>
          ) : (
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Langas</th>
                  <th>Data</th>
                  <th>Statusas</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.reservationId}>
                    <td>{r.reservationId}</td>
                    <td>{r.timeSlotId}</td>
                    <td>{formatDate(r.reservationDate)}</td>
                    <td>{r.status}</td>
                    <td>
                      <button
                        className="btn btn-delete"
                        onClick={() => delRes(r.reservationId)}
                      >
                        Atšaukti
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ---------- MY APPLICATIONS ---------- */}
          <h3>Mano prašymai</h3>
          {applications.length === 0 ? (
            <p>Nėra pateiktų prašymų</p>
          ) : (
            <div className="application-list d-flex flex-column gap-3">
              {applications.map(app => (
                <div key={app.id} className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      Forma: {getFormTitle(app.formType)}
                    </h5>

                    <p className="card-text mb-1">
                      <strong>Pateikta:</strong> {formatDate(app.date)}
                    </p>

                    <p className="card-text">
                      <strong>Būsena:</strong>{" "}
                      {app.status?.name ?? "Nežinoma būsena"}
                    </p>

                    <div className="text-end">
                    </div>
                  </div>
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
