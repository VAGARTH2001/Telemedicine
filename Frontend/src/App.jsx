import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserLayout from './Components/UserLayout/UserLayout';
import DoctorLayout from './Components/DoctorLayout/DoctorLayout';
import ProtectedDoctor from './Components/ProtectedDoctor/ProtectedDoctor';

import Home from './pages/Home';
import FindDoctor from './pages/FindDoctor';
import AI from './pages/AiDoctor';
import VideoConsultant from './pages/VideoConsultant';
import AppointmentDoctors from './pages/AppointmentDoctors';
import Profile from './pages/Profile';
import MedicalInsights from './pages/MedicalInsights';

import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatients from './pages/DoctorPatients';
import DoctorPatientsSeen from './pages/DoctorPatientsSeen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/user" element={<LoginPage />} />
        <Route path="/login/doctor" element={<LoginPage />} />
        <Route path="/register/user" element={<RegisterPage />} />
        <Route path="/register/doctor" element={<RegisterPage />} />

        {/* User / Patient app */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/FindDoctor" element={<FindDoctor />} />
          <Route path="/FindDoctor/:id" element={<FindDoctor />} />
          <Route path="/AIDoctor" element={<AI />} />
          <Route path="/VideoConsultant" element={<VideoConsultant />} />
          <Route path="/VideoConsultant/doctors" element={<AppointmentDoctors />} />
          <Route path="/VideoConsultant/doctors/:id" element={<Profile />} />
          <Route path="/MedicalConsultant" element={<MedicalInsights />} />
        </Route>

        {/* Doctor app (protected) */}
        <Route path="/doctor" element={<ProtectedDoctor />}>
          <Route element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="patients-seen" element={<DoctorPatientsSeen />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
