// src/Pages/Rezervations/Reservation.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getVisitTopics,
  getTimeSlotsByTopic,
  addReservation,
  getUser,
} from "../Axios/apiServises";
import "../styles.css";

/* ===== helper: JWT → userId (string) ===== */
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.nameid ?? decoded.sub ?? decoded.userId ?? null;
  } catch {
    return null;
  }
};

/* ===== DTO types ===== */
export type EmployeeTimeSlot = {
  timeSlotId: number;
  employeeId: number;
  slotDate: string; // ISO-8601
  timeFrom: string;
  timeTo: string;
  isTaken: boolean;
};

export type VisitTopic = {
  topicId: number;
  topicName: string;
  description?: string;
};

type EmployeeNameMap = Record<number, string>;

/* ===== date helpers ===== */
const setToMidnight = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const getMonday = (date: Date): Date => {
  const temp = setToMidnight(new Date(date));
  const day = temp.getDay();
  const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [topics, setTopics] = useState<VisitTopic[]>([]);

  const [selectedTopicId, setSelectedTopicId] =
    useState<number | null>(null);

  const [employeeTimeSlots, setEmployeeTimeSlots] =
    useState<EmployeeTimeSlot[]>([]);
  const [employeeNames, setEmployeeNames] =
    useState<EmployeeNameMap>({});

  const [currentWeekStart, setCurrentWeekStart] =
    useState<Date>(() => getMonday(new Date()));

  const [selectedTimeSlotId, setSelectedTimeSlotId] =
    useState<number | null>(null);
  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<string>("");

  const [submitted, setSubmitted] = useState(false);

  /* --- INIT: fetch user + topics --- */
  useEffect(() => {
    setCurrentUserId(getCurrentUserId());

    getVisitTopics()
      .then(setTopics)
      .catch(err => console.error("Klaida gaunant temas:", err));
  }, []);

  /* --- kada pasikeičia tema, gaunam laikus --- */
  useEffect(() => {
    if (selectedTopicId == null) {
      setEmployeeTimeSlots([]);
      return;
    }

    getTimeSlotsByTopic(selectedTopicId)
      .then(data =>
        setEmployeeTimeSlots(
          data.filter((s: EmployeeTimeSlot) => !s.isTaken)
        )
      )
      .catch(err => console.error("Klaida gaunant laiko langus:", err));
  }, [selectedTopicId]);

  /* --- fetch missing employee names --- */
  useEffect(() => {
    if (employeeTimeSlots.length === 0) return;

    const uniqueIds = Array.from(
      new Set(employeeTimeSlots.map((s: EmployeeTimeSlot) => s.employeeId))
    );
    const missing = uniqueIds.filter(id => !(id in employeeNames));
    if (missing.length === 0) return;

    Promise.all(missing.map((id: number) => getUser(id.toString())))
      .then((users: any[]) => {
        const map: EmployeeNameMap = {};
        users.forEach((u: any) => {
          map[u.id] =
            `${u.firstName ?? u.name ?? ""} ${u.lastName ?? ""}`.trim() ||
            u.userName;
        });
        setEmployeeNames(prev => ({ ...prev, ...map }));
      })
      .catch(err => console.error("Klaida gaunant vardus:", err));
  }, [employeeTimeSlots, employeeNames]);

  /* --- savaičių navigacija --- */
  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
    setSelectedTimeSlotId(null);
    setSelectedDate(null);
    setSelectedTimeRange("");
    setSubmitted(false);
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
    setSelectedTimeSlotId(null);
    setSelectedDate(null);
    setSelectedTimeRange("");
    setSubmitted(false);
  };

  /* --- form handlers --- */
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10);
    setSelectedTopicId(isNaN(val) ? null : val);
    setSelectedTimeSlotId(null);
    setSelectedDate(null);
    setSelectedTimeRange("");
  };

  const handleTimeSlotClick = (slot: EmployeeTimeSlot) => {
    setSelectedTimeSlotId(slot.timeSlotId);
    setSelectedDate(slot.slotDate.split("T")[0]);
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

    const isoDate = new Date(
      `${selectedDate}T${selectedTimeRange.split(" - ")[0]}`
    ).toISOString();

    addReservation({
      userId: currentUserId,
      timeSlotId: selectedTimeSlotId,
      reservationDate: isoDate,
      status: "Confirmed",
      topicId: selectedTopicId,
    })
      .then(() => setSubmitted(true))
      .catch(err => console.error("Klaida kuriant rezervaciją:", err));
  };

  /* --- filtruojam pagal savaitę --- */
  const visibleSlots = employeeTimeSlots.filter((slot: EmployeeTimeSlot) => {
    const d = new Date(slot.slotDate.split("T")[0]);
    const weekEnd = addDays(currentWeekStart, 6);
    return d >= currentWeekStart && d <= weekEnd;
  });

  /* ===== render ===== */
  if (submitted) {
    return (
      <div className="weekly-schedule-container">
        <h3>Rezervacija patvirtinta!</h3>
        <Link to="/" className="btn">
          Pradžia
        </Link>
      </div>
    );
  }

  return (
    <div className="weekly-schedule-container">
      <h2>Rezervacija vizitui į centrą</h2>

      <div className="week-navigation">
        <button onClick={handlePreviousWeek}>Ankstesnė savaitė</button>
        <span>
          {currentWeekStart.toLocaleDateString("lt-LT")} –{' '}
          {addDays(currentWeekStart, 6).toLocaleDateString("lt-LT")}
        </span>
        <button onClick={handleNextWeek}>Kita savaitė</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">Tema:</label>
          <select
            id="topic"
            value={selectedTopicId ?? ""}
            onChange={handleTopicChange}
            required
          >
            <option value="">-- Pasirinkite --</option>
            {topics.map((t: VisitTopic) => (
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
              <th>Laikas</th>
              <th>Darbuotojas</th>
              <th>Pasirinkti</th>
            </tr>
          </thead>
          <tbody>
            {visibleSlots.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  {selectedTopicId
                    ? "Šiai savaitei nėra laisvų laikų"
                    : "Pasirinkite temą"}
                </td>
              </tr>
            ) : (
              visibleSlots.map((slot: EmployeeTimeSlot) => {
                const [y, m, d] = slot.slotDate
                  .split("T")[0]
                  .split("-")
                  .map(Number);
                const displayDate = new Date(y, m - 1, d).toLocaleDateString(
                  "lt-LT"
                );
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
                    <td>
                      {employeeNames[slot.employeeId] ??
                        `ID: ${slot.employeeId}`}
                    </td>
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

        {/* Pasirinkimo santrauka */}
        {selectedTimeSlotId && selectedDate && (
          <div className="selected-info">
            <p>Laiko lango ID: {selectedTimeSlotId}</p>
            <p>
              Data: {new Date(selectedDate).toLocaleDateString("lt-LT")}, Laikas: {selectedTimeRange}
            </p>
          </div>
        )}

        <div className="button-wrapper">
          <button
            type="submit"
            className="btn primary"
            disabled={!selectedTimeSlotId}
          >
            Patvirtinti
          </button>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            Atšaukti
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyScheduleReservation;
