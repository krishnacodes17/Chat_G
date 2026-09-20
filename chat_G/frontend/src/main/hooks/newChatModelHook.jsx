import { useForm } from "react-hook-form";

const useNewChatModal = (onCreate,onClose) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const submitHandler = (data) => {
    // console.log("data hai ye ", data)
    onCreate(data);

    reset();
    onClose();
  };


  return {
    register,
    handleSubmit,
    errors,
    submitHandler
  };
};

export default useNewChatModal;
