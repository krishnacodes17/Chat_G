import { apiinstance } from "./apiInstance"



export const authMeApi = async ()=>{
    const response = await apiinstance.get("/authme")
    return response.data
}