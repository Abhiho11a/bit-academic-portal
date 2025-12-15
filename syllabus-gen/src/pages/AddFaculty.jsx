import React, { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";
import { programStructure } from "../config/appConfig";
import { X } from "lucide-react";

export default function AddFacultyPage() {


  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const facultyData = location.state?.facultyData || null;

  const [newFaculty, setNewFaculty] = useState({
    name: facultyData?.name || "",
    email: facultyData?.email || "",
    phone: facultyData?.phone || "",
    dept: facultyData?.department || "",
    subjectCode: facultyData?.subject_code || ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔐 Allow only BOS
  useEffect(() => {
    if (role !== "bos") {
      navigate("/home");
    } else {
      setNewFaculty({...newFaculty,dept:user?user.department:""});
    }
  }, []);

  const isFormValid = newFaculty.name && newFaculty.email && newFaculty.phone && newFaculty.dept && newFaculty.subjectCode;

  const handleAddFaculty = async () => {
    if (!isFormValid) return;

    setLoading(true);


    if (isEdit) {
    //  🔁 UPDATE faculty
    const { error } = await supabase
      .from("faculty_members")
      .update({
        name: newFaculty.name,
        phone: newFaculty.phone,
        subject_code: newFaculty.subjectCode
      })
      .eq("id", facultyData.id);

    if (error) {
      alert("Error updating faculty");
      setLoading(false);
      return;
    }

    alert("Faculty updated successfully!");
  } else {
    // STEP 1: Check if faculty already exists
    const { data: existingFaculty } = await supabase
      .from("faculty_members")
      .select("id")
      .eq("email", newFaculty.email)
      .eq("department", newFaculty.dept)
      .eq("subject_code", newFaculty.subjectCode)
      .maybeSingle();
    
    if (existingFaculty) {
      alert("Faculty already exists for this subject.");
      setLoading(false);
      return;
    } 
    
    // STEP 2: Insert faculty
    const { error } = await supabase.from("faculty_members").insert([
      {
        name:newFaculty.name,
        email:newFaculty.email,
        phone:newFaculty.phone,
        department: newFaculty.dept,
        subject_code: newFaculty.subjectCode,
      },
    ]);
    
    if (error) {
      alert("Error adding faculty: " + error.message);
      setLoading(false);
      return;
    }
    
    alert("Faculty added successfully!");
}


    // Reset form
    setNewFaculty(
      {"name":"","email":"","phone":"","dept":"","subjectCode":""}
    )

    setLoading(false);
    navigate("/home/manage-faculty");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[380px]">

        <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-center text-gray-800">
            Add Faculty
            </h2>
            <X onClick={()=>navigate("/home/manage-faculty")}/>
        </div>

        <hr className="my-4" />

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            value={newFaculty.name}
            onChange={(e) => setNewFaculty({...newFaculty,name:e.target.value})}
            className="border p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={newFaculty.email}
            onChange={(e) => setNewFaculty({...newFaculty,email:e.target.value})}
            className="border p-3 rounded-lg"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={newFaculty.phone}
            onChange={(e) => setNewFaculty({...newFaculty,phone:e.target.value})}
            className="border p-3 rounded-lg"
          />

          {/* Department (locked to BOS department) */}
          <select
            value={newFaculty.dept}
            disabled
            className="border p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          >
            <option value={newFaculty.dept}>{newFaculty.dept}</option>
          </select>

          <input
            type="text"
            placeholder="Subject Code (eg: BCS302)"
            value={newFaculty.subjectCode}
            onChange={(e) => setNewFaculty({...newFaculty,subjectCode:e.target.value})}
            className="border p-3 rounded-lg"
          />

          <button
            onClick={handleAddFaculty}
            disabled={!isFormValid || loading}
            className={`py-3 rounded-full font-semibold text-white transition ${
              isFormValid || isEdit
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading
              ? isEdit ? "Updating Faculty..." : "Adding Faculty..."
              : isEdit ? "Update Faculty" : "Add Faculty"}
          </button>


        </div>
      </div>
    </div>
  );
}
