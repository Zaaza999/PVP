import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getTimeSlots,
  addTimeSlot,
  deleteTimeSlot,
} from "../Axios/apiServises";
import "../../App.css";

const WORK_DAY_START_HOUR = 8;
const WORK_DAY_END_HOUR   = 17;
const STEP_MINUTES        = 30;

const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return (
      decoded.userId ??
      decoded.id ??
      decoded.sub ??
      decoded.nameid ??
      null
    );
  } catch {
    return null;
  }
};

interface TimeSlot {
  timeSlotId: number;
  employeeId: string;
  slotDate: string;   
  timeFrom: string;   
  timeTo: string;     
  isTaken: 0 | 1;    
}

const pad = (n: number) => n.toString().padStart(2, "0");
const timeStrToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const getDateKey = (iso: string) => iso.slice(0, 10);

const EmployeeTimeSlotsPage: React.FC = () => {
  const navigate = useNavigate();
  const [employeeId] = useState<string | null>(() => getCurrentUserId());

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotDate, setSlotDate]   = useState("");
  const [timeFrom, setTimeFrom]   = useState("");
  const [timeTo,   setTimeTo]     = useState("");

  const baseOptions = useMemo(() => {
    const opts: string[] = [];
    for (let h = WORK_DAY_START_HOUR; h <= WORK_DAY_END_HOUR; h++) {
      for (let m = 0; m < 60; m += STEP_MINUTES) {
        if (h === WORK_DAY_END_HOUR && m > 0) break;
        opts.push(`${pad(h)}:${pad(m)}`);
      }
    }
    return opts;
  }, []);

  const loadTimeSlots = useCallback(() => {
    if (!employeeId) return;

    getTimeSlots()
      .then((rows: any[]) => {
        const mapped: TimeSlot[] = rows.map((r) => ({
          timeSlotId: r.timeSlotId  ?? r.timeslot_id,
          employeeId: r.employeeId  ?? r.employee_id,
          slotDate:   r.slotDate    ?? r.slot_date,
          timeFrom:   r.timeFrom    ?? r.time_from,
          timeTo:     r.timeTo      ?? r.time_to,
          isTaken:    Number(r.isTaken ?? r.is_taken ?? 0) as 0 | 1,
        }));
        setTimeSlots(mapped.filter((s) => s.employeeId === employeeId));
      })
      .catch((err) =>
        console.error("Klaida įkeliant laiko intervalus:", err)
      );
  }, [employeeId]);

  useEffect(loadTimeSlots, [loadTimeSlots]);

  const isOverlapping = (
    newFrom: number,
    newTo: number,
    existingFrom: number,
    existingTo: number
  ) => newFrom < existingTo && newTo > existingFrom;

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employeeId) return;

    if (timeFrom >= timeTo) {
      alert("Laukelis „Nuo“ turi būti ankstesnis už „Iki“");
      return;
    }

    const proposedFrom = timeStrToMinutes(timeFrom);
    const proposedTo   = timeStrToMinutes(timeTo);

    const overlaps = timeSlots
      .filter((s) => getDateKey(s.slotDate) === slotDate)
      .some((s) =>
        isOverlapping(
          proposedFrom,
          proposedTo,
          timeStrToMinutes(s.timeFrom.slice(0, 5)),
          timeStrToMinutes(s.timeTo.slice(0, 5))
        )
      );

    if (overlaps) {
      alert("Nurodytas intervalas kertasi su jau egzistuojančiu laiku.");
      return;
    }

    addTimeSlot({
      employeeId,
       slotDate: new Date(`${slotDate}T${timeFrom}:00`).toISOString(),
       timeFrom: `${timeFrom}:00`,
       timeTo:   `${timeTo}:00`,
      topic:    "Laikas rezervacijai",  
      description: null                      
    })
      .then(() => {
        loadTimeSlots();
        setTimeFrom("");
        setTimeTo("");
      })
      .catch((err) =>
        console.error("Klaida kuriant laiko intervalą:", err)
      );
  };

  const handleDelete = (slot: TimeSlot) => {
    if (slot.isTaken) {
      alert("Negalite ištrinti užimto laiko intervalo.");
      return;
    }
    deleteTimeSlot(slot.timeSlotId)
      .then(loadTimeSlots)
      .catch((err) =>
        console.error("Klaida trinant laiko intervalą:", err)
      );
  };

  const visibleSlots = useMemo(() => {
    if (!slotDate) return [];
    return timeSlots
      .filter((s) => getDateKey(s.slotDate) === slotDate)
      .sort((a, b) => (a.timeFrom < b.timeFrom ? -1 : 1));
  }, [timeSlots, slotDate]);

  if (employeeId === null)
    return (
      <div className="container">
        <h2>Prisijunkite, kad galėtumėte valdyti savo laiko intervalus</h2>
        <button className="btn" onClick={() => navigate("/login")}>
          Prisijungti
        </button>
      </div>
    );

  return (
    <div className="container">
      <h2>Jūsų laiko intervalai</h2>

      <div className="card">
        <form onSubmit={handleCreate} className="form">
          <div className="form-group">
            <label>Data:</label>
            <input
              type="date"
              value={slotDate}
              onChange={(e) => {
                setSlotDate(e.target.value);
                setTimeFrom("");
                setTimeTo("");
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Nuo:</label>
            <select
              value={timeFrom}
              onChange={(e) => {
                setTimeFrom(e.target.value);
                setTimeTo("");
              }}
              disabled={!slotDate}
              required
            >
              <option value="" disabled>— Pasirinkite —</option>
              {baseOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Iki:</label>
            <select
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              disabled={!timeFrom}
              required
            >
              <option value="" disabled>— Pasirinkite —</option>
              {baseOptions
                .filter((t) => t > timeFrom)
                .map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
            </select>
          </div>

          <button type="submit" className="btn">
            Sukurti laiko intervalą
          </button>
        </form>
      </div>

      <div className="table-container">
        <table className="time-slots-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Nuo</th>
              <th>Iki</th>
              <th>Būsena</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {!slotDate ? (
              <tr>
                <td colSpan={6}>Pasirinkite datą kalendoriuje</td>
              </tr>
            ) : visibleSlots.length === 0 ? (
              <tr>
                <td colSpan={6}>Šiai dienai dar nesukūrėte laiko intervalų</td>
              </tr>
            ) : (
              visibleSlots.map((slot) => (
                <tr key={slot.timeSlotId}>
                  <td>{slot.timeSlotId}</td>
                  <td>{new Date(slot.slotDate).toLocaleDateString()}</td>
                  <td>{slot.timeFrom}</td>
                  <td>{slot.timeTo}</td>
                  <td className={slot.isTaken ? "busy" : "free"}>
                    {slot.isTaken ? "Užimtas" : "Laisvas"}
                  </td>
                  <td>
                    <button
                      className="btn btn-delete"
                      disabled={!!slot.isTaken}
                      onClick={() => handleDelete(slot)}
                    >
                      Ištrinti
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> 
      <div className="button-wrapper">
          <button className="back-button" onClick={() => navigate("/")}>
              Grįžti į pagrindinį puslapį
          </button>
      </div>
    </div>
  );
};

export default EmployeeTimeSlotsPage;
