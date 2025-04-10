// src/Pages/Profile/UserProfile.tsx
import React, { useState, useEffect } from "react";
import { getUser, updateUser, getUserReservations, deleteReservation } from "../Axios/apiServises"; 
import '../styles.css';

type User = {
  userId: number;
  roleId: number;
  firstName: string;
  lastName: string;
  username: string;
  userPassword: string;
  address: string;
  phone: string;
  email: string;
};

type Reservation = {
  reservationId: number;
  userId: number;
  timeSlotId: number;
  reservationDate: string;
  status: string;
  topicId: number;
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const currentUserId = 1; // Pavyzdžiui, nustatytas naudotojo ID

  useEffect(() => {
    getUser(currentUserId)
      .then((data: User) => {
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setAddress(data.address);
        setPhone(data.phone);
        setEmail(data.email);
      })
      .catch(console.error);
      
    getUserReservations(currentUserId)
      .then((data: Reservation[]) => {
        setReservations(data);
      })
      .catch(console.error);
  }, [currentUserId]);

  if (!user) {
    return (
      <div className="container user-profile">
        <h2>Naudotojo profilis</h2>
        <p>Kraunama...</p>
      </div>
    );
  }

  const handleSaveClick = () => {
    const updatedUser = {
      ...user,
      firstName,
      lastName,
      address,
      phone,
      email,
    };

    updateUser(user.userId, updatedUser)
      .then((data: User) => {
        setUser(data);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleCancelClick = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAddress(user.address);
    setPhone(user.phone);
    setEmail(user.email);
    setIsEditing(false);
  };

  // Nauja funkcija rezervacijos trynimui
  const handleDeleteReservation = (reservationId: number) => {
    deleteReservation(reservationId)
      .then(() => {
        // Atnaujiname rezervacijų sąrašą pašalinus ištrintą rezervaciją
        setReservations(prev =>
          prev.filter(reservation => reservation.reservationId !== reservationId)
        );
      })
      .catch(error => {
        console.error("Rezervacijos trinimo klaida:", error);
      });
  };

  return (
    <div className="container user-profile">
      <h2>Naudotojo profilis</h2>
      <div className="card">
        {isEditing ? (
          <div className="form">
            <div className="form-group">
              <label>Vardas:</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Pavardė:</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Adresas:</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Telefonas:</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>El. paštas:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <button className="btn" onClick={handleSaveClick}>Išsaugoti</button>
              <button className="btn btn-delete" onClick={handleCancelClick}>Atšaukti</button>
            </div>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Vardas:</strong> {user.firstName}</p>
            <p><strong>Pavardė:</strong> {user.lastName}</p>
            <p><strong>Adresas:</strong> {user.address}</p>
            <p><strong>Telefonas:</strong> {user.phone}</p>
            <p><strong>El. paštas:</strong> {user.email}</p>
            <button className="btn" onClick={() => setIsEditing(true)}>Redaguoti</button>
          </div>
        )}
      </div>

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
                  <td>{new Date(reservation.reservationDate).toLocaleString()}</td>
                  <td>{reservation.status}</td>
                  <td>
                    {/* Mygtuko atnaujinimas su rezervacijos trynimo funkcija */}
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteReservation(reservation.reservationId)}
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
