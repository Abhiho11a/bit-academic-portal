import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";
import { programStructure } from "../config/appConfig";
import { X } from "lucide-react";

export default function AddBosPage() {
  
  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const bosData = location.state?.bosData || null;


  const [newBos,setNewBos] = useState({"name":bosData?.name || "","email":bosData?.email || "","phone":bosData?.phone || "","dept":bosData?.department || ""})
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 
  const role = localStorage.getItem("role");

  // 🚫 Only Dean can access
  useEffect(()=>{
    if (role !== "dean") {
      navigate("/home");
      return null;
    }
  },[])

  const isFormValid = newBos.name && newBos.email && newBos.phone && newBos.dept;

  const handleAddBos = async () => {
    if (!isFormValid) return;

    setLoading(true);

    if (isEdit) {
  // 🔁 UPDATE faculty
  const { error } = await supabase
    .from("bos_members")
    .update({
      name: newBos.name,
      phone: newBos.phone,
      department:newBos.dept,
      email:newBos.email
    })
    .eq("id", bosData.id);

  if (error) {
    alert("Error updating Bos");
    setLoading(false);
    return;
  }

  alert("Bos updated successfully!");
} else {
  // STEP 1: Check if BOS already exists
  const { data: existingBos } = await supabase
    .from("bos_members")
    .select("id")
    .eq("email", newBos.email)
    .maybeSingle();
  
  if (existingBos) {
    alert("BOS already exists with this email.");
    setLoading(false);
    return;
  }
  
  // STEP 2: Insert BOS
  const { error } = await supabase.from("bos_members").insert([
    {
      name:newBos.name,
      email:newBos.email,
      phone:newBos.phone,
      department:newBos.dept,
    },
  ]);
  
  if (error) {
    alert("Error adding BOS: " + error.message);
    setLoading(false);
    return;
  }
  
  alert("BOS added successfully!");
}


    setLoading(false);

    // Reset form
    setNewBos({"name":"","email":"","phone":"","dept":""})

    navigate("/home/manage-bos");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[380px]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            {isEdit ?"Edit details":"Add Board of Studies (Bos)"}
          </h2>
          <X onClick={()=>navigate("/home/manage-bos")}/>
        </div>
        <hr className="my-4" />

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            value={newBos.name}
            onChange={(e) => setNewBos({...newBos,name:e.target.value})}
            className="border p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={newBos.email}
            onChange={(e) => setNewBos({...newBos,email:e.target.value})}
            className="border p-3 rounded-lg"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={newBos.phone}
            onChange={(e) => setNewBos({...newBos,phone:e.target.value})}
            className="border p-3 rounded-lg"
          />

          <select
            value={newBos.dept}
            onChange={(e) => setNewBos({...newBos,dept:e.target.value})}
            className="border p-3 rounded-lg"
          >
            <option value="" hidden>Select Department</option>
            {programStructure["BE/BTECH"].departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            onClick={handleAddBos}
            disabled={!isFormValid || loading}
            className={`py-3 rounded-full font-semibold text-white transition ${
              (isFormValid || isEdit)
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading
            ? isEdit ? "Updating BoS..." : "Adding BoS..."
            : isEdit ? "Update BoS" : "Add BoS"}

          </button>

        </div>
      </div>
    </div>
  );
}
