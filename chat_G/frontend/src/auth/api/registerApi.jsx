import { apiinstance } from "../../shared/api/apiInstance";



export const registerApi = async(RegisterData)=>{
    const response  = await apiinstance.post("/auth/register",RegisterData)
    return response.data
}