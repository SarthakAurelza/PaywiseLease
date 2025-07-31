import React from 'react';

const SortFilterMenu = ({ show, toggle, setSortCriteria, toggleSortOrder, sortCriteria }) => (
  <div className='flex items-center gap-4'>
    <div className='relative'>
      <img
        className='cursor-pointer 3xl:w-12'
        src="/images/filter.png"
        alt="Filter"
        onClick={toggle}
      />
      {show && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded-md">
          <ul>
            <li className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={() => { setSortCriteria('price'); toggle(); }}>Price (Ascending)</li>
            <li className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={() => { setSortCriteria('fuel_consumption'); toggle(); }}>Fuel Consumption (Ascending)</li>
          </ul>
        </div>
      )}
    </div>

    <img
      className='cursor-pointer 3xl:w-12'
      src="/images/sort.png"
      alt="Sort"
      onClick={sortCriteria ? toggleSortOrder : undefined}
    />
  </div>
);

export default SortFilterMenu;
