import React from 'react'

const Info = () => {
  return (
    <div className='flex flex-col w-full gap-16 3xl:gap-36 lg:p-16 3xl:py-24 md:p-8 sm:p-6 p-4'>
      <div className='flex flex-col md:w-[90%] lg:w-[65%] 3xl:w-[75%] gap-10'>
        <h2 className='font-semibold text-primary text-[19px] xs:text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl xxl:text-7xl 3xl:text-8xl leading-16'>What will my novated lease calculator results show?</h2>
        <p className='text-muted 3xl:text-3xl xxl:text-2xl 2xl:text-xl xl:text-lg sm:text-md xs:text-sm text-sm'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</p>

        <ul className='text-muted flex flex-col gap-4 list-disc pl-4 xxl:text-2xl 2xl:text-xl xl:text-lg sm:text-md xs:text-sm text-sm 3xl:text-3xl'>
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>

          <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</li>

          <li>Cillum in voluptate velit esse dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</li>
        </ul>
      </div>

      <div className='flex flex-col md:w-[90%] lg:w-[65%] gap-10'>
        <h2 className='font-semibold text-primary text-[19px] xs:text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl xxl:text-7xl leading-16 3xl:text-8xl'>Helping Australians since 1989!</h2>
        <p className='text-muted xxl:text-2xl 2xl:text-xl xl:text-lg sm:text-md xs:text-sm text-sm 3xl:text-3xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</p>

        <ul className='text-muted flex flex-col gap-4 list-disc pl-4 xxl:text-2xl 2xl:text-xl xl:text-lg sm:text-md xs:text-sm text-sm 3xl:text-3xl'>
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>

          <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</li>

          <li>Cillum in voluptate velit esse dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</li>
        </ul>
      </div>
    </div>
  )
}

export default Info
