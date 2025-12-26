import { useEffect, useRef, useState } from 'react';
import '../App.css'
import { Courses } from '../data/data';
import { DataSchema } from '../config/appConfig';
import { ChevronLeft, ChevronRight, Link, Menu, Plus } from 'lucide-react'
import Header from '../components/common/Header';
import { TableComponent } from '../components/common/TableComponent';
import IndividualCourseDetails from './IndividualCourseDetails';
import { InputForm } from '../components/forms/InputForm';
import supabase from '../services/supabaseClient'
import Sidebar from '../components/common/Sidebar';
import Loading from '../components/common/Loading'
import { getDeptName, resetFormData } from '../config/resetFormData';
import { programStructure } from '../config/appConfig';
import { PdfRenderMerged } from '../components/renderers/PdfRenderMerged';
import MergeFilesModal from '../components/common/MergeFilesModal';
import { useNavigate } from 'react-router-dom';

export default function Home(){

  const [formData,setFormData] = useState(DataSchema)
  const [courses,setCourses] = useState([])
  const [program, setProgram] = useState("BE/BTECH")

  const [user] = useState(JSON.parse(localStorage.getItem("user")));

const [department, setDepartment] = useState(
  user?.role === "dean" ? "CSE" : user?.department
);
  
  const [detailedView_id,setDetailedView_id] = useState(null)
  const [openForm,setOpenForm] = useState(false)
  const [loadingMsg,setLoadingMsg] = useState("")

  const [sidebarOpen,setSidebarOpen] = useState(false)
  const [expandedProgram, setExpandedProgram] = useState("BE")

  const[mergeModal,showMergeModal] = useState(false)
  const allProgs = programStructure[program].departments;
  
  const[role,setRole] = useState(localStorage.getItem("role"))

  const navigate = useNavigate();

  const [permissions, setPermissions] = useState({
  addCourse: false,
  deleteCourse: false,
  viewCourse:false,
  editCourse: false,
  addBos: false,
  addFaculty: false,
  mergePdfs:false,
  downloadFullSyllaus:true
});

useEffect(() => {
  if (role === "dean") {
    setPermissions({
      addCourse: true,
      viewCourse:true,
      deleteCourse: false,
      editCourse: false,
      addBos: true,
      addFaculty: false,
      mergePdfs:false,
      downloadFullSyllaus:true
    });
  } else if (role === "bos") {
    setPermissions({
      addCourse: true,
      viewCourse:true,
      deleteCourse: true,
      editCourse: false,
      addBos: false,
      addFaculty: true,
      mergePdfs:true,
      downloadFullSyllaus:true
    });
  } else if (role === "faculty") {
    setPermissions({
      addCourse: false,
      viewCourse:true,
      deleteCourse: false,
      editCourse: true,
      addBos: false,
      addFaculty: false,
      mergePdfs:false,
      downloadFullSyllaus:false
    });
  }else {
    setPermissions({
      addCourse: false,
      viewCourse:false,
      deleteCourse: false,
      editCourse: false,
      addBos: false,
      addFaculty: false,
      mergePdfs:false,
      downloadFullSyllaus:false
    });
  }
}, [role]);


// useEffect(() => {
//   console.log("Permissions updated:", permissions);
// }, [permissions]);

  


  {/* Function To TOGGLE Prog in Main Section */}
  function handleProgramClick(prog) {
    setProgram(prog)
    setExpandedProgram(prog)
    setDepartment(programStructure[prog].departments[0])
  }
  
  async function fetchDataFromDb(){
    setLoadingMsg("Fetching Data....")
    const {data:dbData,error} = await supabase.from("courses").select("*").eq("department",department)
    setCourses(dbData||[])
    setLoadingMsg("")
  }
  
  useEffect(()=>{
    fetchDataFromDb()
  },[department])



  

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
      experiments:formData.experiments,
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

    //Function to Reload the data after returning from individualCourse view page
    function backToHome(){
      setDetailedView_id(null);
      fetchDataFromDb();
    }

    function checkBos(){
      if(user.department === department)
      navigate("/home/add-faculty")
      else
        alert(`You are not member of bos of ${department} department`)
    }

    const scrollRef = useRef(null);

const scrollLeft = () => {
  scrollRef.current.scrollBy({
    left: -200,
    behavior: "smooth",
  });
};

const scrollRight = () => {
  scrollRef.current.scrollBy({
    left: 200,
    behavior: "smooth",
  });
};


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
        className="fixed bottom-6 left-4 sm:bottom-8 sm:left-8
                  w-12 h-12 rounded-full
                  bg-slate-800 text-white shadow-lg z-50
                  hover:bg-slate-900 transition-all active:scale-95
                  flex items-center justify-center hover:scale-105 cursor-pointer"
      ><Menu className="w-6 h-6" /></button>
      )}

      {/* Floating Menu Button */}
      {!detailedView_id && !openForm && (

        <div
  className={`fixed bottom-6 right-4 sm:bottom-8 sm:right-8
              flex flex-col gap-3 z-50
              ${permissions.addCourse ? "" : "hidden"}`}>
                {/* DEAN → Add BOS */}
  {/* {role === "dean" && (
    <button
      onClick={() => navigate("/home/add-bos")}
      className="flex items-center gap-2 px-5 py-3
                 bg-purple-800 text-white rounded-full
                 font-semibold shadow-lg
                 hover:bg-purple-900 transition-all
                 active:scale-95"
    >
      <Plus size={18} />
      Add BoS
    </button>
  )} */}

  {/* BOS → Add Faculty */}
      {/* {role !== "dean" && (
        <button
          onClick={() => checkBos()}
          className="flex items-center gap-2 px-5 py-3
                    bg-blue-600 text-white rounded-full
                    font-semibold shadow-lg
                    hover:bg-blue-700 transition-all
                    active:scale-95"
        >
          <Plus size={18} />
          Add Faculty
        </button>
      )} */}

  {/* Add Course (BOS + Faculty) */}
  {role !== "dean" && (
    <button
      onClick={() =>
        permissions.addCourse
          ? setOpenForm(true)
          : alert(
              "Permission for adding courses is not provided. Please contact the Dean."
            )
      }
      className="flex items-center gap-2 px-5 py-3
                 bg-slate-700 text-white rounded-full
                 font-semibold shadow-lg
                 hover:bg-slate-800 transition-all
                 active:scale-95"
    >
      <Plus size={18} />
      Add Course
    </button>
  )}
</div>

      )}

      

      {/* MAIN HOME SCREEN */}
      {!detailedView_id && !openForm && (
        <div className="w-full flex flex-col items-center">

          {/* Department selector */}
          <div className="flex w-[95%] justify-center items-center gap-2 mt-4">

  {/* LEFT ARROW */}
  <button
    onClick={scrollLeft}
    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
  >
    <ChevronLeft size={20} />
  </button>

  {/* SCROLLABLE DEPARTMENTS */}
  <div
    ref={scrollRef}
    className="flex gap-3 overflow-x-auto px-3 py-2
               hide-scrollbar max-w-[80%]"
  >
    {allProgs.map((dept) => (
      <button
        key={dept}
        onClick={() => setDepartment(dept)}
        className={`rounded-full font-medium
                    whitespace-nowrap transition px-4 py-1.5 text-sm border-2
                    md:px-5 md:py-2 md:text-base
                    ${
                      department === dept
                        ? "border-purple-400 text-slate-800 shadow-md"
                        : "border-gray-300 text-slate-600 hover:bg-gray-100"
                    }`}
      >
        {dept}
      </button>
    ))}
  </div>

  {/* RIGHT ARROW */}
  <button
    onClick={scrollRight}
    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
  >
    <ChevronRight size={20} />
  </button>

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
              {/* <h2>Role:{role}</h2> */}
            </div>

            {/* Buttons – clean stacked layout for mobile */}
            <div className="mt-5 flex flex-wrap justify-center gap-2 md:gap-3 max-w-md mx-auto">

  {/* Download */}
  <div className="flex justify-center">
    <PdfRenderMerged department={department} courses={courses} />
  </div>

  {/* Merge */}
  <button
    onClick={() => {
      if(permissions.mergePdfs)
      showMergeModal(true)
      else
        alert("You Dont have permissions to merge Documents")
    }}
    className="flex items-center justify-center gap-1
               px-3 py-2 rounded-lg
               border border-blue-500
               text-blue-600 text-sm font-medium
               bg-white hover:bg-blue-50
               hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
  >
    <Link size={18} />
    Merge
  </button>

  {role === "dean" && (
    <button
      onClick={() => navigate("/home/manage-bos")}
      className="px-4 py-2 bg-purple-700 text-white rounded-lg
                 hover:bg-purple-800 hover:-translate-y-0.5
                 transition-all duration-300 cursor-pointer"
    >
      Manage BoS
    </button>
  )}

  {role === "bos" && (
    <button
      onClick={() => navigate("/home/manage-faculty")}
      className="px-3 py-2 bg-blue-700 text-white rounded-lg
                 hover:bg-blue-800 hover:-translate-y-0.5
                 transition-all duration-300 cursor-pointer"
    >
      Manage Faculty
    </button>
  )}
</div>

          </div>

          {/* 3️⃣ Course Table */}
          {loadingMsg ? <Loading msg={loadingMsg}/>:
            <>
              {courses.length === 0
              ?<h2 className='text-center mt-10'>No Data Found</h2>
              :<div className="w-full max-w-6xl mx-auto px-3 mt-6">
                  <TableComponent
                  permissions={permissions}
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
        backToHome={() => backToHome()}
        permissions={permissions}
        />
      )}

      {mergeModal && <MergeFilesModal onClose={()=>showMergeModal(false)}/>}
    </div>)
}