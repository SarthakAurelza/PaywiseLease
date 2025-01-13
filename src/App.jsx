import React, { useRef } from 'react';
import Filter from './components/Filter';
import CarList from './components/CarList';
import './index.css'
import CompareCars from './components/CompareCars';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompareButton from './components/CompareButton';
import Disclaimer from './components/Disclaimer';
import Info from './components/Info';

const App = () => {
  const compareCarsRef = useRef(null);

  return (
    <div className='font-Quicksand'>
      <Hero />
      <CarList />
      <div ref={compareCarsRef}>
        <CompareCars />
      </div>
      <CompareButton compareCarsRef={compareCarsRef} />
      <Disclaimer />
      <Info />
    </div>
  );
};

export default App;
