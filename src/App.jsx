import React, { useRef } from 'react';
import './index.css'
import CompareCars from './components/CompareCars';
import HomePage from './components/HomePage';
import { Route, Routes } from 'react-router-dom';




const App = () => {
  const compareCarsRef = useRef(null);

  return (
    <div className='font-Quicksand'>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/compare" element={<CompareCars />} />
    </Routes>
    </div>
  );
};

export default App;
