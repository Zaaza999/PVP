// src/Pages/Reservation.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  addReservation,
  getTimeSlots, 
  getVisitTopics 
} from "../Axios/apiServises";
import '../styles.css';

type EmployeeTimeSlot = {
  timeSlotId: number;
  employeeId: number;
  slotDate: string;
  timeFrom: string;
  timeTo: string;
};

type VisitTopic = {
  topicId: number;
  topicName: string;
  description?: string;
};

function setToMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getMonday(date: Date): Date {
  const temp = setToMidnight(new Date(date));
  const day = temp.getDay();
  const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(temp.setDate(diff));
}

function addDays(date: Date, days: number): Date {
  const d = setToMidnight(date);
  d.setDate(d.getDate() + days);
  return d;
}

const WeeklyScheduleReservation: React.FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [employeeTimeSlots, setEmployeeTimeSlots] = useState<EmployeeTimeSlot[]>([]);
  const [topics, setTopics] = useState<VisitTopic[]>([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentUserId = 1; // Hardcodintas naudotojo ID – realiame projekte naudokite autentifikaciją

  // Užkraunami laiko langai ir vizito temos iš API
  useEffect(() => {
    getTimeSlots()
      .then((data: EmployeeTimeSlot[]) => setEmployeeTimeSlots(data))
      .catch((err) => console.error("Klaida gaunant laiko langus:", err));
  
    getVisitTopics()
      .then((data: VisitTopic[]) => setTopics(data))
      .catch((err) => console.error("Klaida gaunant temų sąrašą:", err));
  }, []);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
    resetSelection();
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedTimeSlotId(null);
    setSelectedDate(null);
    setSelectedTimeRange('');
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    setSelectedTopicId(isNaN(val) ? null : val);
  };

  const handleTimeSlotClick = (slot: EmployeeTimeSlot) => {
    const rawDatePart = slot.slotDate.includes("T")
      ? slot.slotDate.split("T")[0]
      : slot.slotDate;
    setSelectedTimeSlotId(slot.timeSlotId);
    setSelectedDate(rawDatePart);
    setSelectedTimeRange(`${slot.timeFrom} - ${slot.timeTo}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTimeSlotId || !selectedTopicId || !selectedDate) return;

    const newDateTimeString = `${selectedDate}T${selectedTimeRange.split(' - ')[0]}`;
    const isoDateTime = new Date(newDateTimeString).toISOString();

    const newReservation = {
      userId: currentUserId,
      timeSlotId: selectedTimeSlotId,
      reservationDate: isoDateTime,
      status: "Confirmed",
      topicId: selectedTopicId
    };

    addReservation(newReservation)
      .then((data) => {
        console.log("Rezervacija sukurta:", data);
        setSubmitted(true);
      })
      .catch((err) => console.error("Klaida kuriant rezervaciją:", err));
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  return (
    <div className="weekly-schedule-container">
      <h2>Rezervacija vizitui į centrą</h2>
      {submitted ? (
        <div className="success-message">
          <p>Dėkojame už rezervaciją! Jūsų vizitas patvirtintas.</p>
          <button className="btn">
            <Link to="/">Atgal</Link>
          </button>
        </div>
      ) : (
        <div>
          <div className="week-navigation">
            <button onClick={handlePreviousWeek}>Ankstesnė savaitė</button>
            <span>
              {currentWeekStart.toLocaleDateString()} -{" "}
              {addDays(currentWeekStart, 6).toLocaleDateString()}
            </span>
            <button onClick={handleNextWeek}>Kita savaitė</button>
          </div>

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
                {employeeTimeSlots.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Nėra laiko langų</td>
                  </tr>
                ) : (
                  employeeTimeSlots.map((slot) => {
                    const rawDatePart = slot.slotDate.includes("T")
                      ? slot.slotDate.split("T")[0]
                      : slot.slotDate;
                    const [year, month, day] = rawDatePart.split("-");
                    const dateObj = new Date(+year, +month - 1, +day);
                    const displayDate = dateObj.toLocaleDateString("lt-LT");
                    const timeRange = `${slot.timeFrom} - ${slot.timeTo}`;
                    const isSelected = slot.timeSlotId === selectedTimeSlotId;

                    return (
                      <tr key={slot.timeSlotId} className={isSelected ? "selected" : ""}>
                        <td>{displayDate}</td>
                        <td>{timeRange}</td>
                        <td>{slot.employeeId}</td>
                        <td>
                          <button
                            type="button"
                            className="btn"
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

            <button type="submit" className="btn" disabled={!selectedTimeSlotId || !selectedTopicId}>
              Rezervuoti
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleReservation;
