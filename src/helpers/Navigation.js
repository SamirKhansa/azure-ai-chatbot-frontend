
export const NavigateViewPage= async (doc, navigate)=>{
    if (doc) {
        navigate(`/dashboard/View`, { state: { doc } });
    } 
    else {
        alert("Document not found.");
    }
}