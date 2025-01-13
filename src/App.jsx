import React from 'react';
import Filter from './components/Filter';
import CarList from './components/CarList';
import './index.css'
import CompareCars from './components/CompareCars';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompareButton from './components/CompareButton';

const App = () => {
  return (
    <div className='font-Quicksand'>
      <Hero />
      <CarList />
      <CompareCars />
      <CompareButton />
    </div>
  );
};

export default App;
