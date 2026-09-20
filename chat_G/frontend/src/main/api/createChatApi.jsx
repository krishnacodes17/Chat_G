import { apiinstance } from "../../shared/api/apiInstance"



export const createChatApi = async (chatData)=>{
    const response = await apiinstance.post("/chat",chatData)
    return response.data
}


export const getAllChatApi = async()=>{
    const response = await apiinstance.get("/chat/getchatHistory")
    return response.data
}


export const getChatMessagesApi = async(chatData)=>{
    const response = await apiinstance.get(`/chat/getSingalChat/${chatData}`)
    return response.data
}