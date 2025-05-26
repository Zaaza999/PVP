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
export const getTimeSlotsByTopic = (topicId: number)        =>
  apiCall("get", `EmployeeTimeSlots/by-topic/${topicId}`);
export const addTimeSlot = (data: any) => apiCall("add", "EmployeeTimeSlots", "", data);
export const updateTimeSlot = (id: number, data: any) => apiCall("update", "EmployeeTimeSlots", id, data);
export const deleteTimeSlot = (id: number) => apiCall("delete", "EmployeeTimeSlots", id); 

export const getVisitTopics = () => apiCall("get", "VisitTopics"); 


export const getLocations = () => apiCall("get", "Locations");
  
export const getWasteTypes = () => apiCall("get", "WasteTypes");
  
export const getSchedules = () => apiCall("get", "GarbageCollectionSchedules");

export const subscribeUser = (userId: string) => apiCall("update", "Users", `${userId}/subscribe`); 
export const cancelSubscription = (userId: string) => apiCall("update", "Users", `${userId}/unsubscribe`);
export const getResidents = () => apiCall("get", "Residents/residents"); 


export const getEmployeeDaySchedule = (employeeId: string, dateISO: string) => apiCall("get", `EmployeeTimeSlots/employee/${employeeId}/by-date?date=${dateISO}`);

export const addEmployeeTask = (employeeId: string, data: {
    date: string;          // "YYYY-MM-DD"
    from: string;          // "HH:mm"
    to: string;            // "HH:mm"
    topic: string;
    description?: string;
  }
) => apiCall( "add", `EmployeeTimeSlots/employee/${employeeId}/add-task`, "", data ); 
// export const addEmployeeTask = (employeeId: string, data: AddTaskReq) =>
//   apiCall("post", `EmployeeTimeSlots/employee/${employeeId}/add-task`, "", data);


    
