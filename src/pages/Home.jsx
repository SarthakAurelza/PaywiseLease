import CarList from '@/components/MainSite_Components/CarList'
import Disclaimer from '@/components/Disclaimer'
import Hero from '@/components/Hero_Components/Hero'
import Info from '@/components/Info'
import Request from '@/components/calculationSide/Request'

import React from 'react'
import CompareButton from '@/components/comparison/CompareButton'


const Home = () => {
  return (
    <div className='w-full'>
      <Hero />
      <CarList />
      <Disclaimer />
      <Info />
      <Request />
      <CompareButton />
    </div>
  )
}

export default Home
