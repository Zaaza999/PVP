// src/Pages/AddTime.tsx
import React, { useState, useEffect } from "react";
import {
  getTimeSlots,
  addTimeSlot,
  deleteTimeSlot
} from "../Axios/apiServises";  // Importuojame laiko intervalų API funkcijas
import "../../App.css"; // Importuojame bendrą CSS (arba specialų stiliaus failą)

type TimeSlot = {
  timeSlotId: number;
  employeeId: number;
  slotDate: string;
  timeFrom: string;
  timeTo: string;
};

const EmployeeTimeSlotsPage: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");

  // Užkraunami laiko intervalai iš API
  const loadTimeSlots = () => {
    getTimeSlots()
      .then((data: TimeSlot[]) => setTimeSlots(data))
      .catch((error) =>
        console.error("Klaida įkeliant laiko intervalus:", error)
      );
  };

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Suformatuojame laiką (jei pateikiamas tik HH:mm – pridedame ":00")
    const formattedTimeFrom = timeFrom.length === 5 ? timeFrom + ":00" : timeFrom;
    const formattedTimeTo = timeTo.length === 5 ? timeTo + ":00" : timeTo;

    // Sukuriame pilną ISO formatą
    const dateTimeString = `${slotDate}T${formattedTimeFrom}`;
    const slotDateISO = new Date(dateTimeString).toISOString();

    const newSlot = {
      employeeId: parseInt(employeeId),
      slotDate: slotDateISO,
      timeFrom: formattedTimeFrom,
      timeTo: formattedTimeTo,
    };

    addTimeSlot(newSlot)
      .then(() => {
        loadTimeSlots();
        setEmployeeId("");
        setSlotDate("");
        setTimeFrom("");
        setTimeTo("");
      })
      .catch((error) =>
        console.error("Klaida kuriant laiko intervalą:", error)
      );
  };

  const handleDelete = (id: number) => {
    deleteTimeSlot(id)
      .then(() => loadTimeSlots())
      .catch((error) =>
        console.error("Klaida trinant laiko intervalą:", error)
      );
  };

  return (
    <div className="container">
      <h2>Laiko intervalai darbuotojams</h2>
      <div className="card">
        <form onSubmit={handleCreate} className="form">
          <div className="form-group">
            <label htmlFor="employeeId">Darbuotojo ID:</label>
            <input
              id="employeeId"
              type="number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="slotDate">Data:</label>
            <input
              id="slotDate"
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeFrom">Nuo:</label>
            <input
              id="timeFrom"
              type="time"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeTo">Iki:</label>
            <input
              id="timeTo"
              type="time"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              required
            />
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
              <th>Darbuotojo ID</th>
              <th>Data</th>
              <th>Nuo</th>
              <th>Iki</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.length === 0 ? (
              <tr>
                <td colSpan={6}>Nėra laiko intervalų</td>
              </tr>
            ) : (
              timeSlots.map((slot) => (
                <tr key={slot.timeSlotId}>
                  <td>{slot.timeSlotId}</td>
                  <td>{slot.employeeId}</td>
                  <td>{new Date(slot.slotDate).toLocaleDateString()}</td>
                  <td>{slot.timeFrom}</td>
                  <td>{slot.timeTo}</td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(slot.timeSlotId)}
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
    </div>
  );
};

export default EmployeeTimeSlotsPage;
