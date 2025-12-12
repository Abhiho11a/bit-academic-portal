import { Download } from 'lucide-react';
import React from 'react'

export const JsonRender = ({courseData}) => {

    function downloadJSON(data, filename = `${courseData.course_code}.json`) {
  const jsonStr = JSON.stringify(data, null, 2); // pretty formatting

  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

  return (
     <button
        onClick={()=>downloadJSON(courseData)}
      className="flex gap-1 items-center px-4 py-1.5 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-800 transition font-medium shadow-sm text-xs md:text-[15px]"
    >
      <Download size={20} />
      {/* <p className="text-xs md:text-[15px] hidden md:block">Download JSON</p> */}
      <p className="text-[15px]">Download JSON</p>
    </button>
  )
}
