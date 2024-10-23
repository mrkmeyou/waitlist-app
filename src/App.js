// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import VisitDetails from './pages/VisitDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visits/:id" element={<VisitDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
