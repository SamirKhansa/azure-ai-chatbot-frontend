export const RolePromoteDenote= async(Purpose)=>{
    if(Purpose=="Promote"){
        return "Admin";
    }
    else{
        return "User";
    }
}