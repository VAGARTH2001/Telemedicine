import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import bg from '../Components/Assest/homebg.jpg';

const DoctorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total patients', value: '24', color: 'bg-indigo-500', link: '/doctor/patients' },
    { label: 'Seen today', value: '5', color: 'bg-emerald-500', link: '/doctor/patients-seen' },
    { label: 'Upcoming', value: '8', color: 'bg-amber-500', link: '/doctor/patients' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 font-serif">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {user?.username || 'Doctor'}
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.specialty ? `${user.specialty} • ` : ''}Manage your patients and appointments
        </p>
      </div>

      {/* Hero / visual */}
      <div className="rounded-2xl overflow-hidden shadow-lg bg-indigo-600 text-white relative min-h-[180px] md:min-h-[220px]">
        <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full min-h-[180px] md:min-h-[220px]">
          <h2 className="text-xl md:text-2xl font-bold">Your dashboard</h2>
          <p className="text-indigo-100 mt-1">Quick access to patients and visits</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.link}
            className={`${s.color} rounded-xl p-6 text-white shadow hover:opacity-95 transition-opacity`}
          >
            <p className="text-white/90 text-sm font-medium">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick actions</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/doctor/patients"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">View patients list</p>
              <p className="text-sm text-gray-500">See all your patients</p>
            </div>
          </Link>
          <Link
            to="/doctor/patients-seen"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Patients seen</p>
              <p className="text-sm text-gray-500">History of consultations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
