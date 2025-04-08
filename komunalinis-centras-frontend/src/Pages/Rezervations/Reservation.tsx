import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

/** 
 * Papildoma pagalbinė funkcija 
 * - "setToMidnight" -> grąžina tą pačią dieną, bet 00:00:00 
 */
function setToMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Savaitės navigacijai:
 * "getMonday" -> randa pirmadienį iš nurodytos Date.
 */
function getMonday(date: Date): Date {
  const temp = setToMidnight(new Date(date)); // suapvalinam
  const day = temp.getDay();
  const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(temp.setDate(diff));
}

/** addDays(d, n) -> prideda n dienų, laiką paliekant 00:00:00 */
function addDays(date: Date, days: number): Date {
  const d = setToMidnight(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Pagrindinis komponentas */
const WeeklyScheduleReservation: React.FC = () => {
  // 1. Savaitės pradžia
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getMonday(new Date())
  );

  // 2. Užkraunamos lentelės
  const [employeeTimeSlots, setEmployeeTimeSlots] = useState<EmployeeTimeSlot[]>([]);
  const [topics, setTopics] = useState<VisitTopic[]>([]);

  // 3. Pasirinkimai
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);  // čia saugosime tik "YYYY-MM-DD"
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  // 4. Ar rezervuota sėkmingai?
  const [submitted, setSubmitted] = useState(false);

  // Hardcodintas user ID
  const currentUserId = 1;

  /** useEffect: užkeliame EmployeeTimeSlots ir VisitTopics */
  useEffect(() => {
    // Gauname laiko langus
    fetch("http://localhost:5190/EmployeeTimeSlots")
      .then(resp => resp.json())
      .then((data: EmployeeTimeSlot[]) => {
        setEmployeeTimeSlots(data);
      })
      .catch(err => console.error("Klaida gaunant laiko langus:", err));

    // Gauname vizito temų sąrašą
    fetch("http://localhost:5190/VisitTopics")
      .then(resp => resp.json())
      .then((data: VisitTopic[]) => setTopics(data))
      .catch(err => console.error("Klaida gaunant temų sąrašą:", err));
  }, []);

  /** Savaitės navigacija */
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

  /** Kai pasirenkame temą drop-down */
  function handleTopicChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = parseInt(e.target.value);
    setSelectedTopicId(isNaN(val) ? null : val);
  }

  /** Kai pasirenkame laiko langą (paspaudžiame "Pasirinkti") */
  function handleTimeSlotClick(slot: EmployeeTimeSlot) {
    // Išsitraukiame tik datą be "T"
    const rawDatePart = slot.slotDate.includes("T")
      ? slot.slotDate.split("T")[0]   // paliekam tik "YYYY-MM-DD"
      : slot.slotDate;               // gal jau neturi T

    setSelectedTimeSlotId(slot.timeSlotId);
    setSelectedDate(rawDatePart);                 // saugome pvz. "2025-04-10"
    setSelectedTimeRange(`${slot.timeFrom} - ${slot.timeTo}`);
  }

  /** Rezervuoti -> POST /Reservations */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTimeSlotId || !selectedTopicId || !selectedDate) return;

    // Čia konstruojame ISO formatą POST užklausai (t.y. viduje turime T, bet vartotojui to nerodome)
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

    fetch("http://localhost:5190/Reservations", {
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
      .catch(err => {
        console.error("Klaida kuriant rezervaciją:", err);
      });
  }

  /** Savaitės dienų skaičiavimas */
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const endOfWeek = addDays(currentWeekStart, 7);

  // Jei norite rodyti absoliučiai visus laiko langus, ištraukite filtrą, jei yra.
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

          {/* Forma: pasirinkti temą, tada laiko langus, tada Rezervuoti */}
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

            {/* Lentelė su visais EmployeeTimeSlots */}
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
                    // Išsitraukiam tik datą be laiko dalies
                    const rawDatePart = slot.slotDate.includes("T")
                      ? slot.slotDate.split("T")[0]
                      : slot.slotDate; // pvz. "2025-04-10"

                    // Jei norime rodyti vartotojui 09/04/2025 formatu:
                    // konstruojame new Date(...) ir paverčiame localeString
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
                          <button
                            type="button"
                            onClick={() => handleTimeSlotClick(slot)}
                          >
                            Pasirinkti
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Rodyti, ką vartotojas pasirinko */}
            {selectedTimeSlotId && (
              <div className="selected-info">
                <p>Laiko lango ID: {selectedTimeSlotId}</p>
                {/* Čia rodome vartotojui datą be T00:00:00 */}
                {selectedDate && (
                  <p>
                    Data: {new Date(selectedDate).toLocaleDateString("lt-LT")}
                    , Laikas: {selectedTimeRange}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedTimeSlotId || !selectedTopicId}
            >
              Rezervuoti
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleReservation;
