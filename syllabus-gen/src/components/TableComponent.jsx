import { Eye, Trash2 } from "lucide-react";

export function TableComponent({courses,setCourses,setDetailedView}){

    function deleteCourse(id){
        const filteredCourses = courses.filter(course => course.id !== id)
        setCourses(filteredCourses)
    }
    return (
    <div className="bg-white rounded-lg overflow-hidden mt-1">
        <div className="overflow-x-auto">
            <table className="w-[95%] md:w-[70%] border-collapse justify-self-center">
                <thead>
                    <tr className="bg-slate-600">
                    <th className="hidden md:table-cell py-4 px-4 text-left text-white font-bold border-r border-blue-300">
                        Sem
                    </th>
                    <th className="py-4 px-4 text-left text-white font-bold border-r border-blue-300">
                        Course Title
                    </th>
                    <th className="py-4 px-4 text-left text-white font-bold border-r border-blue-300">
                        Course Code
                    </th>
                    <th className="hidden md:table-cell py-4 px-4 text-center text-white font-bold border-r border-blue-300">
                        Credits
                    </th>
                    <th className="hidden md:table-cell py-4 px-4 text-center text-white font-bold border-r border-blue-300">
                        Exam Type
                    </th>
                    <th className="py-4 px-4 text-center text-white font-bold">
                        Action
                    </th>
                    </tr>
                </thead>
        
                <tbody>
                    {Array.isArray(courses) && courses.length > 0 && courses.map((course, index) => (
                    <tr
                        key={index}
                        className={`border-b border-gray-300 hover:bg-gray-100 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                    >
                        <td className="hidden text-center md:table-cell py-4 px-4 text-gray-800 font-semibold">
                        {course.sem}
                        </td>
        
                        <td className="py-4 px-4 text-gray-900">
                        <div className="md:min-w-[250px] text-sm lg:text-lg">{course.course_title}</div>
                        </td>
        
                        <td className="py-4 px-4 text-gray-900 font-medium">
                        {course.course_code}
                        </td>
        
                        <td className="hidden md:table-cell py-4 px-4 text-center text-gray-900">
                        {course.credits}
                        </td>
                        <td className="hidden md:table-cell py-4 px-4 text-center text-sm lg:text-md text-gray-900">
                        {course.course_type}
                        </td>
        
                        <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-3">
                                {/* VIEW BUTTON */}
                                <button
                                    
                                    className="flex items-center gap-1 bg-slate-600 text-white hover:bg-slate-700 
                                                rounded-lg py-1 px-2 text-sm transition cursor-pointer"
                                >
                                    <Eye className="h-4 w-4" />
                                    View
                                </button>

                                {/* DELETE BUTTON */}
                                <Trash2 size={30} onClick={() => deleteCourse(course.id)} className="rounded-md bg-red-600 p-1 text-white cursor-pointer"/>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}