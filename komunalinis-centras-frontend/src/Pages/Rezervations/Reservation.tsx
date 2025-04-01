import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

const availableTimes = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
];

// Galimos vizito temos
const topics = [
  'Bendras susitikimas',
  'Konsultacija',
  'Paslaugų užsakymas',
];

// Funkcija, kuri grąžina savaitės pirmadienį pagal nurodytą datą
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Paprasta funkcija dienoms pridėti
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const WeeklyScheduleReservation: React.FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleTimeSlotClick = (day: Date, time: string) => {
    setSelectedDate(day);
    setSelectedTime(time);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Rezervacijos duomenys:", {
      topic: selectedTopic,
      date: selectedDate,
      time: selectedTime,
    });
    setSubmitted(true);
  };

  // Generuojame dienas nuo pirmadienio iki sekmadienio
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  return (
    <div className="weekly-schedule-container">
      <h2>Rezervacija vizitui į centrą</h2>
      {submitted ? (
        <div className="success-message">
          <p>Dėkojame už rezervaciją! Jūsų vizitas patvirtintas.</p>  
            <li>
              <button type="submit"><Link to="/">Atgal</Link></button>
            </li> 
        </div>
      ) : (
        <div>
          <div className="week-navigation">
            <button onClick={handlePreviousWeek}>Ankstesnė savaitė</button>
            <span>
              {currentWeekStart.toLocaleDateString()} - {addDays(currentWeekStart, 6).toLocaleDateString()}
            </span>
            <button onClick={handleNextWeek}>Kita savaitė</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="topic">Pasirinkite vizito temą</label>
              <select
                id="topic"
                name="topic"
                value={selectedTopic}
                onChange={handleTopicChange}
                required
              >
                <option value="">Pasirinkite temą</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
            <table className="schedule-table">
              <thead>
                <tr>
                  {weekDays.map((day, index) => (
                    <th key={index}>
                      {day.toLocaleDateString('lt-LT', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'numeric',
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {availableTimes.map((time, timeIndex) => (
                  <tr key={timeIndex}>
                    {weekDays.map((day, dayIndex) => {
                      const isSelected =
                        selectedDate &&
                        day.toDateString() === selectedDate.toDateString() &&
                        selectedTime === time;
                      return (
                        <td
                          key={dayIndex}
                          className={`time-slot ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleTimeSlotClick(day, time)}
                        >
                          {time}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedDate && selectedTime && (
              <div className="selected-info">
                <p>
                  Pasirinkta data: {selectedDate.toLocaleDateString('lt-LT')} ir laikas: {selectedTime}
                </p>
              </div>
            )}
            <button type="submit" disabled={!(selectedTopic && selectedDate && selectedTime)}>
              Rezervuoti
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleReservation;
