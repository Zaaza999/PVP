import { apiCall } from "./apiCall";

// Naudotojo API funkcijos
export const getUser = (id: string) => apiCall("get", "Users", id);
export const addUser = (data: any) => apiCall("add", "Users", "", data);
export const updateUser = (id: string, data: any) => apiCall("update", "Users", id, data);
export const deleteUser = (id: number) => apiCall("delete", "Users", id);

// Rezervacijų API funkcijos
export const getUserReservations = (userId: string) => apiCall("get", `Reservations/ByUser?userId=${userId}`);
export const getUserReservationsAlt = (userId: number) => apiCall("get", "Reservations/Naudotojas", userId);
export const addReservation = (data: any) => apiCall("add", "Reservations", "", data);
export const updateReservation = (id: number, data: any) => apiCall("update", "Reservations", id, data);
export const deleteReservation = (id: number) => apiCall("delete", "Reservations", id);

// Laiko intervalų (EmployeeTimeSlots) API funkcijos
export const getTimeSlots = () => apiCall("get", "EmployeeTimeSlots");
export const addTimeSlot = (data: any) => apiCall("add", "EmployeeTimeSlots", "", data);
export const updateTimeSlot = (id: number, data: any) => apiCall("update", "EmployeeTimeSlots", id, data);
export const deleteTimeSlot = (id: number) => apiCall("delete", "EmployeeTimeSlots", id); 

export const getVisitTopics = () => apiCall("get", "VisitTopics"); 


export const getLocations = () => apiCall("get", "Locations");
  
export const getWasteTypes = () => apiCall("get", "WasteTypes");
  
export const getSchedules = () => apiCall("get", "GarbageCollectionSchedules");

