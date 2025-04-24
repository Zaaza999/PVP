// src/Pages/Reservation.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  addReservation,
  getTimeSlots,
  getVisitTopics
} from '../Axios/apiServises';
import '../styles.css';

type EmployeeTimeSlot = {
  timeSlotId: number;
  employeeId: number;
  slotDate: string;
  timeFrom: string;
  timeTo: string;
  isTaken: boolean;
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

  const currentUserId = 1;

  useEffect(() => {
    getTimeSlots()
      .then((data: EmployeeTimeSlot[]) =>
        setEmployeeTimeSlots(data.filter(slot => !slot.isTaken))
      )
      .catch(err => console.error('Klaida gaunant laiko langus:', err));

    getVisitTopics()
      .then((data: VisitTopic[]) => setTopics(data))
      .catch(err => console.error('Klaida gaunant temų sąrašą:', err));
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
    setSelectedTopicId(null);
    setSubmitted(false);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    setSelectedTopicId(isNaN(val) ? null : val);
  };

  const handleTimeSlotClick = (slot: EmployeeTimeSlot) => {
    const rawDate = slot.slotDate.split('T')[0];
    setSelectedTimeSlotId(slot.timeSlotId);
    setSelectedDate(rawDate);
    setSelectedTimeRange(`${slot.timeFrom} - ${slot.timeTo}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTimeSlotId || !selectedTopicId || !selectedDate) return;

    const dateTime = `${selectedDate}T${selectedTimeRange.split(' - ')[0]}`;
    const isoDateTime = new Date(dateTime).toISOString();

    const newRes = {
      userId: currentUserId,
      timeSlotId: selectedTimeSlotId,
      reservationDate: isoDateTime,
      status: 'Confirmed',
      topicId: selectedTopicId
    };

    addReservation(newRes)
      .then(() => setSubmitted(true))
      .catch(err => console.error('Klaida kuriant rezervaciją:', err));
  };

  // Filtruojame tik tuos langus, kurie patenka į einamąją savaitę
  const visibleSlots = employeeTimeSlots.filter(slot => {
    const slotDate = new Date(slot.slotDate.split('T')[0]);
    const weekEnd = addDays(currentWeekStart, 6);
    return slotDate >= currentWeekStart && slotDate <= weekEnd;
  });

  return (
    <div className="weekly-schedule-container">
      <h2>Rezervacija vizitui į centrą</h2>
      {submitted ? (
        <div className="success-message">
          <p>Dėkojame už rezervaciją! Jūsų vizitas patvirtintas.</p>
          <button className="btn"><Link to="/">Atgal</Link></button>
        </div>
      ) : (
        <>
          <div className="week-navigation">
            <button onClick={handlePreviousWeek}>Ankstesnė savaitė</button>
            <span>{currentWeekStart.toLocaleDateString('lt-LT')} - {addDays(currentWeekStart, 6).toLocaleDateString('lt-LT')}</span>
            <button onClick={handleNextWeek}>Kita savaitė</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="topic">Pasirinkite vizito temą:</label>
              <select id="topic" value={selectedTopicId ?? ''} onChange={handleTopicChange} required>
                <option value="">-- Pasirinkite temą --</option>
                {topics.map(t => <option key={t.topicId} value={t.topicId}>{t.topicName}</option>)}
              </select>
            </div>

            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Data</th><th>Laikas (nuo - iki)</th><th>Darbuotojas ID</th><th>Pasirinkti</th>
                </tr>
              </thead>
              <tbody>
                {visibleSlots.length === 0 ? (
                  <tr><td colSpan={4}>Nėra laisvų laiko langų šiai savaitei</td></tr>
                ) : (
                  visibleSlots.map(slot => {
                    const [y, m, d] = slot.slotDate.split('T')[0].split('-').map(Number);
                    const displayDate = new Date(y, m-1, d).toLocaleDateString('lt-LT');
                    const timeRange = `${slot.timeFrom} - ${slot.timeTo}`;
                    return (
                      <tr key={slot.timeSlotId} className={slot.timeSlotId === selectedTimeSlotId ? 'selected' : ''}>
                        <td>{displayDate}</td>
                        <td>{timeRange}</td>
                        <td>{slot.employeeId}</td>
                        <td><button type="button" className="btn" onClick={() => handleTimeSlotClick(slot)}>Pasirinkti</button></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {selectedTimeSlotId && selectedDate && (
              <div className="selected-info">
                <p>Laiko lango ID: {selectedTimeSlotId}</p>
                <p>Data: {new Date(selectedDate).toLocaleDateString('lt-LT')}, Laikas: {selectedTimeRange}</p>
              </div>
            )}

            <button type="submit" className="btn" disabled={!selectedTimeSlotId || !selectedTopicId}>Rezervuoti</button>
          </form>
        </>
      )}
    </div>
  );
};

export default WeeklyScheduleReservation;
