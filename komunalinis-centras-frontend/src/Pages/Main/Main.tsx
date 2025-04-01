import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import '../styles.css';

// Duomenys kalendoriaus pažymėjimui
const cityData: { [key: string]: number[] } = {
  Garliava: [3, 7, 9],
  Karmėlava: [4, 8, 12],
  Kulautuva: [1, 10, 20],
};

const days = Array.from({ length: 31 }, (_, i) => i + 1);

// Apskritimo indikatoriaus komponentas
interface CircularProgressProps {
  progress: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress }) => {
  const rightStyle = { transform: progress <= 50 ? `rotate(${progress * 3.6}deg)` : 'rotate(180deg)' };
  const leftStyle = { transform: progress > 50 ? `rotate(${(progress - 50) * 3.6}deg)` : 'rotate(0deg)' };

  return (
    <div className="circular-progress" data-progress={progress}>
      <div className="circle right">
        <div className="progress" style={rightStyle}></div>
      </div>
      <div className="circle left">
        <div className="progress" style={leftStyle}></div>
      </div>
      <div className="number"><span>{progress}</span></div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('');

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div>
      {/* Viršutinė juosta */}
      <header>
        <div className="header-left">
          <h1>KPC</h1>
        </div>
        <div className="header-right">
          <CircularProgress progress={70} />
          <span>Vartotojas</span>
          <div className="dropdown">
            <button className="dropbtn">[ ]</button>
            <div className="dropdown-content">
              <a href="#">Profilis</a>
              <a href="#">Atsijungti</a>
            </div>
          </div>
        </div>
      </header>

      {/* Meniu juosta */}
      <nav>
        <ul>
          <li><a href="#">Forumai</a></li>
          <li><a href="#">Sąskaitos</a></li>
          <li><a href="#">Prašymai</a></li>
          <li>
            <Link to="/reservation">Rezervacijos</Link>
          </li>
        </ul>
      </nav>

      {/* Pagrindinis turinys */}
      <main>
        {/* Skelbimai */}
        <section className="skelbimai">
          <h2>Skelbimai</h2>
          <ul>
            <li>Ieškome santechniko</li>
            <li>Parduodamas garažas</li>
            <li>Nuomojamas 2 kambarių butas</li>
            <li>Automobilio dalys už gerą kainą</li>
          </ul>
        </section>

        {/* Atliekų išvežimas su dropdown ir kalendoriumi */}
        <section className="atliek-isvezimas">
          <h2>Atliekų išvežimas</h2>
          <div className="dropdown">
            <select id="atliekosDropdown" value={selectedCity} onChange={handleCityChange}>
              <option value="">Pasirinkite</option>
              <option value="Garliava">Garliava</option>
              <option value="Karmėlava">Karmėlava</option>
              <option value="Kulautuva">Kulautuva</option>
            </select>
          </div>
          <div className="calendar">
            <h3>Kovas 2025</h3>
            <table>
              <thead>
                <tr>
                  <th>P</th>
                  <th>A</th>
                  <th>T</th>
                  <th>K</th>
                  <th>Pn</th>
                  <th>Š</th>
                  <th>S</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }, (_, weekIndex) => (
                  <tr key={weekIndex}>
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const day = weekIndex * 7 + dayIndex + 1;
                      if (day <= 31) {
                        const highlight = selectedCity && cityData[selectedCity]?.includes(day);
                        return (
                          <td key={day} data-day={day} className={highlight ? 'highlight' : ''}>
                            {day}
                          </td>
                        );
                      } else {
                        return <td key={day}></td>;
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Kontaktai */}
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

      {/* Puslapio apačia */}
      <footer>
        <p>© 2025 KPC. Visos teisės saugomos.</p>
      </footer>
    </div>
  );
};

export default App;
