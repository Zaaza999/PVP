import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {
  getUser,
  updateUser,
  getUserReservations,
  deleteReservation,
  cancelSubscription,
} from "../Axios/apiServises";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "../styles.css";

/* ---------- Types ---------- */
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
interface Application {
  id: number;
  formType: string;
  date: string;
  status?: { name: string };
  userId?: string;
  submittedByUserId?: string;
  submittedBy?: { id: string; firstName?: string; lastName?: string };
}

/* ---------- Constants ---------- */
const HISTORY_STATUSES = ["Užbaigta", "Patvirtinta", "Archyvuota"];

/* ---------- Helpers ---------- */
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
const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "–";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}/${m}/${day} ${h}:${min}`;
};
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

/* ---------- Component ---------- */
const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [pendingCancelId, setPendingCancelId] = useState<number | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  /* Fetch user, reservations, and applications */
  useEffect(() => {
    if (!currentUserId) return;
    getUser(currentUserId)
      .then((u) => {
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

    getUserReservations(currentUserId)
      .then(setReservations)
      .catch(console.error);

    (async () => {
      try {
        const res = await fetch("http://localhost:5190/applications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        });
        if (!res.ok) throw new Error("Nepavyko gauti prašymų");
        const data: Application[] = await res.json();
        setApplications(
          data.filter(
            (a) =>
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

  /* Format address */
  const formattedAddress = () => `${street.trim()} ${houseNumber.trim()}, ${city.trim()}`;

  /* Save profile changes */
  const save = () => {
    if (!user) return;
    updateUser(user.id, {
      ...user,
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      address: formattedAddress(),
      phoneNumber: phoneNumber ?? "",
      email: email ?? "",
    })
      .then((u) => {
        setUser(u);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  /* Cancel edit */
  const cancelEdit = () => {
    if (!user) return;
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
    }
    setIsEditing(false);
  };

  /* Confirm reservation cancel */
  const confirmCancel = () => {
    if (pendingCancelId == null) return;
    deleteReservation(pendingCancelId)
      .then(() =>
        setReservations((prev) => prev.filter((r) => r.reservationId !== pendingCancelId))
      )
      .catch(console.error)
      .finally(() => {
        setPendingCancelId(null);
        setOpenCancelDialog(false);
      });
  };

  /* Unsubscribe from subscription */
  const unsubscribe = () => {
    if (!user) return;
    cancelSubscription(user.id)
      .then(() => setUser({ ...user, subscription: false }))
      .catch(console.error);
  };

  /* Sort lists */
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime()
  );
  const sortedApplications = [...applications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  /* Partition applications */
  const activeApps = sortedApplications.filter(
    (app) => !HISTORY_STATUSES.includes(app.status?.name ?? "")
  );
  const historyApps = sortedApplications.filter(
    (app) => HISTORY_STATUSES.includes(app.status?.name ?? "")
  );

  return (
    <div className="container user-profile">
      <h2>Naudotojo profilis</h2>
      <button className="btn" onClick={() => navigate("/")}>Grįžti</button>

<div className="card">
        {isEditing ? (
          <div className="form">
            <div className="form-group"><label>Vardas</label><input type="text" value={firstName ?? ""} onChange={e => setFirstName(e.target.value)} /></div>
            <div className="form-group"><label>Pavardė</label><input type="text" value={lastName ?? ""} onChange={e => setLastName(e.target.value)} /></div>
            <fieldset className="address-fieldset"><legend>Adresas</legend>
              <div className="form-group"><label>Gatvė</label><input type="text" value={street} onChange={e => setStreet(e.target.value)} /></div>
              <div className="form-group"><label>Namatas/butas</label><input type="text" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} /></div>
              <div className="form-group"><label>Gyvenvietė</label><input type="text" value={city} onChange={e => setCity(e.target.value)} /></div>
            </fieldset>
            <div className="form-group"><label>Telefonas</label><input type="text" value={phoneNumber ?? ""} onChange={e => setPhoneNumber(e.target.value)} /></div>
            <div className="form-group"><label>El. paštas</label><input type="email" value={email ?? ""} onChange={e => setEmail(e.target.value)} /></div>
            <div className="button-wrapper"><button className="btn primary" onClick={save}>Išsaugoti</button><button className="btn btn-delete" onClick={cancelEdit}>Atšaukti</button></div>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <div style={{ maxWidth: "600px", width: "100%" }}>
              <div className="card-body">
                <div className="text-center mb-4">
                  <h4>{user.firstName ?? "–"} {user.lastName ?? "–"}</h4>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Vartotojo vardas:</strong> {user.username ?? "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Adresas:</strong> {formattedAddress()}
                  </li>
                  <li className="list-group-item">
                    <strong>Telefonas:</strong> {user.phoneNumber ?? "–"}
                  </li>
                  <li className="list-group-item">
                    <strong>El. paštas:</strong> {user.email ?? "–"}
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <strong>Prenumerata:</strong> {user.subscription ? "Aktyvi" : "Neaktyvi"}
                    </span>
                    {user.subscription && (
                      <button className="btn btn-outline-danger btn-sm" onClick={unsubscribe}>
                        Atsisakyti
                      </button>
                    )}
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <button className="btn btn-warning" onClick={() => setIsEditing(true)}>
                    Redaguoti profilį
                  </button>
                </div>
              </div>
            </div>
          </div>

        )}
      </div>

      {/* Reservations Section */}
      {localStorage.getItem("userRole") === "client" && (
        <section>
          <h3>Mano rezervacijos</h3>
          {sortedReservations.length === 0 ? (
            <p>Nėra rezervacijų</p>
          ) : (
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Langas</th>
                  <th>Data ir laikas</th>
                  <th>Statusas</th>
                  <th>Veiksmai</th>
                </tr>
              </thead>
              <tbody>
                {sortedReservations.map((r) => (
                  <tr key={r.reservationId}>
                    <td>{r.reservationId}</td>
                    <td>{r.timeSlotId}</td>
                    <td>{formatDate(r.reservationDate)}</td>
                    <td>{r.status}</td>
                    <td>
                      <button
                        className="btn btn-delete btn-sm"
                        onClick={() => {
                          setPendingCancelId(r.reservationId);
                          setOpenCancelDialog(true);
                        }}
                      >
                        Atšaukti
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
            <DialogTitle>Patvirtinimas</DialogTitle>
            <DialogContent>
              <p>Ar tikrai norite atšaukti šią rezervaciją?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCancelDialog(false)}>Ne</Button>
              <Button onClick={confirmCancel} color="error">
                Taip
              </Button>
            </DialogActions>
          </Dialog>
        </section>
      )}

      {/* Applications Section */}
      <section>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3>{showHistory ? "Prašymų istorija" : "Mano prašymai"}</h3>
          {historyApps.length > 0 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Rodyti aktyvius prašymus" : "Prašymų istorija"}
            </button>
          )}
        </div>
        {(showHistory ? historyApps : activeApps).length === 0 ? (
          <p>{showHistory ? "Nėra istorinių prašymų" : "Nėra pateiktų prašymų"}</p>
        ) : (
          <div className="application-list">
            {(showHistory ? historyApps : activeApps).map((app) => (
              <div key={app.id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <h5 className="card-title">{getFormTitle(app.formType)}</h5>
                  <p className="card-text mb-1">
                    <strong>Pateikta:</strong> {formatDate(app.date)}
                  </p>
                  <p className="card-text">
                    <strong>Būsena:</strong> {app.status?.name || "Nežinoma būsena"}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/application-list/${app.formType}/${app.id}`)}
                  >
                    Peržiūrėti
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
