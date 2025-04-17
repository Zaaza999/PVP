import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

/* ======= DTO tipai ======= */
type LocationDto = { locationId: number; locationName: string; };
type WasteTypeDto = { wasteId: number; wasteName: string };
type ScheduleDto = {
  scheduleId: number;
  locationId: number;
  wasteId: number;
  collectionDate: string; // ISO string
};

/* ======= 3 atliekų tipų spalvos ======= */
const wasteColor: Record<string, string> = {
  Household: '#71C568',
  'Plastic/Metal/Paper': '#F4C542',
  Glass: '#3AA3E4',
};
const getColor = (name: string) => wasteColor[name] ?? '#ccc';

/* ======= Circular progress (palikta) ======= */
interface CircularProgressProps { progress: number; }
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

/* ======= Main ======= */
const App: React.FC = () => {
  /* --- state --- */
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [wasteTypes, setWasteTypes] = useState<Map<number, WasteTypeDto>>(new Map());
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [selectedLocId, setSelectedLocId] = useState<number | null>(null);

  /* Mėnesio valdymas */
  const [viewDate, setViewDate] = useState<Date>(() => new Date(2025, 2, 1)); // default kovas 2025
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstWeekday = (firstDay.getDay() || 7); // 1=Mon…7=Sun
  const totalCells = Math.ceil((firstWeekday - 1 + daysInMonth) / 7) * 7;

  const changeMonth = (delta: number) => {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  };

  /* INIT: Locations + WasteTypes */
  useEffect(() => {
    fetch('http://localhost:5190/Locations')
      .then(r => r.json()).then(setLocations)
      .catch(e => console.error(e));

    fetch('http://localhost:5190/WasteTypes')
      .then(r => r.json())
      .then((data: WasteTypeDto[]) => {
        const map = new Map<number, WasteTypeDto>();
        data.forEach(w => map.set(w.wasteId, w));
        setWasteTypes(map);
      });
  }, []);

  /* Užkrauti grafikus pasirinktai lokacijai */
  useEffect(() => {
    if (selectedLocId == null) { setSchedules([]); return; }
    fetch(`http://localhost:5190/GarbageCollectionSchedules?locationId=${selectedLocId}`)
      .then(r => r.json())
      .then(setSchedules)
      .catch(e => console.error(e));
  }, [selectedLocId]);

  /* Map YYYY-MM-DD -> WasteType */
  const dateWt = new Map<string, WasteTypeDto>();
  schedules.forEach(s => {
    const [y, m, d] = s.collectionDate.split('T')[0].split('-');
    if (+y === viewDate.getFullYear() && +m === viewDate.getMonth() + 1) {
      const wt = wasteTypes.get(s.wasteId);
      if (wt) dateWt.set(s.collectionDate.split('T')[0], wt);
    }
  });

  const headerLabel = viewDate.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' });

  return (
    <div>
      {/* HEADER, MENU (kaip buvo) */}
      <header>
        <div className="header-left"><h1>KPC</h1></div>
        <div className="header-right">
          <CircularProgress progress={70} />
          <span>Vartotojas</span>
          <div className="dropdown">
            <button className="dropbtn">[ ]</button>
            <div className="dropdown-content">
              <a><Link to="/profile">Profilis</Link></a>
              <a>Atsijungti</a>
            </div>
          </div>
        </div>
      </header>
      <nav>
        <ul>
          <li><a>Forumai</a></li><li><a>Sąskaitos</a></li>
          <li><Link to="/application">Prašymai</Link></li>
          <li><Link to="/reservation">Rezervacijos</Link></li>
          <li><Link to="/addTime">Pridėti laiką</Link></li>
        </ul>
      </nav>

      <main>
        {/* SKELBIMAI */}
        <section className="skelbimai">
          <h2>Skelbimai</h2>
          <ul>
            <li>Dievagojasi kad nenurauta 8======D</li><li>Parduodamas garažas</li>
            <li>Nuomojamas 2 kambarių butas</li><li>Automobilio dalys už gerą kainą</li>
          </ul>
        </section>

        {/* ATLIEKŲ IŠVEŽIMAS */}
        <section className="atliek-isvezimas">
          <h2>Atliekų išvežimas</h2>

          <select value={selectedLocId ?? ''} onChange={e => setSelectedLocId(+e.target.value || null)}>
            <option value="">– Pasirinkite gyvenvietę –</option>
            {locations.map(l => <option key={l.locationId} value={l.locationId}>{l.locationName}</option>)}
          </select>

          {selectedLocId && (
            <div className="calendar">
              <div className="cal-header">
                <button onClick={() => changeMonth(-1)}>◀</button>
                <h3>{headerLabel}</h3>
                <button onClick={() => changeMonth(1)}>▶</button>
              </div>

              <table>
                <thead><tr><th>P</th><th>A</th><th>T</th><th>K</th><th>Pn</th><th>Š</th><th>S</th></tr></thead>
                <tbody>
                  {Array.from({ length: totalCells / 7 }, (_, row) => (
                    <tr key={row}>
                      {Array.from({ length: 7 }, (_, col) => {
                        const cell = row * 7 + col;
                        const day = cell - (firstWeekday - 2);
                        if (day < 1 || day > daysInMonth) return <td key={col}></td>;

                        const key = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const wt = dateWt.get(key);
                        return (
                          <td key={col} style={{ backgroundColor: wt ? getColor(wt.wasteName) : 'transparent' }}>
                            {day}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Legenda */}
              <div className="legend">
                {Array.from(wasteTypes.values()).map(w => (
                  <div key={w.wasteId} className="legend-item">
                    <span className="legend-color" style={{ background: getColor(w.wasteName) }}></span>
                    {w.wasteName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* KONTAKTAI */}
        <section className="kontaktai">
          <h2>Kontaktai</h2>
          <ul>
            <li>El. paštas: info@fake-mail.lt</li><li>Tel.: +370 600 00000</li>
            <li>Adresas: Vilniaus g. 10, Vilnius</li><li>Darbo laikas: I–V 8:00–17:00</li>
          </ul>
        </section>
      </main>

      <footer><p>© 2025 KPC. Visos teisės saugomos.</p></footer>
    </div>
  );
};

export default App;
