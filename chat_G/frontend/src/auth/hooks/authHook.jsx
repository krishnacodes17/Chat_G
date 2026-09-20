import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/LoginApi";
import { registerApi } from "../api/registerApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../api/logoutApi";

export const AuthHook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ======= login =======
  const { mutate: login, isPending: loginPending } = useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      // console.log("Login successful:", data);
      localStorage.setItem("chatg_token", data.data?.token || "");
      toast.success(data.message);
      navigate("/home");
    },

    onError: (error) => {
      console.log("Backend Message:", error.response?.data?.message);
      toast.error(error.response?.data?.message);
    },
  });

  //    ===== Register ======

  const { mutate: registerfn, isPending: registerPending } = useMutation({
    mutationFn: registerApi,

    onSuccess: (data) => {
      console.log("register successful:", data);
      toast.success(data.message);
      navigate("/");
    },

    onError: (error) => {
      //   console.log("Register Error Full:", error);
      toast.error(error.response?.data?.message);
      console.log("Backend Message:", error.response?.data?.message);
    },
  });

  // Logout Mutation
  const { mutate: logout } = useMutation({
    mutationFn: logoutApi,

    onSuccess: (data) => {
      toast.success(data.message || "Logout successful");

      localStorage.removeItem("chatg_token");

      // Me ka cached user data remove
      queryClient.removeQueries({
        queryKey: ["me"],
      });

      // Logout ke baad login page
      navigate("/", { replace: true });
    },

    onError: (error) => {
      console.log("logout eee", error);
      console.log("Logout Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Unable to logout");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLoginSubmit = (data) => {
    // console.log("login data", data);
    login(data);
  };

  const onRegisterSubmit = (data) => {
    // console.log("register data", data);
    registerfn(data);
  };

  const handleLogout = () => {
    console.log("logout cliked ");
    logout();
  };

  return {
    register,
    handleSubmit,
    errors,
    onLoginSubmit,
    onRegisterSubmit,
    handleLogout,
    loginPending,
    registerPending,
  };
};
