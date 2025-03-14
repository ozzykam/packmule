import { useState, useEffect } from 'react'
import { Outlet, Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Nav />
            </header>
            <Outlet />
        </div>
    )
}

export default App
