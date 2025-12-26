import { ChevronDown, ChevronRight, User, X } from "lucide-react"
import '../../App.css'
import ProfileMenu from "./ProfileMenu"
import ProfilePage from "./ProfileMenu"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar({sidebarOpen,setSidebarOpen,programStructure,expandedProgram,program,department,setDepartment,setExpandedProgram,handleProgramClick}){

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("user")))
  


  function navToProfilePage(){
    navigate('/home/profile')
  }
  return (
    <>
      {/* Backdrop/Overlay - darkens background when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - overlays on top */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-slate-800 text-white
                    transform transition-transform duration-300 ease-in-out
                    shadow-2xl z-50 flex flex-col
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="font-bold text-lg">Programs</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Program List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-2">
          {Object.keys(programStructure).map((prog) => {
            const { icon, departments } = programStructure[prog]
            const isExpanded = expandedProgram === prog
            const isActive = program === prog

            return (
              <div key={prog}>
                {/* Program Button */}
                <button
                  onClick={() => {
                    if (isExpanded && isActive) {
                      setExpandedProgram(null)
                    } else {
                      handleProgramClick(prog)
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-slate-700 shadow-lg'
                      : 'hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-medium">{prog}</span>
                  </div>
                  {departments.length > 1 && (
                    isExpanded ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Department Sub-menu */}
                {isExpanded && departments.length > 1 && (
                  <div className="ml-6 mt-2 space-y-1">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setDepartment(dept)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                          department === dept
                            ? 'bg-slate-600 text-white font-medium'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex justify-between  mb-3 mx-4" >
          {role !== "none"
          ?<div className="flex w-full bg-slate-700 hover:bg-slate-600 cursor-pointer gap-2 px-3 py-2 rounded-lg" onClick={()=>navToProfilePage()}><User/><h2>{user.name}</h2></div>
          :<button className="w-full py-2 bg-red-500 cursor-pointer hover:bg-red-400 rounded-lg" onClick={()=>navigate('/')}>Login</button>}</div>
      </div>
    </>
  )

}