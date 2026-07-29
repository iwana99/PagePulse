import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MonitorPage from "./pages/MonitorPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/monitor/:id" element={<MonitorPage />} />
    </Routes>
  );
}

export default App;