import { zodResolver } from "@hookform/resolvers/zod";
import { validateForgotPasswordSchema } from "@/utils/formValidate";
import { useForm } from "react-hook-form";
import FormField from "@/components/FormField";
import { forgotPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateForgotPasswordSchema),
  });
  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res) => {
      toast.success(res.data.message || "Password reset link sent");
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to send reset link"
      );
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-4 rounded-xl shadow w-full max-w-[461px] mx-auto text-white">
      <h1 className="text-3xl font-bold">Forgot Password</h1>
      <p>Enter your information</p>
      <form
        className="my-8 flex flex-col items-center gap-2  w-[310px] md:w-[450px] mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <FormField
            label="Email"
            type="email"
            placeholder="email@example.com"
            id="fullname"
            register={register}
            errors={errors}
            name="email"
          />
          <button
            type="submit"
            className="mt-8 btn btn-lg bg-indigoLight text-white w-full rounded-full border-0"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader className="animate-spin mr-2" /> Next
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
