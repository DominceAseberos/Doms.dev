import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import MainLayout from "./layout/MainLayout.jsx"
import Dashboard from "./pages/dashboard.jsx"
import AboutMePage from "./pages/AboutMePage.jsx"

function App() {

  return (
    <Router>
      <Routes>
        {/* Main Dashboard Route */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {/* Dedicated About Me Page Route */}
        <Route
          path="/about"
          element={<AboutMePage />}
        />
      </Routes>
    </Router>
  )
}
export default App
