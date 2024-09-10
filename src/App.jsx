import React from 'react'
import Home from './components/HomePage/Home'
import Signup from './components/Account/Signup';
import Login from './components/Account/Login';
import Questions from './components/Questions/Questions';
import Question from './components/Questions/Question';
import Verification from './components/Account/Verification';
import Competition from './components/Competition/Competition';
import Coding from './components/Competition/Coding';
import ProgressBar from './ProgressBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <ProgressBar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/verification/:verification" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/question/:qid" element={<Question />} />
        <Route path="/competition" element={<Competition />} />
        <Route path="/competition/:compid" element={<Coding />} />
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
