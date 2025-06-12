// Author: Yuval Anteby ,Dor Darmon
import './App.css';
import React from "react";
import {Routes, Route,Navigate} from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainPage from "./main_page/MainPage";
import SignupPage from "./first_Page/SignupPage";
import LoginPage from "./first_Page/LoginPage";

function App() {
    const theme = 'light'; ///TODO use a toggle button and update either here or within pages

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navigate to ="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/inbox" element={<MainPage theme={theme} />} />
            </Routes>
        </div>
    );
}

export default App;
