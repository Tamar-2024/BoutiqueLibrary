// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Entry/Store';
import RegisterForm from './Entry/RegisterForm';
import LoginForm from './Entry/LoginForm';
import AuthPage from './Entry/AuthPage';
import EquipmentsList from './Equipments/EquipmentList';
import BorrowBook from './Equipments/BorrowBook';
import UserBorrows from './Equipments/UserBorrows';
import AdminEquipments from './Equipments/AdminEquipments';
import BookEditing from './Equipments/BookEditing';
import AdminBorrows from './Equipments/AdminBorrows';
import OverdueBorrows from './Equipments/OverdueBorrows';
import Header from './Header'; // ייבוא ה-header

const AppContent = () => {
  const location = useLocation();

  // נוודא שההדר לא יופיע בעמודים של התחברות והרשמה
  const showHeader = !['/login', '/register', '/'].includes(location.pathname);

  return (
    <div style={{ paddingTop: showHeader ? '64px' : '0' }}>
      {showHeader && <Header />} {/* מציג את ההדר רק אם לא מדובר בעמודים האלה */}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/equipments" element={<EquipmentsList />} />
        <Route path="/borrow/:equipmentId" element={<BorrowBook />} />
        <Route path="/borrows/me" element={<UserBorrows />} />
        <Route path="/admin/equipments" element={<AdminEquipments />} />
        <Route path="/admin/equipments/:id" element={<BookEditing />} />
        <Route path="/admin/borrows" element={<AdminBorrows />} />
        <Route path="/admin/borrows/overdue" element={<OverdueBorrows />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
