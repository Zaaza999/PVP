// src/Axios/api.ts
import axios from "axios";

const BASE_URL = "http://localhost:5190"; // Galite naudoti aplinkos kintamuosius

export const apiCall = async (
  operation: string,
  endpoint: string,
  id: string | number = "",
  data: any = null
) => {
  let url = `${BASE_URL}/${endpoint}`;
  let method: "get" | "post" | "put" | "delete" = "get";
  let config: any = {};

  switch (operation) {
    case "get":
      if (id) url += `/${id}`;
      method = "get";
      break;
    case "add":
      method = "post";
      config = { data };
      break;
    case "update":
      if (id) url += `/${id}`;
      method = "put";
      config = { data };
      break;
    case "delete":
      if (id) url += `/${id}`;
      method = "delete";
      break;
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }

  try {
    const response = await axios({ url, method, ...config });
    return response.data;
  } catch (error) {
    console.error(`Error during ${operation} on endpoint "${endpoint}":`, error);
    throw error;
  }
};

// Naudotojo API funkcijos
export const getUser = (id: number) => apiCall("get", "Users", id);
export const addUser = (data: any) => apiCall("add", "Users", "", data);
export const updateUser = (id: number, data: any) => apiCall("update", "Users", id, data);
export const deleteUser = (id: number) => apiCall("delete", "Users", id);

// Rezervacijų API funkcijos
export const getUserReservations = (userId: number) => apiCall("get", `Reservations?userId=${userId}`);
export const getUserReservationsAlt = (userId: number) => apiCall("get", "Reservations/Naudotojas", userId);
export const addReservation = (data: any) => apiCall("add", "Reservations", "", data);
export const updateReservation = (id: number, data: any) => apiCall("update", "Reservations", id, data);
export const deleteReservation = (id: number) => apiCall("delete", "Reservations", id);

// Laiko intervalų (EmployeeTimeSlots) API funkcijos
export const getTimeSlots = () => apiCall("get", "EmployeeTimeSlots");
export const addTimeSlot = (data: any) => apiCall("add", "EmployeeTimeSlots", "", data);
export const updateTimeSlot = (id: number, data: any) => apiCall("update", "EmployeeTimeSlots", id, data);
export const deleteTimeSlot = (id: number) => apiCall("delete", "EmployeeTimeSlots", id);
