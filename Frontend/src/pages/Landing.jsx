import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'doctor') navigate('/doctor', { replace: true });
      else navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-950 font-serif tracking-tight">
          Telemedicine
        </h1>
        <p className="mt-2 text-lg text-gray-600 font-serif max-w-md mx-auto">
          Choose how you want to continue
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Patient card */}
        <div
          onClick={() => navigate('/login/user')}
          className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all duration-300 min-h-[220px]"
        >
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-blue-950 font-serif">I'm a Patient</h2>
          <p className="mt-2 text-sm text-gray-500 font-serif text-center">Find doctors, book appointments, get care</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate('/login/user'); }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              Login
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate('/register/user'); }}
              className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Doctor card */}
        <div
          onClick={() => navigate('/login/doctor')}
          className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all duration-300 min-h-[220px]"
        >
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-indigo-950 font-serif">I'm a Doctor</h2>
          <p className="mt-2 text-sm text-gray-500 font-serif text-center">Manage patients, view appointments</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate('/login/doctor'); }}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Login
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate('/register/doctor'); }}
              className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500 font-serif">
        Secure telehealth platform for patients and providers
      </p>
    </div>
  );
};

export default Landing;
