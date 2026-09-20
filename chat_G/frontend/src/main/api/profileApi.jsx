import { apiinstance } from "../../shared/api/apiInstance"



export const getProfileApi = async ()=>{
    const response = await apiinstance.get("/profile")
    return response.data
}