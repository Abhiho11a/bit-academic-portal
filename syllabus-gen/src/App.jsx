import { useState } from 'react';
import './App.css'
import { Courses, DataScheme } from './data/data';
import { Download, Link } from 'lucide-react'
import Header from './components/Header';
import { TableComponent } from './components/TableComponent';
import IndividualCourseDetails from './components/IndividualCourseDetails';

export default function App(){

  const [courses,setCourses] = useState(Courses)
  const [department,setDepartment] = useState("CSE")
  const [loadingMsg,setLoadingMsg] = useState(null)
  const [detailedView_id,setDetailedView_id] = useState(null)
  const [openForm,setOpenForm] = useState(false)
  const departments = ["AIML","CSE","CSE(IOT)", "CS(DS)", "ISE", "ECE", "EEE", "EIE", "ETE", "VLSI", "ME", "CIVIL","RAI"];

  //Function To Get Department name using "department"
  function getDeptName(dept){
    switch(dept){
      case "CSE":
        return "Computer Science And Engineering";
      case "ISE":
        return "Information Science And Engineering";
      case "EEE":
        return "Electrical and Electronics Engineering";
      case "ECE":
        return "Electronics and Communication Engineering";
      case "EIE":
        return "Electronics and Instrumentation Engineering";
      case "ETE":
        return "Electronics and Telecommunication Engineering";
      case "AIML":
        return "Artificial Intelligence and Machine Learning";
      case "CSE(IOT)":
        return "CSE (IOT & Cyber Security, Blockchain Technology)";
      case "RAI":
        return "Robotics & Artificial Intelligence";
      case "VLSI":
        return "Electronics Engineering (VLSI Design & Technology)";
      case "CIVIL":
        return "Civil Engineering";
      case "ME":
        return "Mechanical Engineering";
      case "CS(DS)":
        return "Computer Science & Engineering (Data Science)";
      default:
        return "Engineering"
    }
  }
  return (
    <div>
      <Header/>

      {/* Floating Add Button */}
      {!detailedView_id && !openForm && (
        <button
          className="fixed bottom-6 right-6 rounded-full px-4 py-3
                    bg-slate-800 text-white shadow-lg
                    text-sm font-medium flex items-center gap-2
                    hover:bg-slate-900 transition"
          onClick={() => setOpenForm(true)}>
            + Add Course
        </button>
      )}

      {/* MAIN HOME SCREEN */}
      {!detailedView_id && !openForm && (
        <div className="w-full flex flex-col">

          {/* Department selector */}
          <div className="w-full flex justify-center mt-2">
            <div
              className="flex gap-3 overflow-x-auto px-3 py-2
                        scrollbar-hide max-w-full"
              >
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDepartment(dept)}
                  className={`rounded-full font-medium
                              whitespace-nowrap transition px-4 py-1.5 text-sm border-2 
                              md:px-5 md:py-2 md:text-base
                              ${
                                department === dept
                                ? " text-slate-700 shadow-md border-purple-400"
                                : "text-slate-700 border-gray-300 hover:bg-gray-100"
                              }`}
                              >
                                {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Department title + actions */}
          <div className="w-full max-w-6xl mx-auto px-4 mt-1">

            {/* Title */}
            <div className="text-center">
              <p className="text-sm text-slate-500">Department of</p>
              <h2 className="text-2xl font-semibold text-slate-800 leading-snug">
                {getDeptName(department)}
              </h2>
              <div className="mt-2 h-0.5 w-32 bg-blue-500 mx-auto rounded-full" />
            </div>

            {/* Buttons – clean stacked layout for mobile */}
            <div className="mt-5 grid grid-cols-2 gap-3 max-w-md mx-auto">

              {/* Download */}
              <button
                onClick={()=>{confirm("Are you sure want to download all courses as sigle pdf?")?"downloadAllPdfs":''}}
                className="flex items-center justify-center gap-2
                          px-3 py-2 rounded-lg
                          bg-slate-800 text-white text-sm font-medium
                          shadow-sm hover:bg-slate-900 transition flex-1"
              >
                <Download/>
                Download
              </button>

              {/* Merge */}
              <button
                className="flex items-center justify-center gap-1
                          px-3 py-2 rounded-lg
                          border border-blue-500
                          text-blue-600 text-sm font-medium
                          bg-white hover:bg-blue-50 transition flex-1"
              >
                <Link/>
                Merge
              </button>
            </div>
          </div>

          {/* 3️⃣ Course Table */}
          <div className="w-full max-w-6xl mx-auto px-3 mt-6">
              <TableComponent
              courses={courses}
              setCourses={setCourses}
              setDetailedView={setDetailedView_id}
          />
          </div>
        </div>
      )}

      {/* IndividualCourseDetails.jsx */}
      {detailedView_id && (
        <IndividualCourseDetails
        courses={courses}
        course_id={detailedView_id}
        setCourses={setCourses}
        backToHome={() => setDetailedView_id(null)}
        />
      )}
    </div>)
}