import React from "react";
import "./App.css";
import Header from "./components/Header";
import List from "./components/List";
import Detail from "./components/Details";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* This is your App-header */}
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/animal/:animalId" element={<Detail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
