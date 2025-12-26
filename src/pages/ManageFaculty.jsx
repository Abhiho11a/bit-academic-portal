import { Plus, Edit, Trash2, Mail, Phone, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";

export default function ManageFaculty() {
  // 🔹 Later: fetch faculty list from Supabase

  const [facultyList,setFaculties] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const [loading,setLoading] = useState(false);
  
  const navigate = useNavigate()

  useEffect(()=>{

    async function fetchFaculty(){
        setLoading(true)
        const {data,error} = await supabase.from("faculty_members").select("*").eq("department",user.department)
        setLoading(false)
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
    <div className="flex flex-col justify-center items-center p-6">

      {/* Header */}
      <div className="flex w-full md:w-[90%] justify-between items-center mb-6">
        <button
          onClick={() => {
            navigate("/home")
          }}
          className="flex items-center gap-2 bg-black/10 text-black
                     px-5 py-2 rounded-full font-semibold
                     hover:bg-slate-200 transition border-blue-200 border-2 hover:border-blue-500"
        >
          <ArrowLeft size={18} />
          <h2 className="hidden md:block">Back to home</h2>
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
          <h2 className="hidden md:block">Add Faculty</h2>
        </button>
      </div>

      {/* Faculty Cards Grid */}
      {loading?<Loading msg="Loading..."/>:<div className="grid w-full md:w-[90%] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 ">
  {facultyList.map((faculty) => (
    <div
      key={faculty.id}
      className="bg-white rounded-3xl shadow-md
                 border border-slate-200
                 p-6 sm:p-7 lg:p-8
                 hover:shadow-xl hover:-translate-y-1
                 transition-all duration-300"
    >

      {/* Top Row */}
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 leading-snug">
          {faculty.name}
        </h3>

        <div className="flex gap-3 shrink-0">
          <button
            className="text-blue-600 hover:text-blue-800 transition"
            onClick={() => handleEditFaculty(faculty)}
          >
            <Edit size={20} />
          </button>

          <button
            className="text-red-600 hover:text-red-800 transition"
            onClick={() => deleteFaculty(faculty.id)}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600">
        <div className="flex items-center gap-3">
          <Mail size={16} />
          <span className="break-all">{faculty.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={16} />
          <span>{faculty.phone}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="px-4 py-1.5 rounded-full text-sm font-medium
                         bg-slate-100 text-slate-700">
          Dept: {faculty.department}
        </span>

        <span className="px-4 py-1.5 rounded-full text-sm font-medium
                         bg-blue-100 text-blue-700">
          Subject: {faculty.subject_code}
        </span>
      </div>
    </div>
  ))}
</div>}

    </div>
  );
}
