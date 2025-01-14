import React from 'react'
import Hero from './Hero'
import CarList from './CarList'
import Disclaimer from './Disclaimer'
import Info from './Info'
import CompareButton from './CompareButton'

const HomePage = () => {
  return (
    <div className='w-full'>
      <Hero />
      <CarList />
      <Disclaimer />
      <Info />
      <CompareButton />
    </div>
  )
}

export default HomePage
