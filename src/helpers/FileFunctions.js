

export const FileAttributesExsist = async({file, docName, resource}, setLoading) =>{
    if (!file || !docName || !resource) {
          alert("Please provide file, document name, and resource");
          setLoading(false);
          throw new Error("Please provide file, document name, and resource");
          
        }
        return
}