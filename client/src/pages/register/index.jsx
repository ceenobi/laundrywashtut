import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateRegisterUserSchema } from "@/utils/formValidate";
import { useForm } from "react-hook-form";
import FormField from "@/components/FormField";
import { Link } from "react-router";
import { registerUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateRegisterUserSchema),
  });
  const { setAccessToken } = useAuth();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      toast.success(res.data.message || "Registration successful");
      //save accesstoken and redirect user to home page
      setAccessToken(res.data.data);
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Registration failed"
      );
    },
  });

  const onSubmit = async (data) => {
    if (!data.phone.startsWith("+234")) {
      toast.warning("Phone must begin with intl format");
      return;
    }
    mutation.mutate(data);
  };

  return (
    <div className="p-4 rounded-xl shadow w-full max-w-[461px] mx-auto text-white">
      <h1 className="text-3xl font-bold">Create Account</h1>
      <p>Enter your information to create an account</p>
      <form
        className="my-8 flex flex-col items-center gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <FormField
            label="Full name"
            type="text"
            placeholder="John Doe"
            id="fullname"
            register={register}
            errors={errors}
            name="fullname"
          />
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
            label="Phone Number"
            type="tel"
            placeholder="+2340000000000"
            id="phone"
            register={register}
            errors={errors}
            name="phone"
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
          <button
            type="submit"
            className="mt-8 btn btn-lg bg-indigoLight text-white w-full rounded-full border-0"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader className="animate-spin mr-2" /> Signing up
              </>
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="mt-6 text-center text-white">
            Already have an account{" "}
            <Link className="font-bold text-indigoLight hover:underline" to="/login">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
