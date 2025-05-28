import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Header: React.FC = () => {
  const [username, setUsername] = useState<string>("Svečias");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const userRole = localStorage.getItem("userRole");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const fullName = `${decoded.firstName || ""} ${decoded.lastName || ""}`.trim(); 
      setUsername(fullName || "Svečias");
      setIsLoggedIn(true);

      const id = decoded.userId ?? decoded.id ?? decoded.sub ?? decoded.nameid;
      setCurrentUserId(id ? String(id) : null);
    } catch {
      setUsername("Svečias");
      setIsLoggedIn(false);
      setCurrentUserId(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5190/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Nepavyko atsijungti. Bandykite dar kartą.');

      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      setIsLoggedIn(false);
      setUsername("Svečias");
      setCurrentUserId(null);

      alert("Sėkmingai atsijungėte!");
      navigate("/login");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Nežinoma klaida';
      console.error("Logout error:", err);
      alert(errorMessage);
    }
  };

  return (
    <>
      <header>
        <Link to="/"><div className="header-left"><h1>KPC</h1></div></Link>
        <div className="header-right">
          <span>{username}</span>
          {isLoggedIn ? (
            <div className="dropdown">
              <button className="dropbtn">[ ☰ ]</button>
              <div className="dropdown-content">
                <Link to="/profile">Profilis</Link>
                <Link to="/" onClick={e => { e.preventDefault(); handleLogout(); }}>Atsijungti</Link>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link">Prisijungti</Link>
              <Link to="/register" className="auth-link">Registruotis</Link>
            </div>
          )}
        </div>
      </header>

      <nav>
        <ul className="nav-bar">
          {userRole === "client" && (
            <>
              <li className="nav-item"><Link to="/invoices" className="nav-link">Sąskaitos</Link></li>
              <li className="nav-item"><Link to="/application" className="nav-link">Prašymai</Link></li>
              <li className="nav-item"><Link to="/reservation" className="nav-link">Rezervacijos</Link></li>
            </>
          )}

          {(userRole?.toLowerCase().includes("worker") || userRole === "admin") && (
            <>
              <li className="nav-item"><Link to="/addTime" className="nav-link">Pridėti laiką</Link></li>
              {(userRole?.toLowerCase().includes("admin")) && (
                <>
                <li className="nav-item dropdown-nav">
                  <span className="nav-link dropbtn block">Darbuotojai ▾</span>
                  <ul className="dropdown-nav-content">
                    <li><Link to="/register-worker" className="nav-link">Registruoti darbuotoją</Link></li>
                    <li><Link to="/worker-list" className="nav-link">Darbuotojų sąrašas</Link></li>
                    <li><Link to="/worker-statistics" className="nav-link">Darbuotojų statistika</Link></li>
                  </ul>
                </li>  
               </>
              )}

              <li className="nav-item"><Link to="/application-list" className="nav-link">Prašymų sąrašas</Link></li>
              <li className="nav-item"><Link to="/residents" className="nav-link">Gyventojų sąrašas</Link></li>

              {currentUserId && (
                <li className="nav-item">
                  <Link to={`/workschedule/${currentUserId}`} className="nav-link">Mano tvarkaraštis</Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>


    </>
  );
};

export default Header;
