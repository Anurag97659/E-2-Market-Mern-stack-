import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import REGISTRATION from './comp/registration';
import Login from './comp/login';
import Dash from './comp/dashboard';
import Product from './comp/Product';
import ChangeDetails from './comp/change-details';
import ChangePassword from './comp/change-password';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<REGISTRATION />} /> 
        <Route path="/registration" element={<REGISTRATION />} />
        <Route path="/login" element={<Login />} />
        <Route path='/Change-details' element={<ChangeDetails/>} />
        <Route path='/Change-password' element={<ChangePassword/>} />
        <Route path='/dash' element={<Dash/>} />
        <Route path='/Add-product' element={<Product/>} />
      </Routes>
    </Router>
  );
}

export default App;
