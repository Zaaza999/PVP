import React, { useState, useEffect } from "react";

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

  const loadTimeSlots = () => {
    fetch("http://localhost:5190/EmployeeTimeSlots")
      .then((r) => r.json())
      .then((data) => setTimeSlots(data))
      .catch((error) => console.error("Error loading time slots:", error));
  };

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSlot = {
      employeeId: parseInt(employeeId),
      slotDate,
      timeFrom,
      timeTo,
    };

    fetch("http://localhost:5190/EmployeeTimeSlots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSlot),
    })
      .then((r) => r.json())
      .then(() => {
        loadTimeSlots();
        setEmployeeId("");
        setSlotDate("");
        setTimeFrom("");
        setTimeTo("");
      })
      .catch((error) => console.error("Error creating time slot:", error));
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:5190/EmployeeTimeSlots/${id}`, {
      method: "DELETE",
    })
      .then(() => loadTimeSlots())
      .catch((error) => console.error("Error deleting time slot:", error));
  };

  return (
    <div className="container">
      <h2>Employee Time Slots</h2>

      <div className="card">
        <form onSubmit={handleCreate} className="form">
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID:</label>
            <input
              id="employeeId"
              type="number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="slotDate">Date:</label>
            <input
              id="slotDate"
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeFrom">From:</label>
            <input
              id="timeFrom"
              type="time"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeTo">To:</label>
            <input
              id="timeTo"
              type="time"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Create Time Slot
          </button>
        </form>
      </div>

      <div className="table-container">
        <table className="time-slots-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Actions</th>
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
                    Delete
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
