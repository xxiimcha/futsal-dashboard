import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Players from "./pages/Players"
import Progress from "./pages/Progress"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import VerifyEmail from "./pages/VerifyEmail"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" />} />
      <Route path="/players" element={isLoggedIn ? <Players onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" />} />
      <Route path="/progress" element={isLoggedIn ? <Progress onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
    </Routes>
  )
}