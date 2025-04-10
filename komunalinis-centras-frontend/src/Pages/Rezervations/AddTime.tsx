import React, { useState, useEffect } from "react";
import { ENDPOINTS } from "../Config/Config"; // Importuojame konfigūracijos konstantas

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

  // Uždarbame visus laiko intervalus naudojant endpoint'ą iš konfigūracijos
  const loadTimeSlots = () => {
    fetch(ENDPOINTS.EMPLOYEE_TIME_SLOTS)
      .then((res) => res.json())
      .then((data) => setTimeSlots(data))
      .catch((error) => console.error("Klaida įkeliant laiko intervalus:", error));
  };

  useEffect(() => {
    loadTimeSlots();
  }, []);

  // Formos užklausos apdorojimas
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sujungiame datą ir pradžią (pvz., "2025-04-08" ir "18:21") ir pridedame sekundžių dalį, jei jos nėra ("18:21:00")
    const formattedTimeFrom = timeFrom.length === 5 ? timeFrom + ":00" : timeFrom;
    const formattedTimeTo = timeTo.length === 5 ? timeTo + ":00" : timeTo;

    // Sukuriame pilną datos ir laiko string'ą (pvz., "2025-04-08T18:21:00")
    const dateTimeString = `${slotDate}T${formattedTimeFrom}`;
    const slotDateISO = new Date(dateTimeString).toISOString();

    // Formuojame naujo laiko intervalo objektą
    const newSlot = {
      employeeId: parseInt(employeeId),
      slotDate: slotDateISO,      // ISO formatas, pvz.: "2025-04-08T18:21:57.638Z"
      timeFrom: formattedTimeFrom,  // "HH:mm:ss"
      timeTo: formattedTimeTo,      // "HH:mm:ss"
    };

    console.log("Siunčiamas payload:", newSlot);

    fetch(ENDPOINTS.EMPLOYEE_TIME_SLOTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSlot),
    })
      .then((r) => {
        if (!r.ok) {
          return r.json().then((err) => {
            throw err;
          });
        }
        return r.json();
      })
      .then(() => {
        loadTimeSlots();
        setEmployeeId("");
        setSlotDate("");
        setTimeFrom("");
        setTimeTo("");
      })
      .catch((error) => console.error("Klaida kuriant laiko intervalą:", error));
  };

  // Ištrina laiko intervalą pagal ID, naudojant endpoint'ą iš konfigūracijos
  const handleDelete = (id: number) => {
    fetch(`${ENDPOINTS.EMPLOYEE_TIME_SLOTS}/${id}`, {
      method: "DELETE",
    })
      .then(() => loadTimeSlots())
      .catch((error) => console.error("Klaida trinant laiko intervalą:", error));
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
            {timeSlots.map((slot) => (
              <tr key={slot.timeSlotId}>
                <td>{slot.timeSlotId}</td>
                <td>{slot.employeeId}</td>
                <td>{slot.slotDate}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTimeSlotsPage;
