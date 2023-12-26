import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignInPage';
import SignUp from './pages/SignUpPage';
import ForgotPassword from './pages/ForgotPasswordPage';
import ResetPassword from './pages/ResetPasswordPage';
function App() {
  return (
    <Router>
        <Routes>
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/forgotpassword' element={<ForgotPassword/>}/>
          <Route path='/resetpassword' element={<ResetPassword/>}/>
        </Routes>
    </Router>
  );
}

export default App;
