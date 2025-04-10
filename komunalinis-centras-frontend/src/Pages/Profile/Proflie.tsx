import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "../Config/Config";

/** Vartotojo tipas (pagal jūsų duomenų bazę) */
type User = {
  userId: number;
  roleId: number;
  firstName: string;
  lastName: string;
  username: string;
  userPassword: string; // Paprastai slaptažodžių viešai nerodome, čia tik pavyzdys
  address: string;
  phone: string;
  email: string;
};

const UserProfile: React.FC = () => {
  // Čia saugosime duomenis, užkrautus iš serverio
  const [user, setUser] = useState<User | null>(null);

  // Ar leidžiame redaguoti laukus
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Laikinos būsenos, skirtos redagavimui (jei norime leisti atnaujinti duomenis)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Pvz., prisijungusio vartotojo ID – realiame projekte gali būti iš session, JWT, route param ir t. t.
  const currentUserId = 1;

  /** Komponentui užsikrovus, kreipiamės į API, kad gautume vartotojo duomenis */
  useEffect(() => {
    fetch(`${ENDPOINTS.USERS}/${currentUserId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nepavyko gauti vartotojo informacijos.");
        }
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        // Užpildome ir laikinus laukus
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

  /** Paspaudus „Redaguoti“ -> leidžiame koreguoti laukus */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /** Paspaudus „Išsaugoti“ -> POST ar PUT užklausa į serverį */
  const handleSaveClick = () => {
    if (!user) return;

    // Sudedame atnaujintas reikšmes į vieną objektą
    const updatedUser = {
      ...user,
      firstName,
      lastName,
      address,
      phone,
      email,
    };

    // Jei turite atskirą endpoint'ą keitimui: pvz., PATCH /Users/{id} arba PUT /Users/{id}
    fetch(`${ENDPOINTS.USERS}/${user.userId}`, {
        method: "PUT", // arba PATCH, priklausomai nuo jūsų API
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

  /** Jei norime atšaukti redagavimą be išsaugojimo */
  const handleCancelClick = () => {
    if (!user) return;
    // Grąžiname formą į pradinius duomenis
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAddress(user.address);
    setPhone(user.phone);
    setEmail(user.email);
    setIsEditing(false);
  };

  return (
    <div className="container">
      <h2>Naudotojo profilis</h2>

      {!user ? (
        <p>Kraunama...</p>
      ) : (
        <div className="card">
          <div className="form">
            {/* 
              Čia, jeigu norite rodyti username, role ar kita, galite pridėti 
              <p>Vartotojo vardas: {user.username}</p>
              <p>Rolė (ID): {user.roleId}</p>
              ...
            */}

            <div className="form-group">
              <label>Vardas:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              ) : (
                <p>{user.firstName}</p>
              )}
            </div>

            <div className="form-group">
              <label>Pavardė:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              ) : (
                <p>{user.lastName}</p>
              )}
            </div>

            <div className="form-group">
              <label>Adresas:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              ) : (
                <p>{user.address}</p>
              )}
            </div>

            <div className="form-group">
              <label>Telefonas:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              ) : (
                <p>{user.phone}</p>
              )}
            </div>

            <div className="form-group">
              <label>El. paštas:</label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>

            {!isEditing ? (
              <button className="btn" onClick={handleEditClick}>
                Redaguoti
              </button>
            ) : (
              <div>
                <button className="btn" onClick={handleSaveClick}>
                  Išsaugoti
                </button>
                <button className="btn btn-delete" onClick={handleCancelClick}>
                  Atšaukti
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
