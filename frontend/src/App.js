import './App.css';
import React from "react";
import {Routes, Route} from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainPage from "./main_page/MainPage";

function App() {

  return (
    <div className="App">
        <Routes>
            <Route path="/inbox" element={<MainPage/>} />
        </Routes>
    </div>
  );
}

export default App;
