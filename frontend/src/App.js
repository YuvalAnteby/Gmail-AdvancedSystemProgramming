import './App.css';
import React, {useState} from "react";
import {Routes, Route} from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainPage from "./main_page/MainPage";

function App() {
    const [theme, setTheme] = useState('light');

  return (
    <div className="App">
        <Routes>
            <Route path="/inbox" element={<MainPage theme={theme} setTheme={setTheme} />} />
        </Routes>
    </div>
  );
}

export default App;
