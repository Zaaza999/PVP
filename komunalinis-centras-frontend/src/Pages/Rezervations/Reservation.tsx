import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ENDPOINTS } from "../Config/Config"; // Importuojame konfigūracijos konstantas

/** Duomenų tipai **/
type EmployeeTimeSlot = {
  timeSlotId: number;
  employeeId: number;
  slotDate: string;  // gali būti "2025-04-10" arba "2025-04-10T00:00:00"
  timeFrom: string;  // pvz. "09:00:00"
  timeTo: string;    // pvz. "10:00:00"
};

type VisitTopic = {
  topicId: number;
  topicName: string;
  description?: string;
};

/** Pagalbinės funkcijos **/

// Funkcija, kuri grąžina tą pačią datą, bet su laiku 00:00:00
function setToMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Funkcija, kuri randa pirmadienį pagal nurodytą datą
function getMonday(date: Date): Date {
  const temp = setToMidnight(new Date(date));
  const day = temp.getDay();
  const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(temp.setDate(diff));
}

// Funkcija, kuri prideda n dienų prie datos (laikas lieka 00:00:00)
function addDays(date: Date, days: number): Date {
  const d = setToMidnight(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Pagrindinis komponentas **/
const WeeklyScheduleReservation: React.FC = () => {
  // Savaitės pradžia
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getMonday(new Date())
  );

  // Gaunami laiko langai ir vizito temos
  const [employeeTimeSlots, setEmployeeTimeSlots] = useState<EmployeeTimeSlot[]>([]);
  const [topics, setTopics] = useState<VisitTopic[]>([]);

  // Pasirinkimai rezervacijai
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);  // saugoma data formatu "YYYY-MM-DD"
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  // Ar rezervacija atlikta sėkmingai?
  const [submitted, setSubmitted] = useState(false);

  // Hardcodintas user ID (gali būti pakeistas pagal poreikį)
  const currentUserId = 1;

  /** useEffect: gaunami duomenys iš API **/
  useEffect(() => {
    // Gaunami laiko langai
    fetch(ENDPOINTS.EMPLOYEE_TIME_SLOTS)
      .then(resp => resp.json())
      .then((data: EmployeeTimeSlot[]) => setEmployeeTimeSlots(data))
      .catch(err => console.error("Klaida gaunant laiko langus:", err));

    // Gaunami vizito temų duomenys
    fetch(ENDPOINTS.VISIT_TOPICS)
      .then(resp => resp.json())
      .then((data: VisitTopic[]) => setTopics(data))
      .catch(err => console.error("Klaida gaunant temų sąrašą:", err));
  }, []);

  /** Savaitės naravimo funkcijos **/
  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
    resetSelection();
  };
  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
    resetSelection();
  };
  function resetSelection() {
    setSelectedTimeSlotId(null);
    setSelectedDate(null);
    setSelectedTimeRange('');
  }

  /** Pasirinkus temą iš drop-down meniu **/
  function handleTopicChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = parseInt(e.target.value);
    setSelectedTopicId(isNaN(val) ? null : val);
  }

  /** Laiko lango pasirinkimo funkcija **/
  function handleTimeSlotClick(slot: EmployeeTimeSlot) {
    // Ištraukiame tik datos dalį be "T"
    const rawDatePart = slot.slotDate.includes("T")
      ? slot.slotDate.split("T")[0]
      : slot.slotDate;

    setSelectedTimeSlotId(slot.timeSlotId);
    setSelectedDate(rawDatePart);
    setSelectedTimeRange(`${slot.timeFrom} - ${slot.timeTo}`);
  }

  /** Rezervacijos pateikimas -> POST /Reservations **/
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTimeSlotId || !selectedTopicId || !selectedDate) return;

    // Konstruojame ISO formato datą rezervacijos užklausai
    const newDateTimeString = `${selectedDate}T${selectedTimeRange.split(' - ')[0]}`;
    const isoDateTime = new Date(newDateTimeString).toISOString();

    const newReservation = {
      userId: currentUserId,
      timeSlotId: selectedTimeSlotId,
      reservationDate: isoDateTime,
      status: "Confirmed",
      topicId: selectedTopicId
    }; 

    console.log("Siunčiamas payload:", newReservation);

    fetch(ENDPOINTS.RESERVATIONS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReservation)
    })
      .then(r => {
        if (!r.ok) throw new Error("Nepavyko sukurti rezervacijos");
        return r.json();
      })
      .then(created => {
        console.log("Rezervacija sukurta:", created);
        setSubmitted(true);
      })
      .catch(err => console.error("Klaida kuriant rezervaciją:", err));
  }

  /** Savaitės dienų skaičiavimas **/
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const endOfWeek = addDays(currentWeekStart, 7);

  // Jei nėra papildomo filtro – rodomi visi laiko langai
  const filteredSlots = employeeTimeSlots;

  return (
    <div className="weekly-schedule-container">
      <h2>Rezervacija vizitui į centrą</h2>

      {submitted ? (
        <div className="success-message">
          <p>Dėkojame už rezervaciją! Jūsų vizitas patvirtintas.</p>
          <li>
            <button type="button"><Link to="/">Atgal</Link></button>
          </li>
        </div>
      ) : (
        <div>
          {/* Savaitės navigacija */}
          <div className="week-navigation">
            <button onClick={handlePreviousWeek}>Ankstesnė savaitė</button>
            <span>
              {currentWeekStart.toLocaleDateString()} - {addDays(currentWeekStart, 6).toLocaleDateString()}
            </span>
            <button onClick={handleNextWeek}>Kita savaitė</button>
          </div>

          {/* Rezervacijos forma */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="topic">Pasirinkite vizito temą:</label>
              <select
                id="topic"
                name="topic"
                value={selectedTopicId ?? ''}
                onChange={handleTopicChange}
                required
              >
                <option value="">-- Pasirinkite temą --</option>
                {topics.map((t) => (
                  <option key={t.topicId} value={t.topicId}>
                    {t.topicName}
                  </option>
                ))}
              </select>
            </div>

            {/* Laiko langų lentelė */}
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Laikas (nuo - iki)</th>
                  <th>Darbuotojas ID</th>
                  <th>Pasirinkti</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlots.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Nėra laiko langų</td>
                  </tr>
                ) : (
                  filteredSlots.map((slot) => {
                    const rawDatePart = slot.slotDate.includes("T")
                      ? slot.slotDate.split("T")[0]
                      : slot.slotDate;
                    const [year, month, day] = rawDatePart.split("-");
                    const dateObj = new Date(+year, +month - 1, +day);
                    const displayDate = dateObj.toLocaleDateString("lt-LT");

                    const timeRange = `${slot.timeFrom} - ${slot.timeTo}`;
                    const isSelected = (slot.timeSlotId === selectedTimeSlotId);

                    return (
                      <tr key={slot.timeSlotId} className={isSelected ? "selected" : ""}>
                        <td>{displayDate}</td>
                        <td>{timeRange}</td>
                        <td>{slot.employeeId}</td>
                        <td>
                          <button type="button" onClick={() => handleTimeSlotClick(slot)}>
                            Pasirinkti
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Rodymas, ką vartotojas pasirinko */}
            {selectedTimeSlotId && (
              <div className="selected-info">
                <p>Laiko lango ID: {selectedTimeSlotId}</p>
                {selectedDate && (
                  <p>
                    Data: {new Date(selectedDate).toLocaleDateString("lt-LT")}, Laikas: {selectedTimeRange}
                  </p>
                )}
              </div>
            )}

            <button type="submit" disabled={!selectedTimeSlotId || !selectedTopicId}>
              Rezervuoti
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleReservation;
