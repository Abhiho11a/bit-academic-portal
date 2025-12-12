export function resetFormData(setFormData){
    setFormData(
        {
            sem:"",
            course_title:"",
            course_code:"",
            course_type:"",
            credits:"",
            cie:"",
            see:"",
            ltps:"",
            exam_hours:"",
            course_objectives:"",
            course_outcomes:"",
            teaching_learning:"",
            referral_links:"",
            textbooks:[],
            modules: [ {"no":1},{"no": 2},{"no": 3},{"no": 4},{"no": 5}],
            activity_based:"",
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

export function getDeptName(dept){
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