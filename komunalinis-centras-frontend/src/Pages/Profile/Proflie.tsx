import React, { useState, useEffect } from "react";
import { ENDPOINTS } from "../Config/Config";
import '../styles.css';

// Vartotojo duomenų tipas pagal DB modelį
type User = {
  userId: number;
  roleId: number;
  firstName: string;
  lastName: string;
  username: string;
  userPassword: string; // Paprastai slaptažodžių nerodykite – tai tik pavyzdys
  address: string;
  phone: string;
  email: string;
};

// Rezervacijos tipas – pritaikykite pagal savo duomenų bazės struktūrą
type Reservation = {
  reservationId: number;
  userId: number;
  timeSlotId: number;
  reservationDate: string;
  status: string;
  topicId: number;
};

const UserProfile: React.FC = () => {
  // Naudotojo informacija
  const [user, setUser] = useState<User | null>(null);
  // Redagavimo režimo valdymas
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Laikinai saugomi redaguojami laukai
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Rezervacijų sąrašas
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Pvz., nustatytas naudotojo ID – realiame projekte imkite iš autentifikacijos (JWT, sesijos ir pan.)
  const currentUserId = 1;

  // Pakraunami naudotojo duomenys
  useEffect(() => {
    fetch(`${ENDPOINTS.USERS}/${currentUserId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nepavyko gauti vartotojo duomenų.");
        }
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setAddress(data.address);
        setPhone(data.phone);
        setEmail(data.email);
      })
      .catch((err) => {
        console.error("Klaida gaunant vartotojo duomenis:", err);
      });
  }, [currentUserId]);

  // Pakraunami naudotojo rezervacijos – darant prielaidą, kad backend palaiko filtravimą pagal userId
  useEffect(() => {
    fetch(`${ENDPOINTS.RESERVATIONS}?userId=${currentUserId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nepavyko gauti rezervacijų.");
        }
        return res.json();
      })
      .then((data: Reservation[]) => {
        setReservations(data);
      })
      .catch((err) => {
        console.error("Klaida gaunant rezervacijas:", err);
      });
  }, [currentUserId]);

  // Jei duomenys dar nėra įkrauti, rodome užkrovimo žinutę – taip užtikriname, kad vėlesniose renderiuojamuose elementuose user tikrai bus ne null.
  if (!user) {
    return (
      <div className="container user-profile">
        <h2>Naudotojo profilis</h2>
        <p>Kraunama...</p>
      </div>
    );
  }

  // Funkcija atnaujinti naudotojo duomenis
  const handleSaveClick = () => {
    const updatedUser: User = {
      ...user,
      firstName,
      lastName,
      address,
      phone,
      email,
    };

    fetch(`${ENDPOINTS.USERS}/${user.userId}`, {
      method: "PUT", // arba PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nepavyko atnaujinti vartotojo duomenų.");
        }
        // Jei backend grąžina 204 (No Content), grąžiname updatedUser objektą
        if (res.status === 204) {
          return updatedUser;
        }
        return res.json();
      })
      .then((data: User) => {
        console.log("Vartotojo duomenys atnaujinti:", data);
        setUser(data);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Klaida atnaujinant vartotojo duomenis:", err);
      });
  };

  // Atšaukti redagavimą – grąžinti lauko reikšmes į pradinius duomenis
  const handleCancelClick = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAddress(user.address);
    setPhone(user.phone);
    setEmail(user.email);
    setIsEditing(false);
  };

  // Rezervacijos atšaukimo funkcija
  const cancelReservation = (reservationId: number) => {
    fetch(`${ENDPOINTS.RESERVATIONS}/${reservationId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nepavyko atšaukti rezervacijos.");
        }
        if (res.status === 204) {
          return {};
        }
        return res.json();
      })
      .then(() => {
        // Pašaliname atšauktą rezervaciją iš sąrašo
        setReservations((prev) =>
          prev.filter(
            (reservation) => reservation.reservationId !== reservationId
          )
        );
      })
      .catch((err) => {
        console.error("Klaida atšaukiant rezervaciją:", err);
      });
  };

  return (
    <div className="container user-profile">
      <h2>Naudotojo profilis</h2>

      {/* Profilio kortelė */}
      <div className="card">
        {isEditing ? (
          <div className="form">
            <div className="form-group">
              <label>Vardas:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Pavardė:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Adresas:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Telefonas:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>El. paštas:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button className="btn" onClick={handleSaveClick}>
                Išsaugoti
              </button>
              <button className="btn btn-delete" onClick={handleCancelClick}>
                Atšaukti
              </button>
            </div>
          </div>
        ) : (
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
              <strong>Telefonas:</strong> {user.phone}
            </p>
            <p>
              <strong>El. paštas:</strong> {user.email}
            </p>
            <button className="btn" onClick={() => setIsEditing(true)}>
              Redaguoti
            </button>
          </div>
        )}
      </div>

      {/* Rezervacijų sąrašo rodymas */}
      <h3>Mano rezervacijos</h3>
      {reservations.length === 0 ? (
        <p>Nėra rezervacijų</p>
      ) : (
        <div className="table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Rezervacijos ID</th>
                <th>Laiko lango ID</th>
                <th>Rezervacijos data</th>
                <th>Statusas</th>
                <th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.reservationId}>
                  <td>{reservation.reservationId}</td>
                  <td>{reservation.timeSlotId}</td>
                  <td>
                    {new Date(reservation.reservationDate).toLocaleString()}
                  </td>
                  <td>{reservation.status}</td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() =>
                        cancelReservation(reservation.reservationId)
                      }
                    >
                      Atšaukti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
