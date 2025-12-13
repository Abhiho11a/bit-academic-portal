import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

import RolePopup from "./components/common/RoleUi";
import AuthPage from "./pages/AuthPage";
import OtpPage from "./pages/OtpPage";
import Home from "./pages/Home";

export default function App() {
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  const navigate = useNavigate();

  const closePopup = () => setShowPopup(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          showPopup ? (
            <RolePopup 
              role={role} 
              setRole={setRole}
              closePopup={closePopup}
            />
          ) : null
        }
      />

      <Route
        path="/auth"
        element={
          <AuthPage
            onContinue={(data) => {
              setUserData(data);
              navigate("/otp");
            }}
          />
        }
      />

      <Route
        path="/otp"
        element={
          <OtpPage
            userData={userData}
            onVerified={() => navigate("/home")}
          />
        }
      />

      <Route path="/home" element={<Home role={role} />} />
    </Routes>
  );
}
