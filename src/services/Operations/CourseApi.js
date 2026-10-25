import { instructorEndpoints } from "../api";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
const {CREATE_COURSE_API,EDIT_COURSE_API,ADD_SECTION_API,UPDATE_SECTION_API,DELETE_SECTION_API,ADD_SUBSECTION_API,UPDATE_SUBSECTION_API,DELETE_SUBSECTION_API} = instructorEndpoints

export function createCourse(formData,setLoading,setCourse,setStep) {
    return async (dispatch) => {
        setLoading(true);
        try {
            const response = await apiConnector("POST",CREATE_COURSE_API,   formData);
            console.log("response data -> ",response?.data);
            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }
            setCourse(response?.data?.data);
            setStep(2);
        } catch (error) {
            const message = error?.response?.data?.message || error?.message;
            toast.error(message);
        }
        setLoading(false);
    }

}
export function editCourse(formData,setLoading,setCourse,setStep){
    return async (dispatch) => {
        setLoading(true);
        try {
            const response = await apiConnector("PUT",EDIT_COURSE_API,formData);
            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }
            setCourse(response?.data?.updatedCourse);
            setStep(2);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);            
        }
        setLoading(false);
    }
}
export function addSection(sectionName,courseId,setLoading,setSections,setCourse,setOpenSections){
    return async(dispatch) => {
        setLoading(true);
        try {
            const response = await apiConnector("POST",ADD_SECTION_API,{sectionName,courseId});
            if(!response?.data?.success){
                throw new Error(response?.data?.success);
            }
            setSections(prev => [...prev,response?.data?.newSection]);
            setCourse(prev => ({...prev,courseContent:[...prev.courseContent,response?.data?.newSection]}))
            setOpenSections(prev => ({...prev,[response?.data?.newSection?._id]: true}))
        } catch (error) {
            const message = error?.response?.data?.message || error?.message;
            toast.error(message);            
        }
        setLoading(false);
    } 

}
export function editSection(newSectionName,courseId,sectionId,setLoading,setSections,setCourse,setEditingSection,setEditSectionName){
    return async(dispatch) => {
        setLoading(true);
        try {
            const response = await apiConnector("PUT",UPDATE_SECTION_API,{newSectionName,courseId,sectionId});
            if(!response?.data?.success){
                throw new Error(response?.data?.success);
            }
            setEditingSection(null);
            setEditSectionName("");
            setSections(prev => prev.map(section => section?._id === sectionId ? {...section,sectionName: newSectionName}: section));
            setCourse(prev => ({...prev,courseContent: prev.courseContent.map(section => section?._id === sectionId ? {...section,sectionName: newSectionName}: section)}));
        } catch (error) {
            const message = error?.response?.data?.message || error?.message;
            toast.error(message);            
        }
        setLoading(false);
    } 

} 
export function deleteSection(sectionId,courseId,setSections,setCourse){
    return async(dispatch) => {
        try {
            const response = await apiConnector("DELETE",DELETE_SECTION_API
            ,{sectionId,courseId});
            if(!response?.data?.success){
                throw new Error(response?.data?.success);
            }
            const deletedSection = response?.data?.deletedSection;
            setSections(prev => prev.filter(section => section?._id !== deletedSection?._id));
            setCourse(prev => ({...prev,courseContent : prev.courseContent?.filter(section => section?._id !== deletedSection?._id)}))
        } catch (error) {
            const message = error?.response?.data?.message || error?.message;
            toast.error(message);            
        }
    } 
}
export function editCourseStatus(status,course,setLoading,setCourse,setStep){
    return async (dispatch) => {
        setLoading(true);
        try {
            const response = await apiConnector("PUT",EDIT_COURSE_API,{courseId:course?._id,status:status});
            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }
            setCourse(response?.data?.updatedCourse);
            setStep(4);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);            
        }
        setLoading(false);
    }
}
export function addSubSection(formData,section,setLoading,setCourse,setSections,setLetureData){
    return async (dispatch) => {
        setLoading(true);
        const toastId = toast.loading("Loading...")
        try {
            const sectionId = section?._id;
            const response = await apiConnector("POST",ADD_SUBSECTION_API,formData);
            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }
            toast.success("Lecture Updated");
            setSections(prev => prev.map(section => section?._id === sectionId ? response?.data?.updatedSection : section));
            setCourse(prev => ({...prev,courseContent: prev.courseContent?.map(section => section?._id === sectionId ? response?.data?.updatedSection : section)}));
            setLetureData(null);
        } catch (error) {
            const message = error?.response?.data?.message || error?.message;
            toast.error(message);            
        }
        toast.dismiss(toastId);
        setLoading(false);
    }
}
export function editSubSection(formData,section,subSectionId,setLoading,setCourse,setSections){
    return async (dispatch) => {
        setLoading(true);
        const sectionId = section?._id;
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector("PUT",UPDATE_SUBSECTION_API,formData);
            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }
            toast.success("Edited Sucessfully")
            setSections(prev => prev.map(section => section?._id === sectionId ? ({...section,subSection: section?.subSection?.map(subSection => subSection?._id === subSectionId ? response?.data?.newSubSection : subSection) }) : section));

            setCourse(prev => ({...prev,courseContent: prev.courseContent?.map(section => section?._id === sectionId ? ({...section,subSection: section?.subSection.map(subSection => subSection?._id === subSectionId ? response?.data?.newSubSection : subSection )}) : section)}))
            
        } catch (error) {
            const message = error?.response?.data?.message || error?.message;
            toast.error(message);
        }
        setLoading(false)
        toast.dismiss(toastId);
    }
}
export function deleteSubSection(sectionId,subSectionId,course,setLoading,setCourse,setSections){
    return async (dispatch) => {
        const courseId = course?._id;
        setLoading(true);
        try {
            const response = await apiConnector("DELETE",DELETE_SUBSECTION_API,{sectionId,subSectionId,courseId})
            if(!response?.data?.success){
                throw new Error(response?.data?.message);
            }

            setSections(prev => prev.map(section => section?._id === sectionId ? ({...section,subSection: section?.subSection?.filter(subSection => subSection?._id !== subSectionId)}) : section));

            setCourse(prev => ({...prev,courseContent: prev.courseContent?.map(section => section?._id === sectionId ? ({...section,subSection: section?.subSection?.filter(subSection => subSection?._id !== subSectionId)}) : section)}));
            
        } catch (error) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);
        }
        setLoading(false);
    }
}