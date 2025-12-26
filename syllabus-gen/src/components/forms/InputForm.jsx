import { Check, Edit2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import supabase from "../../services/supabaseClient";

export function InputForm({formData,setFormData,addSub,editSub,closeForm}){

    {/* IF FormData doesnot contains COPO-Mapping Object then add to formData */}
    if (!formData.copoMapping) {
        setFormData({...formData,
            copoMapping: {
                headers: ["PO1","PO2","PO3","PO4","PO5","PO6","PO7","PO8","PO9","PO10","PO11"],
                rows: [
                    { co: "CO1", vals: Array(11).fill(""), pso: ["", ""] },
                    { co: "CO2", vals: Array(11).fill(""), pso: ["", ""] },
                    { co: "CO3", vals: Array(11).fill(""), pso: ["", ""] },
                    { co: "CO4", vals: Array(11).fill(""), pso: ["", ""] },
                    { co: "CO5", vals: Array(11).fill(""), pso: ["", ""] },
                ]
                }
            });
    }

    {/* Dynamic AUTHOR Details and TEXTBOOK Details Adding */}
    const authors = formData.textbooks || [];

    const addAuthor = () => {
        const updated = [...authors, { slNo: "", author: "", bookTitle: "", publisher: "" }];
        setFormData({ ...formData, textbooks: updated });
    };

    const updateAuthor = (index, field, value) => {
        const updated = [...authors];
        updated[index][field] = value;
        setFormData({ ...formData, textbooks: updated });
    };

    const removeAuthor = (index) => {
        const updated = [...authors];
        updated.splice(index, 1);
        setFormData({ ...formData, textbooks: updated });
    };

    {/* DYNAMIC PSO Cols in COPO Mapping Table */}
    function addPsoCol () {

        const updatedRows = formData.copoMapping.rows.map(row => ({
            ...row,
            pso: [...row.pso, ""]  // add one empty PSO column
        }));

        setFormData({
            ...formData,
            copoMapping: {
            ...formData.copoMapping,
            rows: updatedRows,
            }
        });
    };

    function removePsoCol () {
        const currentLength = formData.copoMapping.rows[0].pso.length;

        if (currentLength <= 2) {
            alert("At least two PSO columns are required.");
            return;
        }
        //Removing from last Using SLICE ARRAY SLICE Method
        const updatedRows = formData.copoMapping.rows.map(row => ({
            ...row,
            pso: row.pso.slice(0, -1)
        }));

        setFormData({
            ...formData,
            copoMapping: {
            ...formData.copoMapping,
            rows: updatedRows
            }
        });
};


    {/* Check For Valid Data in FORM and then DECIDE ACCORDINGLY */}
    function onSubmit() {

        if(!formData.course_title)
        {
            alert("Please Type Course Title")
            return;
        }
        if(!formData.course_code)
        {
            alert("Please Type Course Code")
            return;
        }
        if(formData.sem == "")
        {
            alert("Please Select Semester")
            return;
        }
        if(formData.course_type == "")
        {
            alert("Please Select Course Type")
            return;
        }
        
        //If Still SOME FIELDS are NOT FILLED then Giving ALERT 
        if(!formData.credits || !formData.cie || !formData.see || !formData.course_objectives || !formData.course_outcomes || !formData.teaching_learning || !formData.textbooks || !formData.referral_links || !formData.teaching_learning)    
            alert("You are having some more details to add...Please fill all those by clicking Viewbutton.")

        
        if (editSub)
          editSub();
        else 
          addSub();
        
        //AFTER ALL CLOSE FORM
        closeForm();
}

    const handleModuleChange = (idx, e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedModules = [...prev.modules];

            updatedModules[idx] = {
            ...updatedModules[idx],
            [name]: value
            };

            return {
            ...prev,
            modules: updatedModules
            };
        });
    };

    const [newExpNo, setNewExpNo] = useState("");
    const [newExpCont, setNewExpCont] = useState("");
    const [editingExpIndex, setEditingExpIndex] = useState(null);
    const [editExpNo, setEditExpNo] = useState("");
    const [editExpCont, setEditExpCont] = useState("");

    //Adding new Experiment
        const addNewExperiment = () => {
  if (!newExpNo || !newExpCont) {
    alert("Please fill all the details");
    return;
  }

  setFormData(prev => {
    const updatedExps = [
      ...(prev.experiments || []),
      {
        slno: parseInt(newExpNo),
        cont: newExpCont
      }
    ].sort((a, b) => a.slno - b.slno);

    return {
      ...prev,
      experiments: updatedExps
    };
  });

  setNewExpNo("");
  setNewExpCont("");
};

        //Delete Experiment
        const handleDeleteExperiment = (index) => {
  if (!window.confirm("Are you sure you want to delete this experiment?"))
    return;

  setFormData(prev => ({
    ...prev,
    experiments: prev.experiments.filter((_, i) => i !== index)
  }));
};

    
        // Start Edit
        const startEditExperiment = (index) => {
  const exp = formData.experiments[index];
  setEditingExpIndex(index);
  setEditExpNo(exp.slno);
  setEditExpCont(exp.cont);
};

    
        // Edit Experiment
        const saveEditExperiment = () => {
  if (!editExpNo || !editExpCont) {
    alert("Please fill all fields");
    return;
  }

  setFormData(prev => {
    const updatedExps = [...prev.experiments];
    updatedExps[editingExpIndex] = {
      slno: parseInt(editExpNo),
      cont: editExpCont
    };

    updatedExps.sort((a, b) => a.slno - b.slno);

    return {
      ...prev,
      experiments: updatedExps
    };
  });

  setEditingExpIndex(null);
  setEditExpNo("");
  setEditExpCont("");
};

    
        const cancelEditExperiment = () => {
  setEditingExpIndex(null);
  setEditExpNo("");
  setEditExpCont("");
};




    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200 mt-10">
            {/* Heading */}
            <div className="flex w-full justify-between">
                <h2 className="text-2xl font-semibold text-slate-700 mb-6">Add / Edit Course Details</h2>
                <X size={40} className="rounded-lg cursor-pointer hover:scale-110 bg-gray-100 p-1" onClick={()=>closeForm()}/>
            </div>

            {/* ======== BASIC DETAILS (GRID) ======== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Title */}
                <div>
                    <label className="text-sm font-semibold text-slate-600">Course Title</label>
                    <input
                    type="text"
                    value={formData.course_title}
                    onChange={e => setFormData({ ...formData, course_title: e.target.value })}
                    className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-slate-400 outline-none"
                    />
                </div>
                {/* Course Code */}
                <div>
                    <label className="text-sm font-semibold text-slate-600">Course Code</label>
                    <input
                    type="text"
                    value={formData.course_code}
                    onChange={e => setFormData({ ...formData, course_code: e.target.value })}
                    className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg
                                focus:ring-2 focus:ring-slate-400 outline-none"
                    />
                </div>
            </div>

            {/* ======== SEM + COURSE TYPE + CREDITS + MARKS ======== */}
            <div className="w-full flex flex-col md:flex-row md:justify-between gap-2 mt-6">
                {/* Course Type */}
                <div className="md:w-1/4 w-full flex gap-2">
                    <div className="w-1/2">
                    <label className="text-sm font-semibold text-slate-600">Semester</label>
                    <select
                        value={formData.sem}
                        onChange={e => setFormData({ ...formData, sem: e.target.value })}
                        className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-slate-400 outline-none w-full"
                    >
                        <option value="" hidden>Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>
                    </div>
                    <div className="w-1/2">
                    <label className="text-sm font-semibold text-slate-600">Course Type</label>
                    <select
                        value={formData.course_type}
                        onChange={e => setFormData({...formData,course_type: e.target.value})}
                        className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-slate-400 outline-none w-full"
                    >
                        <option value="" hidden>Select</option>
                        <option value="IPCC">IPCC</option>
                        <option value="PCC">PCC</option>
                        <option value="AEC">AEC</option>
                        <option value="OE">OE</option>
                        <option value="PE">PE</option>
                        <option value="ESC">ESC</option>
                        <option value="PCCL">PCCL</option>
                        <option value="UHV">UHV</option>
                    </select>
                    </div>
                </div>
                <div className="md:w-1/5 w-full">
                    <label className="text-sm font-semibold text-slate-600">L-T-P-S</label>
                    <input
                    type="text"
                    value={formData.ltps}
                    onChange={e => setFormData({ ...formData, ltps: e.target.value })}
                    className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-slate-400 outline-none w-full"
                    placeholder="4:2:1:0"
                    />
                </div>

                {/* Course Credits */}
                <div className="md:w-1/4   flex w-full gap-2">
                    <div>
                        <label className="text-sm font-semibold text-slate-600"> Credits</label>
                        <input
                        type="number"
                        value={formData.credits}
                        onChange={e => setFormData({ ...formData, credits: e.target.value })}
                        className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                    focus:ring-2 focus:ring-slate-400 outline-none w-full"
                        />
                    </div>
                    <div className="">
                        <label className="text-sm font-semibold text-slate-600">Exam hrs</label>
                        <input
                        type="text"
                        value={formData.exam_hours}
                        onChange={e => setFormData({ ...formData, exam_hours: e.target.value })}
                        className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                    focus:ring-2 focus:ring-slate-400 outline-none w-full"
                        placeholder="3"
                        />
                    </div>    
                </div>

                <div className="md:w-1/8 w-full">
                    <label className="text-sm font-semibold text-slate-600">Pedagogy</label>
                    <input
                    type="text"
                    value={formData.pedagogy}
                    onChange={e => setFormData({ ...formData, pedagogy: e.target.value })}
                    className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-slate-400 outline-none w-full"
                        placeholder="40+20"
                    />
                </div>

                <div className="md:w-1/4 w-full flex gap-2">
                    {/* CIE Marks */}
                    <div className="">
                        <label className="text-sm font-semibold text-slate-600">CIE Marks</label>
                        <input
                            type="number"
                            value={formData.cie}
                            onChange={e => setFormData({ ...formData, cie: e.target.value })}
                            className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                    focus:ring-2 focus:ring-slate-400 outline-none w-full"
                        />
                    </div>
                    {/* SEE Marks */}
                    <div className="">
                    <label className="text-sm font-semibold text-slate-600">SEE Marks</label>
                    <input
                        type="number"
                        value={formData.see}
                        onChange={e => setFormData({ ...formData, see: e.target.value })}
                        className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-slate-400 outline-none w-full"
                    />
                    </div>
                </div>
            </div>


            {/* ======== COURSE OBJECTIVES ======== */}
            <div className="mt-8">
                <label className="text-sm font-semibold text-slate-600">Course Objectives</label>
                <textarea
                    value={formData.course_objectives}
                    onChange={e => setFormData({ ...formData, course_objectives: e.target.value })}
                    className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg h-32 resize-none
                            focus:ring-2 focus:ring-slate-400 outline-none"
                />
            </div>

            {/* Modules Details */}
            <div className="flex flex-col gap-10 mt-5">
                <h2 className="text-sm font-semibold text-slate-600">Modules Details</h2>
                {formData.modules.map((it,idx) => <div className="border-2 p-4 border-gray-200 space-y-4">
                    <h2 className="text-center text-xl">Module-{idx+1}</h2>

                    {/* Module Title */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Module Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.modules[idx].title}
                        onChange={(e) => handleModuleChange(idx,e)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    </div>

                    {/* Content */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Topics Covered
                    </label>
                    <textarea
                        name="content"
                        rows="4"
                        value={formData.modules[idx].content}
                        onChange={(e) => handleModuleChange(idx,e)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    ></textarea>
                    </div>

                    {/* Textbook */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Text Book No.
                    </label>
                    <input
                        type="text"
                        name="textbook"
                        value={formData.modules[idx].textbook}
                        onChange={(e) => handleModuleChange(idx,e)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    </div>

                    {/* Chapter */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Chapter Article No.
                    </label>
                    <input
                        type="text"
                        name="chapter"
                        value={formData.modules[idx].chapter}
                        onChange={(e) => handleModuleChange(idx,e)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    </div>

                    {/* RBT */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        RBT Level(s)
                    </label>
                    <input
                        type="text"
                        name="rbt"
                        value={formData.modules[idx].rbt}
                        onChange={(e) => handleModuleChange(idx,e)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    </div>
        </div>)}
      </div>

            {/* Experiments */}            
            {(formData.course_type === "PCCL"||formData.course_type === "IPCC" || formData.course_type === "AEC" || formData.course_type === "ESC" || formData.experiments) && (
  <div className="my-10 py-3 px-5 border-2 border-gray-200 bg-white">
                        <label className="text-sm font-semibold text-slate-600">Experiments</label> 

    {/* Add Experiment Form */}
    <div className="mt-2 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-sm font-semibold text-blue-900 mb-3">
        Add New Experiment
      </h3>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="number"
          placeholder="Sl No."
          value={newExpNo}
          onChange={(e) => setNewExpNo(Number(e.target.value))}
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
          type="button"
          onClick={addNewExperiment}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium whitespace-nowrap"
        >
          <Plus size={18} />
          Add
        </button>
      </div>
    </div>

    {/* Experiments Table */}
    {(!formData.experiments || formData.experiments.length === 0) ? (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No experiments added yet</p>
        <p className="text-sm mt-2">
          Add your first experiment using the form above
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="px-4 py-3 text-left font-semibold w-20 border-r border-slate-500">
                Sl No
              </th>
              <th className="px-4 py-3 text-left font-semibold border-r border-slate-500">
                Experiment
              </th>
              <th className="px-4 py-3 text-center font-semibold w-32">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {formData.experiments.map((exp, idx) => (
              <tr
                key={exp.slno ?? idx}
                className={`border-b border-gray-200 transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {editingExpIndex === idx ? (
                  <>
                    {/* EDIT MODE */}
                    <td className="px-4 py-3 border-r border-gray-200">
                      <input
                        type="number"
                        value={editExpNo}
                        onChange={(e) =>
                          setEditExpNo(Number(e.target.value))
                        }
                        className="w-16 px-2 py-1 border-2 border-blue-400 rounded focus:outline-none"
                      />
                    </td>

                    <td className="px-4 py-3 border-r border-gray-200">
                      <textarea
                        value={editExpCont}
                        onChange={(e) =>
                          setEditExpCont(e.target.value)
                        }
                        rows={2}
                        className="w-full px-2 py-1 border-2 border-blue-400 rounded focus:outline-none resize-none"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={saveEditExperiment}
                          className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition font-medium"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditExperiment}
                          className="px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition font-medium"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    {/* VIEW MODE */}
                    <td className="px-4 py-3 text-center font-semibold text-gray-700 border-r border-gray-200">
                      {exp.slno}
                    </td>

                    <td className="px-4 py-3 text-gray-700 leading-relaxed border-r border-gray-200">
                      {exp.cont}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditExperiment(idx)}
                          className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition font-medium"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          type="button"
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
)}

            
            {/* ======== COURSE OUTCOMES ======== */}
            <div className="mt-8">
                <label className="text-sm font-semibold text-slate-600">Course Outcomes</label>
                <textarea
                    value={formData.course_outcomes}
                    onChange={e => setFormData({ ...formData, course_outcomes: e.target.value })}
                    className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg h-32 resize-none
                            focus:ring-2 focus:ring-slate-400 outline-none"
                />
            </div>
            {/* ======== TEACHING LEARNING ======== */}
            <div className="mt-6">
                <label className="text-sm font-semibold text-slate-600">Teaching & Learning</label>
                <textarea
                    value={formData.teaching_learning}
                    onChange={e => setFormData({ ...formData, teaching_learning: e.target.value })}
                    className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg h-32 resize-none
                            focus:ring-2 focus:ring-slate-400 outline-none"
                />
            </div>

            {/* ======== TEXTBOOK AUTHORS (DYNAMIC) ======== */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex justify-between">
                    Textbooks / References
                    <button
                    onClick={addAuthor}
                    className="px-3 py-1 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700"
                    >
                    + Add Author
                    </button>
                </h3>

                {authors.length === 0 && (
                    <p className="text-gray-500 mb-4">No authors added yet.</p>
                )}
                {authors.map((item, index) => (
                    <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg relative"
                    >
                    {/* Remove Button */}
                    <button
                        onClick={() => removeAuthor(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    >
                        ✕
                    </button>

                    {/* Sl No */}
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Sl. No</label>
                        <input
                        type="text"
                        value={item.slNo}
                        onChange={e => updateAuthor(index, "slNo", e.target.value)}
                        className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-slate-400 outline-none"
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Author</label>
                        <input
                        type="text"
                        value={item.author}
                        onChange={e => updateAuthor(index, "author", e.target.value)}
                        className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-slate-400 outline-none"
                        />
                    </div>

                    {/* Book Title */}
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Book Title</label>
                        <input
                        type="text"
                        value={item.bookTitle}
                        onChange={e => updateAuthor(index, "bookTitle", e.target.value)}
                        className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-slate-400 outline-none"
                        />
                    </div>

                    {/* Publisher */}
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Publisher</label>
                        <input
                        type="text"
                        value={item.publisher}
                        onChange={e => updateAuthor(index, "publisher", e.target.value)}
                        className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-slate-400 outline-none"
                        />
                    </div>
                    </div>
                ))}
            </div>

            {/* ======== WEB LINKS ======== */}
            <div className="mt-10">
                <label className="text-sm font-semibold text-slate-600">Web Links & Video Lectures</label>
                <textarea
                    value={formData.referral_links}
                    onChange={e => setFormData({ ...formData, referral_links: e.target.value })}
                    className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg h-28 resize-none
                            focus:ring-2 focus:ring-slate-400 outline-none"
                />
            </div>

            {/* ======== ACTIVITIES ======== */}
            <div className="mt-10">
                <label className="text-sm font-semibold text-slate-600">Activity-Based Learning</label>
                <textarea
                    value={formData.activity_based}
                    onChange={e => setFormData({ ...formData, activity_based: e.target.value })}
                    className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-lg h-28 resize-none
                            focus:ring-2 focus:ring-slate-400 outline-none"
                />
            </div>

            {/* ======== CO-PO MAPPING TABLE ======== */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">
                    CO - PO - PSO Mapping Table
                </h3>

                {/* Add and remove btn for PSO Cols (DYNAMIC) */}
                <div className="flex gap-5 my-4">
                    <div className="group"> 
                    <button onClick={()=>addPsoCol()} className="border rounded-md cursor-pointer border-white px-4 py-2 text-white bg-slate-500 "><h2 className="hidden group-hover:block absolute backdrop-blur-3xl text-black -mt-10 -ml-10 px-2 py-1">Add PSO Column</h2> Add </button>
                    </div>
                    <div className="group">
                    <button onClick={()=>removePsoCol()} className="border rounded-md cursor-pointer border-white px-4 py-2 text-white bg-slate-500"><h2 className="hidden group-hover:block absolute backdrop-blur-3xl text-black -mt-10 -ml-10 px-2 py-1">Remove Last PSO Column</h2> Remove</button>
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="w-full text-center border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                            <th className="border p-2 font-semibold">CO</th>

                            {/* PO HEADERS */}
                            {formData.copoMapping.headers.map((h, idx) => (
                                <th key={idx} className="border p-2 font-semibold">
                                {h}
                                </th>
                            ))}

                            {/* NEW PSO HEADERS */}
                            {formData.copoMapping.rows[0].pso.map((_, i) => (
                            <th key={i} className="border p-2 font-semibold">PSO{i + 1}</th>
                            ))}
                            </tr>
                        </thead>

                        <tbody>
                            {formData.copoMapping.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-50">
                                {/* CO Column */}
                                <td className="border p-2 font-semibold">{row.co}</td>

                                {/* PO Values */}
                                {row.vals.map((val, cIdx) => (
                                <td key={cIdx} className="border p-1">
                                    <input
                                    type="number"
                                    min="0"
                                    max="3"
                                    className="w-12 md:w-16 text-center border rounded-md p-1 focus:ring-2 focus:ring-slate-400"
                                    value={val}
                                    onChange={(e) => {
                                        const updated = { ...formData };
                                        updated.copoMapping.rows[rIdx].vals[cIdx] = e.target.value;
                                        setFormData(updated);
                                    }}
                                    />
                                </td>
                                ))}

                                {/* PSO Cols */}
                                {row.pso.map((val, pIdx) => (
                                    <td className="border p-1" key={pIdx}>
                                        <input
                                        type="number"
                                        min="0"
                                        max="3"
                                        className="w-12 md:w-16 text-center border rounded-md p-1"
                                        value={val}
                                        onChange={(e) => {
                                            const updated = { ...formData };
                                            updated.copoMapping.rows[rIdx].pso[pIdx] = e.target.value;
                                            setFormData(updated);
                                        }}
                                        />
                                    </td>
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ======== SUBMIT BUTTON ======== */}
            <button
            onClick={onSubmit}
            className="mt-10 w-full bg-slate-600 text-white py-3 rounded-lg hover:bg-slate-700 transition"
            >
            Save Course Details
            </button>

        </div>
);
}