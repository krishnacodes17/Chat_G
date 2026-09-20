import { useQuery } from "@tanstack/react-query";
import { authMeApi } from "../api/authMe";

const useAuthMe = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: authMeApi,
    retry:false
  });



  return{
    data,
    isLoading
  }
};


export default useAuthMe