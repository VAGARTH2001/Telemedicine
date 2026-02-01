import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/doctor/patients`)
      .then((res) => res.json())
      .then((data) => {
        setPatients(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => setError('Failed to load patients'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="font-serif">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patients list</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="font-serif">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Patients list</h1>
      <p className="text-gray-600 mb-6">All patients under your care</p>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden md:table-cell">Last visit</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden lg:table-cell">Next appointment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No patients yet
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{p.email}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.lastVisit || '–'}</td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{p.nextAppointment || '–'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
