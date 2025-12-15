import React, { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";

export default function OtpPage({ userData, onVerified }) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const resendOtp = async () => {
  setTimer(30);
  setCanResend(false);

  const { data, error } = await supabase.auth.signInWithOtp({
    email: userData.email,
    options: {
      emailRedirectTo: window.location.origin, 
    },
  });

  console.log("OTP Response:", data, error);

  if (error) {
    alert(error.message);
    return;
  }

  console.log("OTP resent via Supabase!");
};


  const verifyOtp = async () => {
    if (otp.length !== 6) return;

    const { data, error } = await supabase.auth.verifyOtp({
      email: userData.email,
      token: otp,
      type: "email",
    });

    if (error) {
      alert("Invalid OTP");
      return;
    }

    localStorage.setItem(
  "user",
  JSON.stringify({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    subjectCode: userData.subjectCode,
    department: userData.department,
    role: userData.role,
  })
);

localStorage.setItem("auth", "verified");
onVerified();

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[380px] animate-slideUp">

        <h2 className="text-xl font-semibold text-center text-gray-800">
          OTP Verification
        </h2>

        <p className="text-center text-gray-600 text-sm mt-1">
          OTP sent to <b>{userData?.phone}</b> and <b>{userData?.email}</b>
        </p>

        <hr className="my-4" />

        <div className="flex flex-col gap-4">

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-3 rounded-lg text-center tracking-widest 
                       text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={verifyOtp}
            disabled={otp.length !== 6}
            className={`py-3 rounded-full font-semibold text-white transition ${
              otp.length === 6
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Verify OTP
          </button>

          <div className="text-center text-sm text-gray-600">
            {canResend ? (
              <button
                onClick={resendOtp}
                className="text-blue-600 hover:underline font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <span>Resend OTP in {timer}s</span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
