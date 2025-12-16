import { zodResolver } from "@hookform/resolvers/zod";
import { validateResetPasswordSchema } from "@/utils/formValidate";
import { useForm } from "react-hook-form";
import FormField from "@/components/FormField";
import { useState } from "react";
import { resetPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

export default function ResetPassword() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateResetPasswordSchema),
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  //look for query values on url
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (res) => {
      toast.success(res.data.message || "Password reset successful");
      navigate("/login");
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(error?.response?.data?.message || error?.response.data);
    },
  });

  const onSubmit = async (data) => {
    const formData = { ...data, userId, token };
    mutation.mutate(formData);
  };

  return (
    <div className="p-4 rounded-xl shadow w-full max-w-[461px] mx-auto text-white">
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <p>Enter your new password</p>
      <form
        className="my-8 flex flex-col items-center gap-2 w-[310px] md:w-[450px] mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <FormField
            label="Password"
            type="password"
            placeholder="Enter your new password"
            id="newPassword"
            register={register}
            errors={errors}
            name="newPassword"
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
          <FormField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            id="confirmPassword"
            register={register}
            errors={errors}
            name="confirmPassword"
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
          <button
            type="submit"
            className="mt-8 btn btn-lg bg-indigoLight text-white w-full rounded-full border-0"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader className="animate-spin mr-2" /> Resetting...
              </>
            ) : (
              "Reset"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
