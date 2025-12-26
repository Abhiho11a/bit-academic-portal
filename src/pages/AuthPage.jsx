import React, { useState } from "react";
import supabase from "../services/supabaseClient";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { programStructure } from "../config/appConfig";

export default function AuthPage({ onContinue }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role")
  const isFormValid =
  name &&
  phone &&
  email &&
  dept &&
  (role !== "faculty" || subjectCode);

  const navigate = useNavigate()

  const handleSubmit = async () => {

  // 🔹 BASIC VALIDATION BASED ON ROLE
  if (role === "dean") {
    if (!name || !email || !phone) {
      alert("Please fill all details");
      return;
    }
  } 
  else if (role === "bos") {
    if (!name || !email || !phone || !dept) {
      alert("Please fill all details");
      return;
    }
  } 
  else if (role === "faculty") {
    if (!name || !email || !phone || !dept || !subjectCode) {
      alert("Please fill all details");
      return;
    }
  } 
  else {
    alert("Invalid role selection");
    return;
  }

  setLoading(true);

  let query = null;

  // DEAN CHECK
  if (role === "dean") {
    query = supabase
      .from("dean")
      .select("*")
      .eq("name", name)
      .eq("email", email)
      .eq("phone", phone)
      .maybeSingle();
  }

  // BOS CHECK
  else if (role === "bos") {
    query = supabase
      .from("bos_members")
      .select("*")
      .eq("name", name)
      .eq("email", email)
      .eq("phone", phone)
      .eq("department", dept)
      .maybeSingle();
  }

  // FACULTY CHECK
  else if (role === "faculty") {
    query = supabase
      .from("faculty_members")
      .select("*")
      .eq("name", name)
      .eq("email", email)
      .eq("phone", phone)
      .eq("department", dept)
      .eq("subject_code", subjectCode)
      .maybeSingle();
  }

  // SAFETY CHECK
  if (!query) {
    alert("Invalid role selection.");
    setLoading(false);
    return;
  }

  const { data, error } = await query;

  if (!data || error) {
    alert(`${role.toUpperCase()} details not found.`);
    setLoading(false);
    return;
  }

  // SEND OTP ONLY AFTER DB VERIFICATION
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
  });

  if (otpError) {
    alert("OTP Error: " + otpError.message);
    setLoading(false);
    return;
  }

  // 🔹 STORE VERIFIED USER DATA
  onContinue({
    name,
    phone,
    email,
    department: role === "dean" ? null : dept,
    subjectCode: role === "faculty" ? subjectCode : null,
    role,
  });

  setLoading(false);
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[380px] animate-slideUp">

        <div className="flex items-center">
          <ArrowLeft size={35}
          onClick={()=>{
            navigate("/");
            localStorage.clear()
          }}
          className="flex-1 cursor-pointer border-2 rounded-md border-white hover:border-purple-600 p-1"/>  
          <h2 className="flex-3/4 text-xl font-semibold text-center text-gray-800">
            User Verification
          </h2>
        </div>
        <hr className="my-4" />

        <div className="flex flex-col gap-4">

          <input type="text" placeholder="Full Name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <input type="tel" placeholder="Phone Number" value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <input type="email" placeholder="Email Address" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          {/* <input type="email" placeholder="Department" value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /> */}

          {(role === "bos" || role === "faculty") && <select className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="" hidden>Select Department</option>
            {programStructure["BE/BTECH"].departments.map(it => <option value={it}>{it}</option>)}
          </select>}

          {role === "faculty" && <input type="text" placeholder="Subject Code" value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />}

          <button onClick={handleSubmit}
            // disabled={isFormValid || loading }  
            className={`py-3 rounded-full font-semibold text-white transition ${
              name && phone && email && (role === "dean"?true:dept) && (role !== "faculty"?true:subjectCode)
                ? "bg-blue-600  hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}>
            {loading ? "Sending OTP..." : "Continue"}
          </button>

        </div>
      </div>
    </div>
  );
}
