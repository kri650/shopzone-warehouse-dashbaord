import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import WarehouseLogin from './pages/WarehouseLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import WarehouseLayout from './layout/WarehouseLayout';
import Overview from './pages/Overview';
import Shipments from './pages/Shipments';
import Inventory from './pages/Inventory';
import Returns from './pages/Returns';
import Notifications from './pages/Notifications';

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<WarehouseLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['warehouse_staff', 'warehouse_manager']}>
              <WarehouseLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="returns" element={<Returns />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
