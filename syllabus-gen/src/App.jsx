import { useEffect, useState } from 'react';
import './App.css'
import { Courses, DataSchema } from './data/data';
import { Download, Link, Menu, Pointer } from 'lucide-react'
import Header from './components/common/Header';
import { TableComponent } from './components/common/TableComponent';
import IndividualCourseDetails from './pages/IndividualCourseDetails';
import { InputForm } from './components/forms/InputForm';
import supabase from './services/supabaseClient'
import Sidebar from './components/common/Sidebar';
import Loading from './components/common/Loading'
import { resetFormData } from './services/resetFormData';

export default function App(){

  const [formData,setFormData] = useState(DataSchema)
  const [courses,setCourses] = useState([])
  const [program, setProgram] = useState("BE/BTECH")
  const [department,setDepartment] = useState("CSE")
  const [detailedView_id,setDetailedView_id] = useState(null)
  const [openForm,setOpenForm] = useState(false)
  const departments = ["AIML","CSE","CSE(IOT)", "CS(DS)", "ISE", "ECE", "EEE", "EIE", "ETE", "VLSI", "ME", "CIVIL","RAI"];
  const [loadingMsg,setLoadingMsg] = useState("")

  const [sidebarOpen,setSidebarOpen] = useState(false)
  const [expandedProgram, setExpandedProgram] = useState("BE/BTECH")

  // Program structure with departments
  const programStructure = {
    "BE/BTECH": {
      icon: "🎓",
      departments: ["AIML", "CSE", "CSE(IOT)", "CS(DS)", "ISE", "ECE", "EEE", "EIE", "ETE", "VLSI", "ME", "CIVIL", "RAI","FFIJ"]
    },
    "MCA": {
      icon: "💻",
      departments: ["MCA"]
    },
    "MBA": {
      icon: "📊",
      departments: ["MBA"]
    },
    "MTECH": {
      icon: "🔬",
      departments: ["CSE", "VLSI", "STRUCTURAL"]
    }
  }
  {/* Function To TOGGLE Prog in Main Section */}
  function handleProgramClick(prog) {
    setProgram(prog)
    setExpandedProgram(prog)
    setDepartment(programStructure[prog].departments[0])
  }
  
  async function fetchDataFromDb(){
    setLoadingMsg("Fetching Data From Database...")
    setTimeout(()=>{
      setLoadingMsg("")
    },1000)
    const {data:dbData,error} = await supabase.from("courses").select("*").eq("department",department)
    
    // setTimeout(()=>{
    //   setLoadingMsg(null)
    // },delay2)
    setCourses(dbData||[])
  }

  useEffect(()=>{
    fetchDataFromDb()
  },[detailedView_id,department])



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

  function askCourseType(msg) {
  let type = window.prompt(
    msg
  );

  // If user cancels → return null
  if (type === null) return null;

  type = type.trim().toLowerCase();

  if (formData.course_type === "ESC" && (type === "" || (type !== "t" && type !== "tl"))) {
    alert(`Please enter either: t or tl`);
    return askCourseType(msg);  //ask again
  }
  if (formData.course_type === "AEC" && (type === "" || (type !== "t" && type !== "l"))) {
    alert(`Please enter either: t or l`);
    return askCourseType(msg);  //ask again
  }

  return type;
}

  {/* Function To ADD new Course Details */}
  async function addSubjectDetails() {

    // CHECK IF EXACT PAIR EXISTS
    const { data: duplicate, error:dupError } = await supabase
    .from("courses")
    .select("*")
    .eq("course_title", formData.course_title)
    .eq("course_code", formData.course_code)
    .maybeSingle();

    if (duplicate) {
      alert(`Course "${formData.course_title}" with code "${formData.course_code}" already exists.`);
      resetFormData(setFormData)
      return;
    }
    if(dupError){
      alert('error:',dupError);
      return;
    }


    //
    let updatedCType = formData.course_type;
    switch(formData.course_type){
      case "IPCC":
      {
        updatedCType += " (T+L)"
        break
      }
      case ("OE"):
      {
        updatedCType += " (T)"
        break
      }
      case ("PE"):
      {
        updatedCType += " (T)"
        break
      }
      case ("PCC"):
      {
        updatedCType += " (T)"
        break
      }
      case ("PCCL"):
      {   
        updatedCType += " (L)"
        break
      }
      case ("ESC"):
      {
        let type = askCourseType("Is this IPCC course Theory or Theory+Lab? (Enter: t/tl)")
        type.toLowerCase() == "t"?updatedCType+=" (T)":updatedCType+=" (T+L)"
        break
      }
      case ("AEC"):
      {
        const type = askCourseType("Is this IPCC course Theory or Lab? (Enter: t/l)");
        type.toLowerCase() == "t"?updatedCType+=" (T)":updatedCType+=" (L)"
        break
      }
    }

    // INSERT NEW ROW
    const { error: insertError } = await supabase.from("courses").insert({
      department: department,
      sem: formData.sem,
      course_title: formData.course_title,
      course_code: formData.course_code,
      course_type: updatedCType,
      credits: formData.credits,
      pedagogy: formData.pedagogy,
      cie: formData.cie,
      see: formData.see,
      ltps: formData.ltps,
      exam_hours: formData.exam_hours,
      course_objectives: formData.course_objectives,
      course_outcomes: formData.course_outcomes,
      teaching_learning: formData.teaching_learning,
      referral_links: formData.referral_links,
      textbooks: formData.textbooks,
      modules: formData.modules,
      activity_based: formData.activity_based,
      copoMapping:formData.copoMapping
    });

    if (insertError) {
      alert("Insert failed: " + insertError.message);
      console.log(insertError)
      return;
    }

    // setShowPopup({msg:"Added new Course..",type:"success"})


    {/* Fetch After adding course */}
    fetchDataFromDb();

    {/* Reset FormData */}
    resetFormData(setFormData)
}

function editSubjectDetails(){

  }

  return (
    <div >
      <Header/>

      <Sidebar
      sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
      programStructure={programStructure}
      expandedProgram={expandedProgram}
      program={program}
      department={department}
      setDepartment={setDepartment}
      setExpandedProgram={setExpandedProgram}
      handleProgramClick = {handleProgramClick}
      />

      {/* Floating Add Button */}
      {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed bottom-6 left-6 w-12 h-12 rounded-full
                        bg-slate-800 text-white shadow-lg z-50
                        hover:bg-slate-900 transition-all hover:scale-102
                        flex items-center justify-center"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
      {/* Floating Menu Button */}
      {!detailedView_id && !openForm && (
        <button
          className="fixed bottom-6 right-6 rounded-full py-2 px-4
                        bg-slate-700 text-white shadow-lg z-50
                        hover:bg-slate-800 transition-all hover:scale-102"
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
            <div className="mt-5 grid grid-cols-2 gap-3 max-w-md mx-auto justify-center">

              {/* Download */}
              <button
                disabled = {courses.length === 0?true:false}
                onClick={()=>{confirm("Are you sure want to download all courses as sigle pdf?")?"downloadAllPdfs":''}}
                className={`flex items-center justify-center gap-2
                          px-3 py-2 rounded-lg
                          bg-slate-800 text-white text-sm font-medium
                          shadow-sm hover:bg-slate-900 transition flex-1
                          ${courses.length === 0?"cursor-no-drop":"cursor-pointer hover:scale-101 transition-all duration-300"}
                          `}
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
                          bg-white hover:bg-blue-50 flex-1 hover:cursor-pointer hover:scale-102 transition-all duration-300"
              >
                <Link/>
                Merge
              </button>
            </div>
          </div>

          {/* 3️⃣ Course Table */}
          {loadingMsg ? <Loading msg={loadingMsg}/>:
            <>
              {courses.length === 0
              ?<h2 className='text-center mt-10'>No Data Found</h2>
              :<div className="w-full max-w-6xl mx-auto px-3 mt-6">
                  <TableComponent
                  courses={courses}
                  setCourses={setCourses}
                  setDetailedView={setDetailedView_id}
              />
              </div>
              }
            </> 
          } 
        </div>
      )}

      {/* INPUT Form */}
      {openForm && (
        <InputForm
        formData={formData}
        setFormData={setFormData}
        addSub={() => addSubjectDetails()}
        editSubjectDetails={() => editSubjectDetails()}
        closeForm={() => setOpenForm(false)}
        />
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