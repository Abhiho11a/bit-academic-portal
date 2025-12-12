import { X } from "lucide-react";

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
                    type="number"
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