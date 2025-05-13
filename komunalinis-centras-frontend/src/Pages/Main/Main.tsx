import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles.css";
import "./workerDropDown.css"
import {
  getLocations,
  getWasteTypes,
  getSchedules,
  getUser,
  subscribeUser,            // ⇠ ADD
} from "../Axios/apiServises";

/* ============================================================
 * DTO types
 * ==========================================================*/
export type LocationDto = { locationId: number; locationName: string };
export type WasteTypeDto = { wasteId: number; wasteName: string };
export type ScheduleDto = {
  scheduleId: number;
  locationId: number;
  wasteId: number;
  collectionDate: string;
};
export type UserDto = {
  id: string;
  address: string;
  subscription: boolean;     // ⇠ ensure backend returns this field
};

/* ============================================================
 * Spalvos & pavadinimai
 * ==========================================================*/
const wasteColor: Record<string, string> = {
  Household: "#71C568",
  "Plastic/Metal/Paper": "#F4C542",
  Glass: "#3AA3E4",
};
const wasteNameLt: Record<string, string> = {
  Household: "Buitinės atliekos",
  "Plastic/Metal/Paper": "Plastikas/Metalai/Popierius",
  Glass: "Stiklas",
};
const getColor = (n: string) => wasteColor[n] ?? "#ccc";
const getNameLt = (n: string) => wasteNameLt[n] ?? n;

/* ============================================================
 * Circular progress (palikta iš tavo kodo, jei naudojama kitur)
 * ==========================================================*/
interface CircularProgressProps {
  progress: number;
}
const CircularProgress: React.FC<CircularProgressProps> = ({ progress }) => {
  const r = progress <= 50 ? progress * 3.6 : 180;
  const l = progress > 50 ? (progress - 50) * 3.6 : 0;
  return (
    <div className="circular-progress" data-progress={progress}>
      <div className="circle right">
        <div className="progress" style={{ transform: `rotate(${r}deg)` }} />
      </div>
      <div className="circle left">
        <div className="progress" style={{ transform: `rotate(${l}deg)` }} />
      </div>
      <div className="number">
        <span>{progress}</span>
      </div>
    </div>
  );
};

/* ============================================================
 * JWT helper: extract GUID (string) user id
 * ==========================================================*/
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    const id = decoded.userId ?? decoded.id ?? decoded.sub ?? decoded.nameid;
    return id ? String(id) : null;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
};

/* ============================================================
 * MAIN COMPONENT
 * ==========================================================*/
const Main: React.FC = () => {
  /* --- state declarations --- */
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [wasteTypes, setWasteTypes] = useState<Map<number, WasteTypeDto>>(new Map());
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<number | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);        // ⇠ SAVE full user

  const [username, setUsername] = useState<string>("Svečias");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  /* --- read JWT once on mount --- */
  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  /* --- calendar computations (unchanged) --- */
  const [viewDate, setViewDate] = useState<Date>(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstWeekday = firstDay.getDay() || 7;
  const totalCells = Math.ceil((firstWeekday - 1 + daysInMonth) / 7) * 7;
  const monthLabel = viewDate.toLocaleDateString("lt-LT", { year: "numeric", month: "long" });
  const changeMonth = (d: number) => setViewDate(v => new Date(v.getFullYear(), v.getMonth() + d, 1));

  /* --- INIT: Locations + WasteTypes --- */
  useEffect(() => {
    Promise.all([getLocations(), getWasteTypes()])
      .then(([locs, wastes]) => {
        setLocations(locs);
        setWasteTypes(new Map<number, WasteTypeDto>(wastes.map((w: WasteTypeDto): [number, WasteTypeDto] => [w.wasteId, w])));
      })
      .catch(console.error);
  }, []);

  /* --- USER & auto‑select address --- */
  useEffect(() => {
    if (!currentUserId || locations.length === 0) return;

    getUser(currentUserId)
      .then((u: UserDto) => {
        setUser(u);                                        // ⇠ save user
        if (!u.address) return;
        const addrWords = u.address.toLowerCase().split(/[,\s]+/);
        const match = locations.find(l => addrWords.includes(l.locationName.toLowerCase()));
        if (match) setSelectedLoc(match.locationId);
      })
      .catch(console.error);
  }, [currentUserId, locations]);

  /* --- Schedules by selectedLoc --- */
  useEffect(() => {
    if (selectedLoc == null) { setSchedules([]); return; }
    getSchedules()
      .then((all: ScheduleDto[]) => setSchedules(all.filter((s: ScheduleDto) => s.locationId === selectedLoc)))
      .catch(console.error);
  }, [selectedLoc]);

  /* --- Auth display name --- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      const fullName = `${decoded.firstName || ""} ${decoded.lastName || ""}`.trim(); 
      setUsername(fullName || "Svečias");
      setIsLoggedIn(true);
    } catch {
      setUsername("Svečias");
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");  
    localStorage.removeItem("userRole"); 
    window.location.reload();
  };

  /* --- helper: date -> WasteType[] --- */
  const dateWts = new Map<string, WasteTypeDto[]>();
  schedules.forEach((s: ScheduleDto) => {
    const key = s.collectionDate.split("T")[0];
    const [y, m] = key.split("-").map(Number);
    if (y === viewDate.getFullYear() && m === viewDate.getMonth() + 1) {
      const wt = wasteTypes.get(s.wasteId);
      if (!wt) return;
      const list = dateWts.get(key) ?? [];
      list.push(wt);
      dateWts.set(key, list.slice(0, 3));
    }
  });

  /* ============================================================
   * RENDER
   * ==========================================================*/
  return (
    <div>
      {/* HEADER */}
      <header>
        <div className="header-left"><h1>KPC</h1></div>
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

      {/* NAV (nekeista) */}
      <nav>
        <ul> 
          {localStorage.getItem("userRole") === "Client" && (
            <>
            <li><Link to="/invoices">Sąskaitos</Link></li>
            <li><Link to="/application">Prašymai</Link></li>
            <li><Link to="/reservation">Rezervacijos</Link></li>
            </> 
          )}
          {localStorage.getItem("userRole") === "Worker" && (   
            <>
            <li className="worker-menu">
              <div className="worker-menu-button">Darbuotojas ☰</div>
              <div className="worker-dropdown">  
                <Link to="/addTime">Pridėti laiką</Link>
                <Link to="/register-worker">Registruoti darbuotoją</Link>
                <Link to="/worker-list">Darbuotojų sąrašas</Link>
                <Link to="/application-list">Prašymų sąrašas</Link>
                <Link to="/residents">Gyventojų sąrašas</Link>
              </div> 
            </li>   
            <li><Link to="/addTime">Pridėti laiką</Link></li> 
            <li><Link to="/register-worker">Registruoti darbuotoją</Link></li> 
            <li><Link to="/worker-list">Darbuotojų sąrašas</Link></li>
            <li><Link to="/application-list">Prašymų sąrašas</Link></li>
            <li><Link to="/residents">Gyventojų sąrašas</Link></li>
            </>
            
          )}

            <>
            <li><Link to="/invoices">Sąskaitos</Link></li>
            <li><Link to="/application">Prašymai</Link></li>
            <li><Link to="/reservation">Rezervacijos</Link></li>
            </> 

            <>
            <li className="worker-menu">
              <div className="worker-menu-button">Darbuotojas ☰</div>
              <div className="worker-dropdown">  
                <Link to="/addTime">Pridėti laiką</Link>
                <Link to="/register-worker">Registruoti darbuotoją</Link>
                <Link to="/worker-list">Darbuotojų sąrašas</Link>
                <Link to="/application-list">Prašymų sąrašas</Link>
                <Link to="/residents">Gyventojų sąrašas</Link>
              </div> 
            </li>   
            {/* <li><Link to="/addTime">Pridėti laiką</Link></li> 
            <li><Link to="/register-worker">Registruoti darbuotoją</Link></li> 
            <li><Link to="/worker-list">Darbuotojų sąrašas</Link></li>
            <li><Link to="/application-list">Prašymų sąrašas</Link></li>
            <li><Link to="/residents">Gyventojų sąrašas</Link></li> */}
            </>
            
          
        </ul>
      </nav>

      <main>
      {/* SKELBIMAI */}
        <section className="skelbimai">
          <h2>Skelbimai</h2>
          <ul>
            <li>Dievagojasi kad nenurauta</li>
            <li>Parduodamas garažas</li>
            <li>Nuomojamas 2 kambarių butas</li>
            <li>Automobilio dalys už gerą kainą</li>
          </ul>
        </section>

        {/* ATLIEKŲ GRAFIKAS */}
        <section className="atliek-isvezimas">
          <h2>Atliekų išvežimas</h2>
          <select value={selectedLoc ?? ""} onChange={e => setSelectedLoc(+e.target.value || null)}>
            <option value="">– Pasirinkite gyvenvietę –</option>
            {locations.map(l => <option key={l.locationId} value={l.locationId}>{l.locationName}</option>)}
          </select>

          {selectedLoc && (
            <>
              <div className="calendar">
                <div className="cal-header">
                  <button onClick={() => changeMonth(-1)}>◀</button>
                  <h3>{monthLabel}</h3>
                  <button onClick={() => changeMonth(1)}>▶</button>
                </div>

                <table>
                  <thead><tr><th>P</th><th>A</th><th>T</th><th>K</th><th>Pn</th><th>Š</th><th>S</th></tr></thead>
                  <tbody>
                    {Array.from({ length: totalCells / 7 }, (_, row) => (
                      <tr key={row}>{Array.from({ length: 7 }, (_, col) => {
                        const cell = row * 7 + col;
                        const day = cell - (firstWeekday - 2);
                        if (day < 1 || day > daysInMonth) return <td key={col}></td>;
                        const key = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const wts = dateWts.get(key);
                        let style: React.CSSProperties = {};
                        if (wts?.length) {
                          if (wts.length === 1) {
                            style.backgroundColor = getColor(wts[0].wasteName);
                          } else {
                            const pct = 100 / wts.length;
                            const stops = wts.map((wt, i) => `${getColor(wt.wasteName)} ${i * pct}% ${(i + 1) * pct}%`).join(", ");
                            style.backgroundImage = `linear-gradient(to bottom, ${stops})`;
                          }
                        }
                        return <td key={col} style={style}>{day}</td>;
                      })}</tr>
                    ))}
                  </tbody>
                </table>

                <div className="legend">
                  {Array.from(wasteTypes.values()).map(w => (
                    <div key={w.wasteId} className="legend-item">
                      <span className="legend-color" style={{ background: getColor(w.wasteName) }} />
                      {getNameLt(w.wasteName)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prenumeruoti grafikos mygtukas */}
              {user && !user.subscription && ( 
                <div className="subscribe-wrapper">
                  <button
                    className="btn btn-subscribe"
                    onClick={async () => {
                      try {
                        await subscribeUser(user.id);
                        setUser({ ...user, subscription: true });
                        alert("Prenumerata įjungta! Dabar gausite priminimus el. paštu.");
                      } catch (err) {
                        console.error(err);
                        alert("Nepavyko užsiprenumeruoti. Bandykite dar kartą.");
                      }
                    }}
                  >
                    <span className="bell" />
                    Prenumeruoti grafiką
                  </button> 
                </div>
              )}

              {user && user.subscription && (
                <p className="text-green-700 font-medium mt-3">
                  Prenumerata aktyvuota – priminimai bus siunčiami el. paštu.
                </p>
              )}
            </>
          )}
        </section>

        {/* KONTAKTAI */}
        <section className="kontaktai">
          <h2>Kontaktai</h2>
          <ul>
            <li>El. paštas: info@fake-mail.lt</li>
            <li>Tel.: +370 600 00000</li>
            <li>Adresas: Vilniaus g. 10, Vilnius</li>
            <li>Darbo laikas: I–V 8:00–17:00</li>
          </ul>
        </section>
      </main>

      <footer><p>© 2025 KPC. Visos teisės saugomos.</p></footer>
    </div>
  );
};

export default Main;
