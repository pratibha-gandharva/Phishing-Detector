import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Scanner from "./pages/Scanner";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: "#0f1117", color: "#e2e8f0", border: "1px solid #2d3748" }
      }} />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"         element={<Scanner />} />
          <Route path="/history"  element={token ? <History /> : <Navigate to="/login" />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
