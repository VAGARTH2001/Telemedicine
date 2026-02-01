import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DoctorPatientsSeen = () => {
  const [seen, setSeen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/doctor/patients-seen`)
      .then((res) => res.json())
      .then((data) => {
        setSeen(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="font-serif">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patients seen</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="font-serif">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Patients seen</h1>
      <p className="text-gray-600 mb-6">Consultation history</p>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Patient</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Reason</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {seen.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No consultations yet
                  </td>
                </tr>
              ) : (
                seen.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.date}</td>
                    <td className="px-4 py-3 text-gray-600">{s.reason || '–'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.duration || '–'}</td>
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

export default DoctorPatientsSeen;
