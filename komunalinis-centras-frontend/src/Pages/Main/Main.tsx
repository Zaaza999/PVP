import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import {
  getLocations,
  getWasteTypes,
  getSchedules
} from '../Axios/apiServises';

/* ======= DTO tipai ======= */
type LocationDto = { locationId: number; locationName: string };
type WasteTypeDto = { wasteId: number; wasteName: string };
type ScheduleDto = {
  scheduleId: number;
  locationId: number;
  wasteId: number;
  collectionDate: string; // ISO
};

/* ======= 3 atliekų tipų spalvos ======= */
const wasteColor: Record<string, string> = {
  Household: '#71C568', // žalia
  'Plastic/Metal/Paper': '#F4C542', // geltona
  Glass: '#3AA3E4' // mėlyna
};
const getColor = (name: string) => wasteColor[name] ?? '#ccc';

/* ======= Atliekų pavadinimų vertimai į lietuvių kalbą ======= */
const wasteNameLt: Record<string, string> = {
  Household: 'Buitinės atliekos',
  'Plastic/Metal/Paper': 'Plastikas/Metalai/Popierius',
  Glass: 'Stiklas'
};
const getNameLt = (name: string) => wasteNameLt[name] ?? name;

/* ======= Circular progress komponentas ======= */
interface CircularProgressProps { progress: number }
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
      <div className="number"><span>{progress}</span></div>
    </div>
  );
};

/* ======= Main komponentas ======= */
const App: React.FC = () => {
  /* --- global state --- */
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [wasteTypes, setWasteTypes] = useState<Map<number, WasteTypeDto>>(new Map());
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<number | null>(null);

  /* --- rodomas mėnuo (default = dabartinis) --- */
  const [viewDate, setViewDate] = useState<Date>(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstWeekday = firstDay.getDay() || 7; // 1=Pr … 7=S
  const totalCells = Math.ceil((firstWeekday - 1 + daysInMonth) / 7) * 7;
  const headerLabel = viewDate.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' });
  const changeMonth = (d: number) => setViewDate(v => new Date(v.getFullYear(), v.getMonth() + d, 1));

  /* --- INIT: Locations & WasteTypes --- */
  useEffect(() => {
    getLocations()
      .then((data: LocationDto[]) => setLocations(data))
      .catch(console.error);

    getWasteTypes()
      .then((ws: WasteTypeDto[]) => {
        const m = new Map<number, WasteTypeDto>();
        ws.forEach(w => m.set(w.wasteId, w));
        setWasteTypes(m);
      })
      .catch(console.error);
  }, []);

  /* --- Schedules (atsiunčiame VISUS, filtruojame front-ende) --- */
  useEffect(() => {
    if (selectedLoc == null) {
      setSchedules([]);
      return;
    }

    getSchedules()
      .then((all: ScheduleDto[]) =>
        setSchedules(all.filter(s => s.locationId === selectedLoc))
      )
      .catch(console.error);
  }, [selectedLoc]);

  /* --- YYYY-MM-DD → array< WasteType > --- */
  const dateWts = new Map<string, WasteTypeDto[]>();
  schedules.forEach(s => {
    const key = s.collectionDate.split('T')[0];
    const [y, m] = key.split('-').map(Number);
    if (y === viewDate.getFullYear() && m === viewDate.getMonth() + 1) {
      const wt = wasteTypes.get(s.wasteId);
      if (!wt) return;
      const arr = dateWts.get(key) ?? [];
      arr.push(wt);
      dateWts.set(key, arr.slice(0, 3));
    }
  });

  /* ======= RENDER ======= */
  return (
    <div>
      <header>
        <div className="header-left"><h1>KPC</h1></div>
        <div className="header-right">
          <CircularProgress progress={70} />
          <span>Vartotojas</span>
          <div className="dropdown">
            <button className="dropbtn">[ ]</button>
            <div className="dropdown-content">
              <Link className="dropdown-item" to="/profile">Profilis</Link>
              <button className="dropdown-item" onClick={() => alert('Logout')}>Atsijungti</button>
            </div>
          </div>
        </div>
      </header>

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
        <section className="skelbimai">
          <h2>Skelbimai</h2>
          <ul>
            <li>Dievagojasi kad nenurauta</li>
            <li>Parduodamas garažas</li>
            <li>Nuomojamas 2 kambarių butas</li>
            <li>Automobilio dalys už gerą kainą</li>
          </ul>
        </section>

        <section className="atliek-isvezimas">
          <h2>Atliekų išvežimas</h2>

          <select
            value={selectedLoc ?? ''}
            onChange={e => setSelectedLoc(+e.target.value || null)}
          >
            <option value="">– Pasirinkite gyvenvietę –</option>
            {locations.map(l => (
              <option key={l.locationId} value={l.locationId}>
                {l.locationName}
              </option>
            ))}
          </select>

          {selectedLoc && (
            <div className="calendar">
              <div className="cal-header">
                <button onClick={() => changeMonth(-1)}>◀</button>
                <h3>{headerLabel}</h3>
                <button onClick={() => changeMonth(1)}>▶</button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>P</th><th>A</th><th>T</th><th>K</th><th>Pn</th><th>Š</th><th>S</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: totalCells / 7 }, (_, row) => (
                    <tr key={row}>
                      {Array.from({ length: 7 }, (_, col) => {
                        const cell = row * 7 + col;
                        const day = cell - (firstWeekday - 2);
                        if (day < 1 || day > daysInMonth) return <td key={col}></td>;

                        const key = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const wts = dateWts.get(key);
                        let style: React.CSSProperties = {};
                        if (wts && wts.length) {
                          if (wts.length === 1) {
                            style.backgroundColor = getColor(wts[0].wasteName);
                          } else {
                            const pct = 100 / wts.length;
                            const stops = wts.map((wt, i) => {
                              const c = getColor(wt.wasteName);
                              return `${c} ${i * pct}% ${(i + 1) * pct}%`;
                            }).join(', ');
                            style.backgroundImage = `linear-gradient(to bottom, ${stops})`;
                          }
                        }
                        return <td key={col} style={style}>{day}</td>;
                      })}
                    </tr>
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
          )}
        </section>

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
