import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import DepartmentAttendance from './components/DepartmentAttendance';
import AdminHome from './components/AdminHome';
import DepartmentMenu from './components/DepartmentMenu';
import AdvisorMenu from './components/AdvisorMenu';
import MentorMenu from './components/MentorMenu';

const AppRouter = () => {
return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/admin-home" element={<AdminHome/>}/>
    <Route path="/DepartmentMenu" element={<DepartmentMenu/>}/>
    <Route path="/AdvisorMenu" element={<AdvisorMenu />} />
    <Route path="/MentorMenu" element={<MentorMenu/>} />
    <Route path="/DepartmentAttendance" element={<DepartmentAttendance />} />

    </Routes>
);
};

export default AppRouter;
