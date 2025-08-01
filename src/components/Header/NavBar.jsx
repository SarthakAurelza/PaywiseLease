import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { buttons } from '../typography/typography';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ["Home","Novated Leasing","Contact"]
  return (
    <header className="bg-white shadow-md px-2 sm:px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/logo.svg" alt="Paywise Logo" className="h-6 md:h-8" />
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-8 text-slate-800 font-medium">
        {navItems.map((item)=>(
          <a className='text-primary font-bold hover:underline lg:text-xl' href="#">{item}</a>
        ))}
        <button className={buttons.navbar_requestaquote}>
          REQUEST A QUOTE
        </button>
      </nav>

      {/* Mobile Button + Menu */}
      <div className="md:hidden flex items-center md:space-x-3">
        <button className={buttons.navbar_requestaquote}>
          REQUEST A QUOTE
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-800">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md border-t mt-2 flex flex-col items-start px-4 py-3 space-y-2 md:hidden z-50">
          {navItems.map((item)=>(
            <a className='text-primary font-bold hover:underline lg:text-xl' href="#">{item}</a>
          ))}
        </div>
      )}
    </header>
  );
}
