import React, { useRef } from 'react';
import './index.css'

import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import Home from './pages/Home';
import CompareCars from './pages/CompareCars';
import Navbar from './components/Header/NavBar';




const App = () => {
  const compareCarsRef = useRef(null);

  return (
    <div className='font-Quicksand'>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compare" element={<CompareCars />} />
    </Routes>
    </div>
  );
};

export default App;
