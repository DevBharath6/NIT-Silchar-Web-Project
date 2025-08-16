import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home';
import About from './pages/About';
import Committee from './pages/Committees';
import Contact from './pages/Contact';
import Schedules from './pages/Schedules';
import MainLayout from './layouts/MainLayout';
import Speakers from './pages/Speakers';
import CallForPaper from './pages/CallForPaper';
import Registration from './pages/Registration';
import FAQ from './pages/FAQ';




function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="about" element={<About />} />
              <Route path="callforpaper" element={<CallForPaper />} />
              <Route path="committees" element={<Committee />} />
              <Route path="contact" element={<Contact />} />
              <Route path="register" element={<Registration />} />
              <Route path="schedule" element={<Schedules />} />
              <Route path="speakers" element={<Speakers />} /> 
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
