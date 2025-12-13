import React, { useState } from "react";

export default function AuthPage({ onContinue }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const handleSubmit = () => {
    if (!name || !phone || !email || !subjectCode) return;

    onContinue({
      name,
      phone,
      email,
      subjectCode,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[380px] animate-slideUp">
        
        <h2 className="text-xl font-semibold text-center text-gray-800">
          User Verification
        </h2>
        <hr className="my-4" />

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Subject Code"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSubmit}
            disabled={!name || !phone || !email || !subjectCode}
            className={`py-3 rounded-full font-semibold text-white transition ${
              name && phone && email && subjectCode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>

        </div>
      </div>
    </div>
  );
}
