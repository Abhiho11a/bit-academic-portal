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