import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../api/profileApi";

const useProfile = (enabled) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    enabled,
    retry: false,
  });

  return {
    data,
    isLoading,
  };
};

export default useProfile;