import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import WelcomePage from "./pages/WelcomePage";
import ProfilePage from "./pages/ProfilePage";
import AdminAddGames from "./pages/AdminAddGames";
import AppContext from "./context/AppContext";

function App() {
  const [user, setUser] = useState({ Username: "", IsLoggedIn: false });
  return (
    <AppContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/adminAddGames" element={<AdminAddGames />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
