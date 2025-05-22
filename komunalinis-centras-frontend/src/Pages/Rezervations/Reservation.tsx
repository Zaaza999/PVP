// src/Pages/Rezervations/Reservation.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getVisitTopics,
  getTimeSlotsByTopic,  //  <-- naujas endpointas
  addReservation, 
  getUser,
} from "../Axios/apiServises";
import "../styles.css";

/* ===== helper: JWT → userId (string) ===== */
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    // token payload { "nameid": "<Guid>" , … }
    const decoded: { nameid?: string } = jwtDecode(token);
    return decoded?.nameid ?? null;
  } catch {
    return null;
  }
};

/* ===== DTO types ===== */
export type EmployeeTimeSlot = {
  timeSlotId: number;
  employeeId: number;
  slotDate: string;      // ISO-8601 2024-05-22T00:00:00
  timeFrom: string;      // 09:00
  timeTo: string;        // 09:30
  isTaken: boolean;
};

export type VisitTopic = {
  topicId: number;
  topicName: string;
  description?: string;
};

/* ===== date helpers ===== */
const setToMidnight = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const getMonday = (date: Date): Date => {
  const temp = setToMidnight(new Date(date));
  const day = temp.getDay();
  const diff = temp.getDate() - day + (day === 0 ? -6 : 1); // Pradedam savaitę nuo pirmadienio
  return new Date(temp.setDate(diff));
};

const addDays = (date: Date, days: number): Date => {
  const d = setToMidnight(date);
  d.setDate(d.getDate() + days);
  return d;
};

/* ====== COMPONENT ====== */
const WeeklyScheduleReservation: React.FC = () => {
  const navigate = useNavigate();

  /* --- state --- */
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getMonday(new Date())
  );

  const [employeeTimeSlots, setEmployeeTimeSlots] = useState<EmployeeTimeSlot[]>(
    []
  );
  const [topics, setTopics] = useState<VisitTopic[]>([]);

  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  const [submitted, setSubmitted] = useState(false);

  /* --- INIT: fetch user + topics --- */
  useEffect(() => {
    setCurrentUserId(getCurrentUserId());

    getVisitTopics()
      .then(setTopics)
      .catch((err) => console.error("Klaida gaunant temų sąrašą:", err));
  }, []);

  /* --- kai pasirenkama tema, atsiunčiam atitinkamus laiko tarpus --- */
  useEffect(() => {
    if (selectedTopicId == null) {
      setEmployeeTimeSlots([]);
      return;
    }

    getTimeSlotsByTopic(selectedTopicId)
      .then((data) =>
        setEmployeeTimeSlots(
          data.filter((s: EmployeeTimeSlot) => !s.isTaken) // saugiklis
        )
      )
      .catch((err) => console.error("Klaida gaunant laiko langus:", err));
  }, [selectedTopicId]); 

  /* --- navigacija per savaites --- */
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
    setSelectedTimeRange("");
    setSubmitted(false);
  };

  /* --- form handlers --- */
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10);
    setSelectedTopicId(isNaN(val) ? null : val);
    // išvalom ankstesnio pasirinkimo duomenis
    resetSelection();
  };

  const handleTimeSlotClick = (slot: EmployeeTimeSlot) => {
    const rawDate = slot.slotDate.split("T")[0]; // YYYY-MM-DD
    setSelectedTimeSlotId(slot.timeSlotId);
    setSelectedDate(rawDate);
    setSelectedTimeRange(`${slot.timeFrom} - ${slot.timeTo}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !currentUserId ||
      !selectedTimeSlotId ||
      !selectedTopicId ||
      !selectedDate
    )
      return;

    const isoDateTime = new Date(
      `${selectedDate}T${selectedTimeRange.split(" - ")[0]}`
    ).toISOString();

    addReservation({
      userId: currentUserId,
      timeSlotId: selectedTimeSlotId,
      reservationDate: isoDateTime,
      status: "Confirmed",
      topicId: selectedTopicId,
    })
      .then(() => setSubmitted(true))
      .catch((err) => console.error("Klaida kuriant rezervaciją:", err));
  };

  /* --- filtravimas pagal savaitę --- */
  const visibleSlots = employeeTimeSlots.filter((slot) => {
    const slotDate = new Date(slot.slotDate.split("T")[0]);
    const weekEnd = addDays(currentWeekStart, 6);
    return slotDate >= currentWeekStart && slotDate <= weekEnd;
  }); 

  /* ====== RENDER ====== */


  return (
    <div className="weekly-schedule-container">
      <h2>Rezervacija vizitui į centrą</h2>

      {submitted ? (
        <div className="success-message">
          <p>Dėkojame už rezervaciją! Jūsų vizitas patvirtintas.</p>
          <Link to="/" className="btn">
            Atgal
          </Link>
        </div>
      ) : (
        <>
          {/* Savaitės navigacija */}
          <div className="week-navigation">
            <button onClick={handlePreviousWeek}>Ankstesnė savaitė</button>
            <span>
              {currentWeekStart.toLocaleDateString("lt-LT")} –{" "}
              {addDays(currentWeekStart, 6).toLocaleDateString("lt-LT")}
            </span>
            <button onClick={handleNextWeek}>Kita savaitė</button>
          </div>

          {/* Forma */}
          <form onSubmit={handleSubmit}>
            {/* Tema */}
            <div className="form-group">
              <label htmlFor="topic">Pasirinkite vizito temą:</label>
              <select
                id="topic"
                value={selectedTopicId ?? ""}
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

            {/* Laiko lentelė */}
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
                {visibleSlots.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      {selectedTopicId
                        ? "Šiai savaitei nėra laisvų laikų"
                        : "Pirmiausia pasirinkite temą"}
                    </td>
                  </tr>
                ) : (
                  visibleSlots.map((slot) => {
                    const [y, m, d] = slot.slotDate
                      .split("T")[0]
                      .split("-")
                      .map(Number);
                    const displayDate = new Date(
                      y,
                      m - 1,
                      d
                    ).toLocaleDateString("lt-LT");
                    const timeRange = `${slot.timeFrom} - ${slot.timeTo}`;

                    return (
                      <tr
                        key={slot.timeSlotId}
                        className={
                          slot.timeSlotId === selectedTimeSlotId
                            ? "selected"
                            : ""
                        }
                      >
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

            {/* Pasirinkimo reziumė */}
            {selectedTimeSlotId && selectedDate && (
              <div className="selected-info">
                <p>Laiko lango ID: {selectedTimeSlotId}</p>
                <p>
                  Data: {new Date(selectedDate).toLocaleDateString("lt-LT")},{" "}
                  Laikas: {selectedTimeRange}
                </p>
              </div>
            )}

            {/* Veiksmo mygtukai */}
            <div className="button-wrapper">
              <button type="submit" className="btn primary" disabled={!selectedTimeSlotId}>
                Patvirtinti
              </button>
              <button
                type="button"
                className="back-button"
                onClick={() => navigate("/")}
              >
                Grįžti į pagrindinį puslapį
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default WeeklyScheduleReservation;
