import './App.css';
import React from "react";
import {Routes, Route} from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainPage from "./main_page/MainPage";

function App() {
    const theme = 'light'; ///TODO use a toggle button and update either here or within pages

  return (
    <div className="App">
        <Routes>
            <Route path="/inbox" element={<MainPage theme={theme} />} />
        </Routes>
    </div>
  );
}

export default App;
