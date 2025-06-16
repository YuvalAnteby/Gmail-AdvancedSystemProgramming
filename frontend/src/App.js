import './App.css';
import React, {useState} from "react";
import {Routes, Route, Navigate} from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainPage from "./main_page/MainPage";
import SignupPage from "./first_Page/SignupPage";
import LoginPage from "./first_Page/LoginPage";

function App() {

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navigate to ="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/inbox" element={<MainPage />} />
            </Routes>
        </div>
    );
}

export default App;
