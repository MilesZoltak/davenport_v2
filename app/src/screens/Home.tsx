// src/screens/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '@/styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <h1>Welcome to Davenport!</h1>
      <p>This app allows you to explore the wide wild world of MIDI piano</p>

      <div className="button-list">
        <div className="button-item">
          <h3>1. MIDI Recorder</h3>
          <p>Play piano and have the notes display on a piano roll.  Also, record and save .mp3 files for sharing and upload.</p>
          <Link to="/midi-recorder" className="button-link">Go to MIDI Editor</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
