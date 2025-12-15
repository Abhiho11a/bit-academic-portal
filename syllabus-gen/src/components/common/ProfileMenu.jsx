import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage({backToHome}) {
  const navigate = useNavigate();

  const [user,setUser] = useState(JSON.parse(localStorage.getItem("user")))
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
      <div className="bg-white w-[380px] p-8 rounded-2xl shadow-xl relative animate-slideUp">

        {/* Close Button */}
        <button
          onClick={backToHome}
          className="absolute top-5 right-6 text-xl font-bold text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-gray-200 p-4 rounded-full">

            <User size={40} />
          </div>

          <h2 className="text-xl font-semibold">{user.name||'-'}</h2>
        </div>

        <hr className="my-4" />

        {/* User Details */}
        <div className="space-y-3">
          <p><b>Email:</b> {user.email?user.email:'-'}</p>
          <p><b>Phone:</b> {user.phone?user.phone:'-'}</p>
          <p><b>Department:</b> {user.department?user.department:"—"}</p>
          <p><b>Role:</b> {user.role?user.role:"—"}</p>
          {user.role === "faculty" && <p><b>Subject Code:</b> {user.subjectCode || "—"}</p>}
        </div>

        <hr className="my-4" />

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="w-full flex justify-center items-center gap-2 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}
