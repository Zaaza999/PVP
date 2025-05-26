import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the pages/components
import Main from './Pages/Main/Main';
import Reservation from './Pages/Rezervations/Reservation'; 
import AddTime from './Pages/Rezervations/AddTime';
import Application from './Pages/Applications/Application'; 
import Profile from './Pages/Profile/Profile'
import LoginPage from "./Pages/Login/LoginPage";
import RegisterPage from "./Pages/Register/RegisterPage";
import RegisterWorker from "./Pages/RegisterWorker/RegisterPage";
import WorkerList from "./Pages/WorkerList/WorkerList";
import WorkerDetails from "./Pages/WorkerDetails/WorkerDetails";
import WorkerEdit from "./Pages/WorkerDetails/WorkerEdit";
import ApplicationList from "./Pages/ApplicationList/ApplicationList";
import ApplicationDetail from "./Pages/ApplicationDetail/ApplicationDetail";
import ResidentsPage from "./Pages/Residents/ResidentsPage";
import InvoicePage from './Pages/Bills/Bills';  
import WorkerSchedule from "./Pages/WorkerSchedule/DaySchedule" 

function App() {
  return (
    <Router>
      <Routes>
        {/* This route will show the Main component at the root path */}
        <Route path="/" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
        {/* This route will show the Reservation component at /reservation */}
        <Route path="/reservation" element={<Reservation />} /> 
        <Route path="/addTime" element={<AddTime />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-worker" element={<RegisterWorker />} />
        <Route path="/worker-list" element={<WorkerList />} />
        <Route path="/worker-list/:id" element={<WorkerDetails />} />
        <Route path="/worker-list/:id/edit" element={<WorkerEdit />} />
        <Route path="/application-list" element={<ApplicationList />} />
        <Route path="/application-list/:formType/:formId" element={<ApplicationDetail />} />
        <Route path="/residents" element={<ResidentsPage />} />
        <Route path="/application" element={<Application />} /> 
        <Route path="/invoices" element={<InvoicePage />} />  
        <Route path="/workschedule/:employeeId" element={<WorkerSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
