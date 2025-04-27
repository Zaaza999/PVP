import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import '../styles.css';
import {
  getLocations,
  getWasteTypes,
  getSchedules,
  getUser              // <- naujas kvietimas
} from '../Axios/apiServises';

/* ====== DTO tipai ====== */
type LocationDto  = { locationId: number; locationName: string };
type WasteTypeDto = { wasteId: number;   wasteName: string };
type ScheduleDto  = { scheduleId: number; locationId: number; wasteId: number; collectionDate: string };
type UserDto      = { userId: number; address: string };

/* ====== Atliekų spalvos & LT pavadinimai ====== */
const wasteColor: Record<string, string> = {
  Household: '#71C568',
  'Plastic/Metal/Paper': '#F4C542',
  Glass: '#3AA3E4'
};
const wasteNameLt: Record<string, string> = {
  Household: 'Buitinės atliekos',
  'Plastic/Metal/Paper': 'Plastikas/Metalai/Popierius',
  Glass: 'Stiklas'
};
const getColor  = (n: string) => wasteColor[n]   ?? '#ccc';
const getNameLt = (n: string) => wasteNameLt[n] ?? n;

/* ====== Circular progress ====== */
interface CircularProgressProps { progress: number }
const CircularProgress: React.FC<CircularProgressProps> = ({ progress }) => {
  const r = progress <= 50 ? progress * 3.6 : 180;
  const l = progress > 50 ? (progress - 50) * 3.6 : 0;
  return (
    <div className="circular-progress" data-progress={progress}>
      <div className="circle right"><div className="progress" style={{ transform: `rotate(${r}deg)` }} /></div>
      <div className="circle left"><div className="progress" style={{ transform: `rotate(${l}deg)` }} /></div>
      <div className="number"><span>{progress}</span></div>
    </div>
  );
};

/* ====== Norimas naudotojo ID ====== */
const USER_ID = 8;

/* ====== Main ====== */
const App: React.FC = () => {
  /* --- global state --- */
  const [locations,  setLocations]  = useState<LocationDto[]>([]);
  const [wasteTypes, setWasteTypes] = useState<Map<number, WasteTypeDto>>(new Map());
  const [schedules,  setSchedules]  = useState<ScheduleDto[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<number | null>(null);
  const [username, setUsername] = useState<string>('Svečias');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  /* --- mėnesio valdymas (start = dabartinis) --- */
  const [viewDate, setViewDate] = useState<Date>(() => {
    const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const firstDay     = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const daysInMonth  = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstWeekday = firstDay.getDay() || 7;
  const totalCells   = Math.ceil((firstWeekday - 1 + daysInMonth) / 7) * 7;
  const monthLabel   = viewDate.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' });
  const changeMonth  = (d: number) => setViewDate(v => new Date(v.getFullYear(), v.getMonth() + d, 1));

  /* === INIT: Locations, WasteTypes, User === */
  useEffect(() => {
    Promise.all([getLocations(), getWasteTypes()])
      .then(([locs, wastes]: [LocationDto[], WasteTypeDto[]]) => {
        setLocations(locs);

        const map = new Map<number, WasteTypeDto>();
        wastes.forEach((w: WasteTypeDto) => map.set(w.wasteId, w));   // <-- tipas deklaruotas
        setWasteTypes(map);

        return Promise.all([getUser(USER_ID), locs]);                 // perduodame locs toliau
      })
      .then(([user, locs]: [UserDto, LocationDto[]]) => {
        if (!user?.address) return;

        const addrWords = user.address.toLowerCase().split(/[\s,]+/);
        const match = locs.find(l => addrWords.includes(l.locationName.toLowerCase()));
        if (match) setSelectedLoc(match.locationId);
      })
      .catch(console.error);
  }, []);

  /* === Schedules === */
  useEffect(() => {
    if (selectedLoc == null) { setSchedules([]); return; }
    getSchedules()
      .then((all: ScheduleDto[]) => setSchedules(all.filter(s => s.locationId === selectedLoc)))
      .catch(console.error);
  }, [selectedLoc]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const fullName = `${decoded.firstName || ""} ${decoded.lastName || ""}`.trim();
        setUsername(fullName || "Svečias");
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Invalid token:", e);
        setUsername("Svečias");
        setIsLoggedIn(false);
      }
    } else {
      setUsername("Svečias");
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  /* === Map date -> WasteType[] (max 3) === */
  const dateWts = new Map<string, WasteTypeDto[]>();
  schedules.forEach((s: ScheduleDto) => {
    const key = s.collectionDate.split('T')[0];
    const [y, m] = key.split('-').map(Number);
    if (y === viewDate.getFullYear() && m === viewDate.getMonth() + 1) {
      const wt = wasteTypes.get(s.wasteId);
      if (!wt) return;
      const list = dateWts.get(key) ?? [];
      list.push(wt);
      dateWts.set(key, list.slice(0, 3));
    }
  });

  /* === JSX === */
  return (
    <div>
      {/* ---------- HEADER ---------- */}
      <header>
        <div className="header-left"><h1>KPC</h1></div>
        <div className="header-right">
          <CircularProgress progress={70} />
          <span>{username}</span>
          {isLoggedIn ? (
              <div className="dropdown">
                <button className="dropbtn">[ ☰ ]</button>
                <div className="dropdown-content">
                  <Link to="/profile">Profilis</Link>
                  <Link to="/" onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}>Atsijungti</Link>
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

      {/* ---------- MENIU ---------- */}
      <nav>
        <ul>
          <li><a>Forumai</a></li>
          <li><a>Sąskaitos</a></li>
          <li><Link to="/application">Prašymai</Link></li>
          <li><Link to="/reservation">Rezervacijos</Link></li>
          <li><Link to="/addTime">Pridėti laiką</Link></li>
        </ul>
      </nav>

      <main>
        {/* ---------- SKELBIMAI ---------- */}
        <section className="skelbimai">
          <h2>Skelbimai</h2>
          <ul>
            <li>Dievagojasi kad nenurauta</li>
            <li>Parduodamas garažas</li>
            <li>Nuomojamas 2 kambarių butas</li>
            <li>Automobilio dalys už gerą kainą</li>
          </ul>
        </section>

        {/* ---------- ATLIEKŲ GRAFIKAS ---------- */}
        <section className="atliek-isvezimas">
          <h2>Atliekų išvežimas</h2>
          <select value={selectedLoc ?? ''} onChange={e => setSelectedLoc(+e.target.value || null)}>
            <option value="">– Pasirinkite gyvenvietę –</option>
            {locations.map(l =>
              <option key={l.locationId} value={l.locationId}>{l.locationName}</option>
            )}
          </select>

          {selectedLoc && (
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
                    <tr key={row}>
                      {Array.from({ length: 7 }, (_, col) => {
                        const cell = row * 7 + col;
                        const day  = cell - (firstWeekday - 2);
                        if (day < 1 || day > daysInMonth) return <td key={col}></td>;

                        const key = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const wts = dateWts.get(key);
                        let style: React.CSSProperties = {};

                        if (wts?.length) {
                          if (wts.length === 1) {
                            style.backgroundColor = getColor(wts[0].wasteName);
                          } else {
                            const pct = 100 / wts.length;
                            const stops = wts.map((wt, i) =>
                              `${getColor(wt.wasteName)} ${i * pct}% ${(i + 1) * pct}%`
                            ).join(', ');
                            style.backgroundImage = `linear-gradient(to bottom, ${stops})`;
                          }
                        }
                        return <td key={col} style={style}>{day}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* legenda */}
              <div className="legend">
                {Array.from(wasteTypes.values()).map(w => (
                  <div key={w.wasteId} className="legend-item">
                    <span className="legend-color" style={{ background: getColor(w.wasteName) }} />
                    {getNameLt(w.wasteName)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ---------- KONTAKTAI ---------- */}
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

export default App;
