import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { CandidateList } from './pages/CandidateList';
import { CandidateForm } from './pages/CandidateForm';
import { CandidateDetail } from './pages/CandidateDetail';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  localStorage.getItem('token') ? <>{children}</> : <Navigate to="/login" />;

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/candidates" element={<PrivateRoute><CandidateList /></PrivateRoute>} />
      <Route path="/candidates/new" element={<PrivateRoute><CandidateForm /></PrivateRoute>} />
      <Route path="/candidates/:id" element={<PrivateRoute><CandidateDetail /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/candidates" />} />
    </Routes>
  </BrowserRouter>
);

export default App;