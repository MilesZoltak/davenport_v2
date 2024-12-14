// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/Home';
import MidiRecorder from './screens/MidiRecorder';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/midi-recorder" element={<MidiRecorder/>} />
      </Routes>
    </Router>
  );
};

export default App;
