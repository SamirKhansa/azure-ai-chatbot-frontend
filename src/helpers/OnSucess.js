

export const OnSucessNoAttributes= async({onSuccess})=>{
    if(onSuccess){
        onSuccess();
    }
    return;
}

export const OnSucessOneAttribute= async ({onSuccess}, Doc)=> {
    if(onSuccess){
        onSuccess(Doc);
    }
    return;

}

export const OnSucessMultipleAttributes= async ({onSuccess, email}, role) =>{
    if(onSuccess){
        onSuccess(email, role);
    }
   
}