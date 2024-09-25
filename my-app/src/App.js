import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import NurseForm from './components/NurseForm';
import AdminForm from './components/AdminForm';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/nurse" element={<NurseForm />} />
          <Route path="/admin" element={<AdminForm />} />
          <Route path="/register" element={<RegisterForm />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;