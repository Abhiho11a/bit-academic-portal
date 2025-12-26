import { CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RolePopup({role,setRole,closePopup}) {

    const [selectedRole,setSelectedRole] = useState(null)
    const nav = useNavigate()

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      closePopup();
    } else {
      setRole(storedRole);
    }
  }, []);

  const confirmRole = () => {
    localStorage.setItem("role", selectedRole);
    nav('/auth')
    closePopup()
  };

  const handleClose = () => {
    if(confirm("Are u sure want to view web as a guest?")){
      setRole("none");
      localStorage.setItem("role", "none");
      closePopup();
      nav('/home')
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 relative">
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[350px] relative animate-slideUp">

            <button onClick={handleClose} 
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold">
              ✕
            </button>   

            <h2 className="text-xl font-semibold text-gray-700 text-center">
              BANGALORE INSTITUTE OF TECHNOLOGY
            </h2>
            <hr className="border-gray-300 my-3" />

            <h2 className="text-center text-xl text-gray-500">Select role</h2>

            <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-1/4 bg-gray-800 text-white rounded-full py-3 items-center px-4 font-semibold hover:bg-gray-900 transition"
                      onClick={() => setSelectedRole("dean")}>
                    <CheckCircle size={18} color="green" className={`opacity-0 ${selectedRole === "dean"?"opacity-100":''}`}/>
                    <button className="flex-3/4 -ml-2"> Dean </button>
                </div>

                <div className="flex flex-1/4 bg-gray-800 text-white rounded-full py-3 items-center px-4 font-semibold hover:bg-gray-900 transition"
                     onClick={() => setSelectedRole("bos")}>
                    <CheckCircle size={18} color="green" className={`opacity-0 ${selectedRole === "bos"?"opacity-100":''}`}/>
                    <button className="flex-3/4 -ml-2">
                        Board of Studies (BoS)
                    </button>
                </div>

                <div className="flex flex-1/4 bg-gray-800 text-white rounded-full py-3 items-center px-4 font-semibold hover:bg-gray-900 transition"
                     onClick={() => setSelectedRole("faculty")}>
                    <CheckCircle size={18} color="green" className={`opacity-0 ${selectedRole === "faculty"?"opacity-100":''}`}/>
                    <button 
                        className="flex-3/4 -ml-2">
                        Faculty
                    </button>
                </div>

              
            </div>

            {/* Confirm Button */}
            <div className="flex justify-center">
                <button
                    disabled={!selectedRole}
                    onClick={confirmRole}
                    className={`px-10 py-2 rounded-full mt-4 font-semibold transition ${
                    selectedRole
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Set Role
                </button>
            </div>
          </div>
        </div>
    </div>
  );
}
