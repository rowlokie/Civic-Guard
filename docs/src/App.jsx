import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes"; // Dark mode support

import Navbar from "./Navbar/Navbar";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import ReportIssue from "./pages/Reportissue";
import Issues from "./pages/Issues";
import IssueDetails from "./pages/IssueDetails";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import AddCoupons from "./pages/AddCoupons";
import Leaderboard from "./pages/Leaderboard";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issue/:id" element={<IssueDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/store" element={<Store />} />
          <Route path="/addcoupons" element={<AddCoupons />} />
          <Route path="/admin/coupons" element={<AddCoupons />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
