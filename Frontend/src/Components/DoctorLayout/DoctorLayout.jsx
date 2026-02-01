import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import hamburger from '../Assest/hamburger.png';
import close from '../Assest/close.png';

const DoctorLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const nav = [
    { path: '/doctor', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/doctor/patients', label: 'Patients list', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/doctor/patients-seen', label: 'Patients seen', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden bg-indigo-700 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40 shadow">
        <Link to="/doctor" className="font-bold font-serif text-lg">Doctor Portal</Link>
        <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          <img src={menuOpen ? close : hamburger} alt="menu" className="w-6 h-6 invert" />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          menuOpen ? 'fixed inset-0 z-30 bg-indigo-700 w-64 pt-14' : 'hidden'
        } md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:pt-0 bg-indigo-800 text-white shadow-xl`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4 md:pt-6">
            <Link to="/doctor" className="font-bold font-serif text-xl text-white block">
              Doctor Portal
            </Link>
            <p className="text-indigo-200 text-sm mt-1 truncate">{user?.email}</p>
          </div>
          <nav className="flex-1 px-3 pb-4 space-y-1">
            {nav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-indigo-600">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-indigo-100 hover:bg-indigo-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay when menu open on mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
