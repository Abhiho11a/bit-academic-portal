import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

import RolePopup from "./components/common/RoleUi";
import AuthPage from "./pages/AuthPage";
import OtpPage from "./pages/OtpPage";
import Home from "./pages/Home";
import ProfilePage from "./components/common/ProfileMenu";
import AddBosPage from "./pages/AddBosPage";
import AddFacultyPage from "./pages/AddFaculty";
import ManageBos from "./pages/ManageBos";
import ManageFaculty from "./pages/ManageFaculty";

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
            <RolePopup 
              role={role} 
              setRole={setRole}
              closePopup={closePopup}
            />
          
        }
      />

      <Route
        path="/auth"
        element={
          <AuthPage
            role={role}
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
      <Route path="/home" element={<Home role={role} user={userData}/>} />
      <Route
        path="/home/profile"
        element={
          <ProfilePage backToHome={()=>navigate("/home")}/>
        }
      />
      <Route
        path="/home/add-bos"
        element={
          <AddBosPage/>
        }
      />
      <Route
        path="/home/manage-bos"
        element={
          <ManageBos/>
        }
      />
      <Route
        path="/home/manage-faculty"
        element={
          <ManageFaculty/>
        }
      />
      <Route
        path="/home/add-faculty"
        element={
          <AddFacultyPage/>
        }
      />

    </Routes>
  );
}
