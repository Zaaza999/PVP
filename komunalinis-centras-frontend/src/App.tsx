import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the pages/components
import Main from './Pages/Main/Main';
import Reservation from './Pages/Rezervations/Reservation';

function App() {
  return (
    <Router>
      <Routes>
        {/* This route will show the Main component at the root path */}
        <Route path="/" element={<Main />} />
        
        {/* This route will show the Reservation component at /reservation */}
        <Route path="/reservation" element={<Reservation />} />
      </Routes>
    </Router>
  );
}

export default App;
