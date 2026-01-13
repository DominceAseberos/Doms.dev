import { useState } from 'react'
import './App.css'

import MainLayout from "./layout/MainLayout.jsx"
import Dashboard from "./pages/dashboard.jsx"

function App() {

  return (
    <>
       <MainLayout>
        <Dashboard/>
       </MainLayout> 
   
    </>
  )
}
export default App
