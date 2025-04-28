// src/Pages/Rezervations/AddTime.tsx – rodomi tik prisijungusio darbuotojo langai
//-------------------------------------------------------------------

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getTimeSlots,
  addTimeSlot,
  deleteTimeSlot,
} from "../Axios/apiServises";
import "../../App.css";

/* ===== JWT → userId helper (GUID string) ===== */
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return (
      decoded.userId ?? decoded.id ?? decoded.sub ?? decoded.nameid ?? null
    );
  } catch {
    return null;
  }
};

/* ===== DTO ===== */
interface TimeSlot {
  timeSlotId: number;
  employeeId: string; // GUID
  slotDate: string;   // ISO
  timeFrom: string;   // HH:mm:ss
  timeTo: string;     // HH:mm:ss
}

/* ===== COMPONENT ===== */
const EmployeeTimeSlotsPage: React.FC = () => {
  const navigate = useNavigate();

  /* --- auth --- */
  const [employeeId] = useState<string | null>(() => getCurrentUserId());

  /* --- state --- */
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotDate, setSlotDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");

  /* --- fetch only MY slots --- */
  const loadTimeSlots = useCallback(() => {
    if (!employeeId) return;
    getTimeSlots()
      .then((data: TimeSlot[]) =>
        setTimeSlots(data.filter((s: TimeSlot) => s.employeeId === employeeId))
      )
      .catch((err) => console.error("Klaida įkeliant laiko intervalus:", err));
  }, [employeeId]);

  useEffect(loadTimeSlots, [loadTimeSlots]);

  /* --- create --- */
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employeeId) return;

    const formattedFrom = timeFrom.length === 5 ? `${timeFrom}:00` : timeFrom;
    const formattedTo = timeTo.length === 5 ? `${timeTo}:00` : timeTo;
    const isoDate = new Date(`${slotDate}T${formattedFrom}`).toISOString();

    addTimeSlot({ employeeId, slotDate: isoDate, timeFrom: formattedFrom, timeTo: formattedTo })
      .then(() => {
        loadTimeSlots();
        setSlotDate("");
        setTimeFrom("");
        setTimeTo("");
      })
      .catch((err) => console.error("Klaida kuriant laiko intervalą:", err));
  };

  /* --- delete --- */
  const handleDelete = (id: number) => {
    deleteTimeSlot(id)
      .then(loadTimeSlots)
      .catch((err) => console.error("Klaida trinant laiko intervalą:", err));
  };

  /* ===== RENDER ===== */
  if (employeeId === null)
    return (
      <div className="container">
        <h2>Prisijunkite, kad galėtumėte valdyti savo laiko intervalus</h2>
        <button className="btn" onClick={() => navigate("/login")}>Prisijungti</button>
      </div>
    );

  return (
    <div className="container">
      <h2>Jūsų laiko intervalai (darbuotojo ID: {employeeId})</h2>

      {/* CREATE FORM */}
      <div className="card">
        <form onSubmit={handleCreate} className="form">
          <div className="form-group">
            <label>Data:</label>
            <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Nuo:</label>
            <input type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Iki:</label>
            <input type="time" value={timeTo} onChange={e => setTimeTo(e.target.value)} required />
          </div>
          <button type="submit" className="btn">Sukurti laiko intervalą</button>
        </form>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="time-slots-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Nuo</th>
              <th>Iki</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.length === 0 ? (
              <tr><td colSpan={5}>Jūs dar nesukūrėte laiko intervalų</td></tr>
            ) : (
              timeSlots.map(slot => (
                <tr key={slot.timeSlotId}>
                  <td>{slot.timeSlotId}</td>
                  <td>{new Date(slot.slotDate).toLocaleDateString()}</td>
                  <td>{slot.timeFrom}</td>
                  <td>{slot.timeTo}</td>
                  <td>
                    <button className="btn btn-delete" onClick={() => handleDelete(slot.timeSlotId)}>Ištrinti</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTimeSlotsPage;