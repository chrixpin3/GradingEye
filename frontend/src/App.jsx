import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout.jsx";
import GradeResult from "./components/GradeResult.jsx";
import InactivityHandler from "./components/InactivityHandler";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <InactivityHandler>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />} />
                <Route path="/result" element={<GradeResult />} />
              </Route>
            </Routes>
          </Router>
        </InactivityHandler>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;