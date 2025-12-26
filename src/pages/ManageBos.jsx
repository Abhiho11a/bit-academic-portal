import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Phone, Mail, Pencil, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";
import Loading from '../components/common/Loading'

export default function ManageBoSPage() {
  const navigate = useNavigate();
  const [bosList, setBosList] = useState([]);
  const [loading,setLoading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"))
  useEffect(() => {

    async function fetchBos() {
      setLoading(true)
      const {data,error} = await supabase.from("bos_members").select("*")
      setBosList(data)
      setLoading(false)
    }
    fetchBos()
  }, []);

  function handleEditBoS(bos){
    navigate("/home/add-bos",{state:{isEdit:true,bosData:bos}})
  }
  async function deleteBos(del_id){
    const delBos = bosList.find(bos => bos.id === del_id)
    if(confirm("Are u sure want to delete bos: "+delBos.name))
    {
        const filteredData = bosList.filter(bos => bos.id !== del_id)
        const {error} = await supabase.from("bos_members").delete().eq("id",del_id)

        if(!error)
            setBosList(filteredData)
        else
            alert("Error in deleting Bos")
    }
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
                     hover:bg-slate-200 transition border-blue-200 border-2 hover:border-blue-500 cursor-pointer"
        >
          <ArrowLeft size={18} />
          <h2 className="hidden md:block">Back to home</h2>
        </button>
        <h1 className="text-2xl font-semibold text-slate-800 px-5 text-center">
          Manage Board of Studies
        </h1>

        {/* ➕ Add BoS (Dean only – check role before showing) */}
        <button
          onClick={() => navigate("/home/add-bos")}
          className="flex items-center gap-2
                     bg-purple-700 text-white px-5 py-2
                     rounded-full font-medium
                     hover:bg-purple-800 transition cursor-pointer"
        >
          <Plus size={18} />
          <h2 className="hidden md:block">Add BoS</h2>
        </button>
      </div>

      {/* 🧱 BoS Grid */}
      {loading?<Loading msg="Loading"/>:<div className="grid w-full md:w-[90%] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bosList.map((bos) => (
          <div
            key={bos.id}
            className="bg-white rounded-xl shadow-md
                       p-5 border border-slate-200
                       hover:shadow-lg transition"
          >
            {/* Avatar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="text-purple-700" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">
                  {bos.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {bos.department}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="text-sm text-slate-600 space-y-1">
              <p><b>Email:</b> {bos.email}</p>
              <p><b>Phone:</b> {bos.phone}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => handleEditBoS(bos)}
              >
                <Pencil size={18} />
              </button>

              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => deleteBos(bos.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}
