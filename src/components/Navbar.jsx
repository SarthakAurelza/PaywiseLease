import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div className='w-full flex items-center justify-between h-16 p-4 bg-white'>
      <h3>Paywise</h3>

      <div className='w-[80%] flex flex-row items-center h-full gap-2 justify-between'>
        
          <input
            type="text"
            className="w-[120px] px-4 py-2 h-6 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        

        <p className='text-[12px] font-semibold text-primary'>Salary Packaging</p>

        <p className='text-[12px] font-semibold text-primary'>Novated Leasing</p>

        <p className='text-[12px] font-semibold text-primary'>Employee Benefits</p>

        <p className='text-[12px] font-semibold text-primary'>Employers</p>

        <p className='text-[12px] font-semibold text-primary'>Resources</p>

        <p className='text-[12px] font-semibold text-primary'>About</p>

        <p className='text-[12px] font-semibold text-primary'>Contact</p>

        <Button className="h-8 text-[12px]">Member Login</Button>
        <Button className="h-8 text-[12px]">Employer Login</Button>
      </div>
    </div>
  )
}

export default Navbar
