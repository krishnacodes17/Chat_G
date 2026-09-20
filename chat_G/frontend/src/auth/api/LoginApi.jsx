import { apiinstance } from "../../shared/api/apiInstance";



export const loginApi = async(loginData)=>{
    const response  = await apiinstance.post("/auth/login",loginData)
    return response.data
}