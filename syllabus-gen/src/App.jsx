import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import RolePopup from "./components/common/RoleUi";
import AuthPage from './pages/AuthPage'
import Home from "./pages/Home";

export default function App() {
  const [role, setRole] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RolePopup role={role} setRole={setRole} />} />
        <Route path="/auth" element={<AuthPage setRole={setRole} />} />
        <Route path="/home" element={<Home role={role} />} />
      </Routes>
    </BrowserRouter>
  );
}
