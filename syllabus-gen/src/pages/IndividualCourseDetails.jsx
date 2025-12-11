import { ArrowLeft, ChevronDown, ChevronUp, Download, Edit, Edit2, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ModuleEditForm from "../components/forms/ModuleEditForm";
import { InputForm } from "../components/forms/InputForm";
import supabase from "../services/supabaseClient";

export default function IndividualCourseDetails({courses,course_id,backToHome,setCourses}){

    //Retrieving particular course from courseData
    const [courseData,setCourseData] = useState(courses.find(c => c.id === course_id))

    
    // Used to Show/hide download Options
    const [downloadMenu,setDownLoadMenu] = useState(false)
    // Used to show/hide module Edit form
    const [editForm,setEditForm] = useState("close")

    const [mod,setMod] = useState(null)
    const [moduleEditForm,showModuleEditForm] = useState([false,null,null]);

    // This is an Array of objects so that we can handle diff sections open/close using single aray of objects
    const [open, setOpen] = useState({ coOut:false,obj: true, tlp: true,exps:false, wlinks:false, tlinks:false, al:false });

    const [isMainSectionOpen, setIsMainSectionOpen] = useState(false);
    const [openModuleIndex, setOpenModuleIndex] = useState(null);


    // Function To add TYPE of Course whether THEORY or LAB
    function askCourseType(msg) {
        //ALERT msg is displayed which is passed through Function
        let type = window.prompt(msg);

        // If user cancels → return null
        if (type === null) return null;

        type = type.trim().toLowerCase();

        if (courseData.course_type === "ESC" && (type === "" || (type !== "t" && type !== "tl"))) {
            alert(`Please enter either: t or tl`);
            return askCourseType(msg);  //ask again
        }
        if (courseData.course_type === "AEC" && (type === "" || (type !== "t" && type !== "l"))) {
            alert(`Please enter either: t or l`);
            return askCourseType(msg);  //ask again
        }

        return type;
}
    async function editSubjectDetails() {
        
        let updatedCType = courseData.course_type;

        switch(courseData.course_type){
            case "IPCC":
            {
                updatedCType += " (T+L)"
                break
            }
            case "OE":
            {
                updatedCType += " (T)"
                break
            }
            case "PE":
            {
                updatedCType += " (T)"
                break
            }
            case ("PCC"):
            {
                updatedCType += " (T)"
                break;
            }
            case ("PCCL"):
            {
                updatedCType += " (L)"
                break;
            }
            case ("ESC"):
            {
                const type = askCourseType("Is this IPCC course Theory or Theory+Lab? (Enter: t/tl)")
                type.toLowerCase() == "t"?updatedCType+=" (T)":updatedCType+=" (T+L)"
                break;
            }
            case ("AEC"):
            {
                const type = askCourseType("Is this IPCC course Theory or Lab? (Enter: t/l)")
                type.toLowerCase() == "t"?updatedCType+=" (T)":updatedCType+=" (L)"
                break;
            }
        }

        // Update Course Type
        const updatedData = { 
            ...courseData,
            course_type: updatedCType
        };

        // Update in Supabase
        const { error } = await supabase
            .from("courses")
            .update(updatedData)
            .eq("id", courseData.id);

        if (error) {
            alert("Error updating course: " + error.message);
            return;
        }
        

        // Update individual page instantly
        setCourseData(updatedData);
        // Update course list in parent (App.jsx)
        setCourses(prev =>
            Array.isArray(prev)
            ? prev.map(item =>
                item.id === courseData.id ? updatedData : item)
            : prev   // safeguard (if prev isn't array)
        );

        // 4️⃣ Close form
        setEditForm("close");

        //setShowPopup({msg:"Edited Course Details Successfully",type:"info"})
}

    const toggleMainSection = () => {
        setIsMainSectionOpen(!isMainSectionOpen);
    };

    {/* Modules Section handler Functions */}

    //Function to add NEW MODULE Details
    function addModulesDetails(ind){
    setMod(ind)
}
    // Handle particular Module Open/close
    const toggleModule = (index) => {
        setOpenModuleIndex(openModuleIndex === index ? null : index);
    };


    const [newExpNo,setNewExpNo] = useState("");
    const [newExpCont,setNewExpCont] = useState("");
    const [showExpInput,setShowExpInput] = useState(false)
    const [editingExpIndex, setEditingExpIndex] = useState(null);
    const [editExpNo, setEditExpNo] = useState('');
    const [editExpCont, setEditExpCont] = useState('');


    {/* Module Update Function */}
    async function handleEditModule(updatedModule) {

        //Get the index of updated MODULE
        const index = moduleEditForm[2];

        // Update module in local array
        const updatedModules = [...courseData.modules];
        updatedModules[index] = updatedModule;
        const updatedCourse = { ...courseData, modules: updatedModules };

        // // Update in Supabase
        // const { error } = await supabase
        //     .from("courses")
        //     .update({ modules: updatedModules })
        //     .eq("id", courseData.id);

        // if (error) {
        //     console.error("Supabase update error:", error);
        //     alert("Failed to update module in database.");
        //     return;
        // }


        // Update local state
        setCourseData(updatedCourse);
        setCourses((prev) =>
            prev.map((item) =>
            item.courseCode === courseData.courseCode ? updatedCourse : item
            )
        );

        //Close form after EDITING Module Detail
        showModuleEditForm([false, null, null]);
}

    {/* Experiments Section Handler Functions */}
    //Adding new Experiment
    async function addNewExperiment(){
        if(!newExpCont || !newExpNo)
        {
        alert("Please fill all the details")
        return;
        }
        const experiments = courseData.experiments || []
        const updatedExps = [...experiments,{slno:parseInt(newExpNo),cont:newExpCont}]

        // const {error} = await supabase.from("courses").update({"experiments":updatedExps}).eq("id",course_id)

        // if(error)
        //   alert("Failed to add New Experiment")
        // else
        //   alert("Successfuly added")

        
        setNewExpCont("")
        setNewExpNo("")
        // fetchCourseFromDb()
}
    //Delete Experiment
    async function handleDeleteExperiment (index){
        if (!window.confirm('Are you sure you want to delete this experiment?'))
            return;

        const updatedExps = courseData.experiments.filter((_, i) => i !== index);

        // const { error } = await supabase
        //   .from("courses")
        //   .update({ experiments: updatedExps })
        //   .eq("id", course_id);

        // if (error) {
        //   alert("Failed to delete experiment: " + error.message);
        //   return;
        // }

        setCourseData({ ...courseData, experiments: updatedExps });
        setCourses(prev =>
        prev.map(item =>
            item.id === course_id ? { ...courseData, experiments: updatedExps } : item
        )
        );
        // setShowPopup({ msg: "Experiment Deleted Successfully", type: "info" });
};

    // Start Edit
    const startEditExperiment = (index) => {
        setEditingExpIndex(index);
        setEditExpNo(courseData.experiments[index].slno);
        setEditExpCont(courseData.experiments[index].cont);
    };

    // Edit Experiment
    const saveEditExperiment = async () => {
        if (!editExpNo || !editExpCont) {
        alert("Please fill all fields");
        return;
        }

        const updatedExps = [...courseData.experiments];
        updatedExps[editingExpIndex] = {
        slno: parseInt(editExpNo),
        cont: editExpCont
        };

        // Sort by slno
        updatedExps.sort((a, b) => a.slno - b.slno);

        // const { error } = await supabase
        //   .from("courses")
        //   .update({ experiments: updatedExps })
        //   .eq("id", course_id);

        // if (error) {
        //   alert("Failed to update experiment: " + error.message);
        //   return;
        // }

        setCourseData({ ...courseData, experiments: updatedExps });
        setCourses(prev =>
        prev.map(item =>
            item.id === course_id ? { ...courseData, experiments: updatedExps } : item
        )
        );

        setEditingExpIndex(null);
        setEditExpNo('');
        setEditExpCont('');
        // setShowPopup({ msg: "Experiment Updated Successfully", type: "success" });
    };

    // Cancel Edit
    const cancelEditExperiment = () => {
        setEditingExpIndex(null);
        setEditExpNo('');
        setEditExpCont('');
    };


    return (
        <>
        <div className="max-w-6xl mx-auto mt-3 px-4 mb-5">
            {mod === null && editForm === "close" && !moduleEditForm[0] && <>
            <div className="flex justify-between mb-3">
                <button 
                onClick={backToHome}
                className="flex items-center gap-2 text-slate-700 font-medium bg-gray-200 border-2 border-gray-200 hover:border-blue-600
                hover:text-slate-900 transition-colors duration-200 cursor-pointer text-xs md:text-[15px]
                px-3 py-1.5 rounded-md "
                >
                <ArrowLeft size={20} className='-mr-1'/><p className="text-xs md:text-[15px] hidden md:block">Back To Home</p>
                </button> 

                <div className='flex gap-2'> 
                    <div className="relative">
                        <button
                            onClick={() => setDownLoadMenu(!open)}
                            className="flex gap-1 px-4 py-2 rounded-full bg-slate-800 text-white"
                        >
                            <Download/>
                            Download
                        </button>

                        {downloadMenu && (
                            <div className="absolute mt-2 w-50 bg-white shadow-lg rounded-lg border">
                                <div className="flex flex-col gap-2 mt-1 ">
                                    <div>DownLoad PDF</div>
                                    <div>DownLoad JSON</div>
                                    <div>DownLoad DOCX</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                    onClick={() => setEditForm("open")} 
                    className="flex px-4 gap-2 items-center py-1.5 rounded-md bg-slate-700 text-white  cursor-pointer
                                hover:bg-slate-800 transition font-medium shadow-sm text-xs md:text-[15px]"
                    >
                        <Edit size={20}/><p className="text-xs md:text-[15px] hidden md:block">Edit</p>
                    </button>
                </div>
            </div>

            {/* TOP TABLE */}
            <div className="hidden md:block overflow-x-auto shadow-md rounded-lg border border-gray-300">
                <table className="w-full text-sm">
                <thead className="bg-slate-700 text-white">
                    <tr>
                    <th className="p-3 text-left">Course Title</th>
                    <th className="p-3 text-left">Course Code</th>
                    <th className="p-3 text-center">Course Type</th>
                    <th className="p-3 text-center">Credits</th>
                    <th className="p-3 text-center">CIE</th>
                    <th className="p-3 text-center">SEE</th>
                    <th className="p-3 text-center">Total</th>
                    <th className="p-3 text-center">L-T-P-S</th>
                    <th className="p-3 text-center">Exam Hours</th>
                    </tr>
                </thead>

                <tbody className='font-semibold text-lg'>
                    <tr className="bg-white">
                    <td className="p-3 border-t border-gray-300">{courseData.course_title==""?'-':courseData.course_title}</td>
                    <td className="p-3 border-t border-gray-300">{courseData.course_code==""?'-':courseData.course_code}</td>
                    <td className="p-3 text-center border-t border-gray-300">{courseData.course_type==""?'-':courseData.course_type}</td>
                    <td className="p-3 text-center border-t border-gray-300">{courseData.credits==""?'-':courseData.credits}</td>
                    <td className="p-3 text-center border-t border-gray-300">{courseData.cie==""?'-':courseData.cie}</td>
                    <td className="p-3 text-center border-t border-gray-300">{courseData.see==""?'-':courseData.see}</td>
                    <td className="p-3 text-center border-t border-gray-300">
                        {Number(courseData.cie) + Number(courseData.see)?Number(courseData.cie) + Number(courseData.see):'-'}
                    </td>
                    <td className="p-3 text-center border-t border-gray-300">{courseData.ltps==""?'-':courseData.ltps}</td>
                    <td className="p-3 text-center border-t border-gray-300">{courseData.exam_hours==""?'-':courseData.exam_hours}</td>
                    </tr>
                </tbody>
                </table>
            </div>

            {/* Mobile View Table*/}
            <div className="md:hidden overflow-x-auto shadow-md rounded-lg border border-gray-300">
                <table className="w-full text-sm flex">
                <thead className="bg-slate-700 text-white">
                    <tr className='flex flex-col'>
                    <th className="p-3 text-left">Course Title</th>
                    <th className="p-3 text-left border-t border-gray-300">Course Code</th>
                    <th className="p-3 text-left border-t border-gray-300">Course Type</th>
                    <th className="p-3 text-left border-t border-gray-300">Credits</th>
                    <th className="p-3 text-left border-t border-gray-300">CIE</th>
                    <th className="p-3 text-left border-t border-gray-300">SEE</th>
                    <th className="p-3 text-left border-t border-gray-300">Total</th>
                    <th className="p-3 text-left border-t border-gray-300">L-T-P-S</th>
                    <th className="p-3 text-left border-t border-gray-300">Exam Hours</th>
                    </tr>
                </thead>

                <tbody className='font-semibold'>
                    <tr className="bg-white flex flex-col">
                    <td className="p-3 border-t border-gray-300">{courseData.course_title==""?'-':courseData.course_title}</td>
                    <td className="p-3 border-t border-gray-300">{courseData.course_code==""?'-':courseData.course_code}</td>
                    <td className="p-3 border-t border-gray-300">{courseData.course_type==""?'-':courseData.course_type}</td>
                    <td className="p-3 border-t border-gray-300">{courseData.credits==""?'-':courseData.credits}</td>
                    <td className="p-3 border-t border-gray-300">{courseData.cie==""?'-':courseData.cie}</td>
                    <td className="p-3 border-t border-gray-300">{courseData.see==""?'-':courseData.see}</td>
                    <td className="p-3 border-t border-gray-300">
                        {Number(courseData.cie) + Number(courseData.see)?Number(courseData.cie) + Number(courseData.see):'-'}
                    </td>
                    <td className="p-3 border-t border-gray-300">{courseData.ltps==""?'-':courseData.ltps}</td>
                    <td className="p-3 border-t border-gray-300">{courseData.exam_hours==""?'-':courseData.exam_hours}</td>
                    </tr>
                </tbody>
                </table>
            </div>

            {/* SECTIONS */}
            <div className="mt-8 space-y-6">
                {/* COURSE OBJECTIVES */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <button
                        onClick={() => setOpen(o => ({ ...o, co: !o.co }))}
                        className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 hover:bg-gray-200 transition font-semibold text-slate-800"
                    >
                        Course Objectives
                        <span className="text-lg">{open.co ? <ChevronUp/> : <ChevronDown/>}</span>
                    </button>

                    {open.co && (
                        <div className="p-5 bg-white">
                            {courseData.course_objectives !== ""
                            ?<ol className="list-decimal ml-6 space-y-1 text-slate-700 leading-relaxed">
                            {courseData.course_objectives.split("\n").map((line, i) => (
                            <li key={i}>{line}</li>
                            ))}
                            </ol>
                            :<p>Please add Course Objectives using EDIT button</p>}
                        </div>
                    )}
                </div>

                {/* COURSE OUTCOMES */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <button
                        onClick={() => setOpen(o => ({ ...o, coOut: !o.coOut }))}
                        className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 hover:bg-gray-200 transition font-semibold text-slate-800"
                    >
                        Course Outcomes
                        <span className="text-lg">{open.co ? <ChevronUp/> : <ChevronDown/>}</span>
                    </button>

                    {open.coOut && (
                        <div className="p-5 bg-white">
                            {courseData.course_outcomes !== ""
                            ?<ol className="list-decimal ml-6 space-y-1 text-slate-700 leading-relaxed">
                            {courseData.course_outcomes.split("\n").map((line, i) => (
                            <li key={i}>{line}</li>
                            ))}</ol>
                            :<p>Please add Course Outcomes using EDIT button</p>}
                        </div>
                    )}
                </div>

                {/* TEACHING–LEARNING */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <button
                        onClick={() => setOpen(o => ({ ...o, tl: !o.tl }))}
                        className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 hover:bg-gray-200 transition font-semibold text-slate-800"
                    >
                        Teaching–Learning Process
                        <span className="text-lg">{open.tl ? <ChevronUp/> : <ChevronDown/>}</span>
                    </button>

                    {open.tl && (
                        <div className="p-5 bg-white">
                            <div className="space-y-2 text-slate-700 leading-relaxed">
                                {courseData.teaching_learning !== ""
                                ?courseData.teaching_learning.split("\n").map((line, i) => (
                                <p key={i}>{i+1}. {line}</p>
                                ))
                                :<p>Please add Course Teaching and Learning</p>}
                            </div>
                        </div>
                    )}
                </div>

                <div className="">
                    {/* Only Show Modules Section if its not PCCL-Lab Subject */}
                    {courseData.course_type !== "PCCL (L)" && 
                    <div className="w-full mb-4">
                        <div 
                            className="w-full flex justify-between items-center rounded-lg px-5 py-3 bg-gray-100 hover:bg-gray-200 transition font-semibold text-slate-800"
                            onClick={toggleMainSection}
                            aria-expanded={isMainSectionOpen}
                        >
                            <div className="">
                                Course Modules
                            </div>
                            {/* Dropdown Arrow */}
                            {isMainSectionOpen?<ChevronUp/>:<ChevronDown/>}
                        </div>

                        {/* MAIN CONTENT AREA (The dropdown body) */}
                        <div 
                            className={`transition-max-height ease-in-out duration-500 overflow-hidden ${isMainSectionOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-4 bg-white border border-t-0 border-gray-300 rounded-b-lg">
                                <div className="space-y-2">
                                    {/* NESTED MODULE ACCORDION (Content from your previous request) */}
                                    { courseData.modules && courseData.modules.map((it, idx) => {
                                        const isModuleOpen = openModuleIndex === idx;
                                        return (
                                            <div key={idx} className="border border-gray-200 rounded-md transition-all duration-300">
                                                
                                                {/* MODULE TITLE HEADER */}
                                                {it.title || it.content?
                                                <>
                                                <div 
                                                    className={`
                                                        flex justify-between items-center p-3 cursor-pointer 
                                                        transition-colors duration-200 
                                                        ${isModuleOpen ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-gray-100 text-gray-800'}
                                                    `}
                                                    
                                                    aria-expanded={isModuleOpen}
                                                >
                                                    <span className="text-base">Module-{idx+1}</span>
                                                    
                                                    {/* Collapse Indicator Icon */}
                                                    <span className={`flex gap-2 items-center transition-transform duration-300`}>
                                                    <button className='bg-red-500 text-white cursor-pointer px-3 py-1' onClick={() => showModuleEditForm([true,it,idx])}>Edit</button>
                                                        <div onClick={() => toggleModule(idx)}>{isModuleOpen ? <Minus size={20} className='hover:scale-120'/> : <Plus size={20} className='hover:scale-120'/>}</div>
                                                    </span>
                                                </div>
                                                {/* MODULE DETAILS BODY */}
                                                <div 
                                                    className={`transition-max-height ease-in-out duration-500 overflow-hidden ${isModuleOpen ? 'max-h-[1000px] opacity-100 p-4 pt-0' : 'max-h-0 opacity-0'}`}
                                                >
                                                    <p className='mb-3 mt-3 text-sm text-gray-700'><strong>Title: </strong>{it.title}</p>
                                                    <p className="mb-3 text-sm text-gray-700">
                                                        <strong>Topics Covered:</strong>
                                                        <span className="block mt-1 font-normal">{it.content}</span>
                                                    </p>
                            
                                                    <hr className="my-4 border-gray-200" />
                            
                                                    {/* REFERENCE MATERIAL TABLE */}
                                                    <div className="overflow-x-auto">
                                                        <table className="reference-table w-full text-sm text-left text-gray-600 border border-gray-100">
                                                            <tbody>
                                                                <tr className="border-b">
                                                                    <td className="w-1/3 py-2 px-1 font-medium text-gray-900 bg-gray-50">Text Book</td>
                                                                    <td className="py-2 px-2">{it.textbook}</td>
                                                                </tr>
                                                                <tr className="border-b">
                                                                    <td className="w-1/3 py-2 px-1 font-medium text-gray-900 bg-gray-50">Chapter Article No.</td>
                                                                    <td className="py-2 px-2">{it.chapter}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="w-1/3 py-2 px-1 font-medium text-gray-900 bg-gray-50">RBT (Levels)</td>
                                                                    <td className="py-2 px-2">{it.rbt}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                </>:<div><button onClick={() => addModulesDetails(idx)} className='bg-green-700 text-white group px-5 py-2 text-sm m-2 rounded-md cursor-pointer'>Add Mod-{idx+1} details</button>
                                                <h2 className='hidden group-hover:block bg-gray-700'>Show</h2></div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>


                {/* Experiments */}
                {(courseData.course_type === "IPCC (T+L)" || courseData.course_type === "PCCL (L)") &&
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    
                    <div 
                    className="w-full flex justify-between items-center rounded-lg px-5 py-3 bg-gray-100 hover:bg-gray-200 transition font-semibold text-slate-800 cursor-pointer"
                    onClick={() => setOpen(o => ({...o, exps: !o.exps}))}
                    >
                    <div>Experiments</div>
                    {open.exps ? <ChevronUp/> : <ChevronDown/>}
                    </div>

                    {open.exps && 
                    <div className="p-6 bg-white">
                        {/* Add Experiment Form */}
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="text-sm font-semibold text-blue-900 mb-3">Add New Experiment</h3>
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                type="number"
                                placeholder="Sl No."
                                value={newExpNo}
                                onChange={(e) => setNewExpNo(e.target.value)}
                                className="w-full md:w-24 px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                                />
                                <input
                                type="text"
                                placeholder="Enter Experiment Description..."
                                value={newExpCont}
                                onChange={(e) => setNewExpCont(e.target.value)}
                                className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                                />
                                <button
                                onClick={() => addNewExperiment()}
                                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium whitespace-nowrap"
                                >     
                                <Plus size={18} />
                                Add
                                </button>
                            </div>
                        </div>

                        {/* Experiments Table */}
                        {courseData.experiments.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No experiments added yet</p>
                            <p className="text-sm mt-2">Add your first experiment using the form above</p>
                        </div>
                        ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-700 text-white">
                                <th className="px-4 py-3 text-left font-semibold w-20 border-r border-slate-500">Sl No</th>
                                <th className="px-4 py-3 text-left font-semibold border-r border-slate-500">Experiment</th>
                                <th className="px-4 py-3 text-center font-semibold w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseData.experiments.map((exp, idx) => (
                                <tr
                                    key={idx}
                                    className={`border-b border-gray-200 transition ${
                                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    {editingExpIndex === idx ? (
                                    // EDIT MODE
                                    <>
                                        <td className="px-4 py-3 border-r border-gray-200">
                                        <input
                                            type="number"
                                            value={editExpNo}
                                            onChange={(e) => setEditExpNo(e.target.value)}
                                            className="w-16 px-2 py-1 border-2 border-blue-400 rounded focus:outline-none"
                                        />
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-200">
                                        <textarea
                                            value={editExpCont}
                                            onChange={(e) => setEditExpCont(e.target.value)}
                                            rows={2}
                                            className="w-full px-2 py-1 border-2 border-blue-400 rounded focus:outline-none resize-none"
                                        />
                                        </td>
                                        <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                            onClick={saveEditExperiment}
                                            className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition font-medium"
                                            title="Save"
                                            >
                                            <Check size={16}/>
                                            </button>
                                            <button
                                            onClick={cancelEditExperiment}
                                            className="px-3 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition font-medium"
                                            title="Cancel"
                                            >
                                            <X size={16}/>
                                            </button>
                                        </div>
                                        </td>
                                    </>
                                    ) : (
                                    // VIEW MODE
                                    <>
                                        <td className="px-4 py-3 text-center font-semibold text-gray-700 border-r border-gray-200">
                                        {exp.slno}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 leading-relaxed border-r border-gray-200">
                                        {exp.cont}
                                        </td>
                                        <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                            onClick={() => startEditExperiment(idx)}
                                            className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition font-medium"
                                            title="Edit"
                                            >
                                            <Edit2 size={16} />
                                            </button>
                                            <button
                                            onClick={() => handleDeleteExperiment(idx)}
                                            className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition font-medium"
                                            title="Delete"
                                            >
                                            <Trash2 size={16} />
                                            </button>
                                        </div>
                                        </td>
                                    </>
                                    )}
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        )}
                    </div>
                    }
                </div>
                }

                {/* Web Links Secion */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <button
                        onClick={() => setOpen(o => ({ ...o, wlinks: !o.wlinks }))}
                        className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 hover:bg-gray-200 transition font-semibold text-slate-800"
                    >
                        Web Links
                        <span className="text-lg">{open.tl ? <ChevronUp/> : <ChevronDown/>}</span>
                    </button>

                    {open.wlinks && (
                        <div className="p-5 bg-white">
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                            {courseData.referral_links.split("\n").map((line, i) => (
                            <p key={i}>{i+1}. <a href={line} target='_blank'>{line}</a></p>
                            ))}
                        </div>
                        </div>
                    )}
                </div>

                {/* TextBooks only display if its NON-LAB Subjects */}
                {(!courseData.course_type === "PCCL (L)" || !courseData.course_type === "UHV")&&
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm transition-opacity duration-700">
                    <button
                        onClick={() => setOpen(o => ({ ...o, tlinks: !o.tlinks }))}
                        className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 hover:bg-gray-200 transition font-semibold text-slate-800"
                    >
                        Text Books
                        <span className="text-lg">{open.tl ? <ChevronUp/> : <ChevronDown/>}</span>
                    </button>

                    {/* TEXTBOOK DETAILS */}
                    {open.tlinks && (
                        <div className="p-5 bg-white ">
                            <div className="space-y-2 text-slate-700 leading-relaxed">
                                {courseData.textbooks.length !==0 
                                ?<div className="mt-4">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Text Books</h3>
                                    <div className="flex flex-col gap-4">
                                        {courseData.textbooks.map((tb, index) => (
                                        <div 
                                            key={index}
                                            className="border rounded-lg p-4 bg-white shadow-sm"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                            {/* Author */}
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase">Author</p>
                                                <p className="text-sm font-medium">
                                                {tb.slNo}. {tb.author}
                                                </p>
                                            </div>

                                            {/* Book */}
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase">Book</p>
                                                <p className="text-sm font-medium">{tb.bookTitle}</p>
                                            </div>

                                            {/* Publisher */}
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase">Publisher</p>
                                                <p className="text-sm font-medium">{tb.publisher}</p>
                                            </div>
                                            </div>

                                            {/* Extra info if needed */}
                                            {/* {tb.info && (
                                            <div className="mt-3 text-xs text-gray-500">
                                                <p>Publication: {tb.info.publicationYear}</p>
                                                <p>Email: {tb.info.authorEmail}</p>
                                            </div>
                                            )} */}
                                        </div>
                                        ))}
                                    </div>
                                </div>
                                :<p>Details Not Found</p>}
                            </div>
                        </div>
                    )}   
                </div>}

                {/* ACtivity based Section */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm transition-opacity duration-700">
                    <button
                        onClick={() => setOpen(o => ({ ...o, al: !o.al }))}
                        className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 hover:bg-gray-200 transition font-semibold text-slate-800"
                    >
                        Activity Based Learning
                        <span className="text-lg">{open.tl ? <ChevronUp/> : <ChevronDown/>}</span>
                    </button>

                    {/* TEXTBOOK DETAILS */}
                    {open.al && (
                        <div className="p-5 bg-white ">
                            <div className="space-y-2 text-slate-700 leading-relaxed">
                                {courseData.activity_based.length !==0 
                                ?<div className="">
                                {courseData.activity_based.split("\n").map(it => (
                                    <h2>• {it}</h2>
                                ))}
                                </div>
                                :<p>No Data fnd</p>} 
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>}
        
        {editForm==="open" && <InputForm formData={courseData} setFormData={setCourseData} editSub={editSubjectDetails} closeForm={()=>setEditForm("close")}/>}
        {moduleEditForm[0] && <ModuleEditForm module={moduleEditForm[1]} onSave={(updated)=>handleEditModule(updated)} onCancel={()=>showModuleEditForm([false,null,null])}/>}

        </div>
    </>
    )
}