import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import WelcomePage from "./pages/WelcomePage";
import ProfilePage from "./pages/ProfilePage";
import AdminAddGames from "./pages/AdminAddGames";
import BrowsePage from "./pages/BrowsePage";
import AppContext from "./context/AppContext";
import GamePage from "./pages/GamePage";
import ListPage from "./pages/ListPage";
import BrowseDBPage from "./pages/BrowseDBPage";

function App() {
  const [user, setUser] = useState({
    User: "",
    ListInfo: "",
    IsLoggedIn: false,
  });

  useEffect(() => {
    if (window.localStorage.getItem("state") !== null) {
      setUser(JSON.parse(window.localStorage.getItem("state")));
    } else {
      window.localStorage.setItem("state", JSON.stringify(user));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("state", JSON.stringify(user));
  }, [user]);

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
          <Route path="/browse" element={<BrowseDBPage />} />
          <Route path="/browse2" element={<BrowsePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/adminAddGames" element={<AdminAddGames />} />
          <Route path="/game/:AppID" element={<GamePage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/list/:listId" element={<ListPage />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
