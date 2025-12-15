import { Plus, Edit, Trash2, Mail, Phone, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ManageFaculty() {
  // 🔹 Later: fetch faculty list from Supabase

  const [facultyList,setFaculties] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  useEffect(()=>{

    async function fetchFaculty(){
        const {data,error} = await supabase.from("faculty_members").select("*").eq("department",user.department)
        setFaculties(data)
    }

    fetchFaculty()
  },[])

  async function deleteFaculty(del_id) {
    const del_fac = facultyList.find(fac => fac.id === del_id)
    const filtereData = facultyList.filter(fac => fac.id !== del_id)

    if(confirm("Are u sure want to delete faculty: "+del_fac.name))
    {
        const{error} = await supabase.from("faculty_members").delete().eq("id",del_id);
    
        if(!error)
            setFaculties(filtereData)
        else
            alert("Error in deleting faculty...Please Try again!!")
    }
  }

  function handleEditFaculty(fac){
    navigate("/home/add-faculty",{state:{facultyData:fac,isEdit:true}})
  }



  return (
    <div className="p-4 md:py-8 md:px-15">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 ">
        <button
          onClick={() => {
            navigate("/home")
          }}
          className="flex items-center gap-2 bg-black/10 text-black
                     px-5 py-2 rounded-full font-semibold
                     hover:bg-slate-200 transition border-blue-200 border-2 hover:border-blue-500"
        >
          <ArrowLeft size={18} />
          Back to home
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          Manage Faculty
        </h2>

        <button
          onClick={() => {
            navigate("/home/add-faculty")
          }}
          className="flex items-center gap-2 bg-blue-600 text-white
                     px-5 py-2 rounded-full font-semibold
                     hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Faculty
        </button>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {facultyList.map((faculty) => (
          <div
            key={faculty.id}
            className="bg-white rounded-2xl shadow-md
                       border border-slate-200
                       p-5 hover:shadow-lg transition"
          >

            {/* Top Row */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-slate-800">
                {faculty.name}
              </h3>

              <div className="flex gap-3">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    handleEditFaculty(faculty)
                  }}
                >
                  <Edit size={18} />
                </button>

                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    deleteFaculty(faculty.id)
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>{faculty.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>{faculty.phone}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium
                               bg-slate-100 text-slate-700">
                Dept: {faculty.department}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-medium
                               bg-blue-100 text-blue-700">
                Subject: {faculty.subject_code}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
