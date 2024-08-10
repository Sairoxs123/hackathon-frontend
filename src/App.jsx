import React from 'react'
import Home from './components/HomePage/Home'
import Signup from './components/Account/Signup';
import Login from './components/Account/Login';
import Verification from './components/Account/Verification';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/verification/:verification" element={<Verification />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
