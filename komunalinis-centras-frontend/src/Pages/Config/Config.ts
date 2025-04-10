// src/config.ts

// Pagrindinis API adresas, kurį vėliau lengva keisti jei reikia
export const API_URL = "http://localhost:5190";

// Susieti endpoint'ai naudojami atitinkamoms API funkcijoms
export const ENDPOINTS = {
  EMPLOYEE_TIME_SLOTS: `${API_URL}/EmployeeTimeSlots`,
  VISIT_TOPICS: `${API_URL}/VisitTopics`,
  RESERVATIONS: `${API_URL}/Reservations`,
};
