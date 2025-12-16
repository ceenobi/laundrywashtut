import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateLoginUserSchema } from "@/utils/formValidate";
import { useForm } from "react-hook-form";
import FormField from "@/components/FormField";
import { Link } from "react-router";
import { loginUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateLoginUserSchema),
  });
  const { setAccessToken } = useAuth();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      toast.success(res.data.message || "Login successful");
      //save accesstoken and redirect user to home page
      setAccessToken(res.data.data);
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(
        error?.response.data?.message ||
          error?.response.data ||
          "Error logging you in"
      );
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-4 rounded-xl shadow w-full max-w-[461px] mx-auto text-white">
      <h1 className="text-3xl font-bold">Welcome Back!</h1>
      <p>Enter your details to continue</p>
      <form
        className="my-8 flex flex-col items-center gap-2 w-full"
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
          <FormField
            label="Password"
            type="password"
            placeholder="Password"
            id="password"
            register={register}
            errors={errors}
            name="password"
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
          <p className="text-end mt-2">
            <Link to="/auth/forgot-password">Forgot password?</Link>
          </p>
          <button
            type="submit"
            className="mt-8 btn btn-lg bg-indigoLight text-white w-full rounded-full border-0"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader className="animate-spin mr-2" /> Signing in
              </>
            ) : (
              "Sign In"
            )}
          </button>
          <p className="mt-6 text-center text-white">
            Don't have an account{" "}
            <Link className="text-indigoLight font-bold hover:underline" to="/register">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
