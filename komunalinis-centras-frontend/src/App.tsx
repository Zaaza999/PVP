import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the pages/components
import Main from './Pages/Main/Main';
import Reservation from './Pages/Rezervations/Reservation'; 
import AddTime from './Pages/Rezervations/AddTime';
import Application from './Pages/Applications/Application'; 
import Profile from './Pages/Profile/Proflie'

function App() {
  return (
    <Router>
      <Routes>
        {/* This route will show the Main component at the root path */}
        <Route path="/" element={<Main />} />
        
        {/* This route will show the Reservation component at /reservation */}
        <Route path="/reservation" element={<Reservation />} /> 
        <Route path="/addTime" element={<AddTime />} /> 
        <Route path="/profile" element={<Profile />} />

        {/* This route will show the Reservation component at /reservation */}
        <Route path="/application" element={<Application />} />
      </Routes>
    </Router>
  );
}

export default App;
