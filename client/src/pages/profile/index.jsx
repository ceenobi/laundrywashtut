import { zodResolver } from "@hookform/resolvers/zod";
import { validateProfileSchema } from "@/utils/formValidate";
import { useForm } from "react-hook-form";
import FormField from "@/components/FormField";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router";
import { updateProfile } from "@/api/auth";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateProfileSchema),
    defaultValues: {
      fullname: user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      toast.success(res.data.message || "Profile updated");
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to update profile"
      );
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate({ formData: data, accessToken });
  };
  return (
    <div className="px-4 rounded-xl shadow w-full max-w-[500px] mx-auto lg:mx-8 text-white">
      <form
        className="flex flex-col gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <FormField
            label="Fullname"
            type="text"
            placeholder="fullname"
            id="fullname"
            register={register}
            errors={errors}
            name="fullname"
          />
          <FormField
            label="Email"
            type="email"
            placeholder="email"
            id="email"
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
          <div className="my-8 flex justify-between gap-4">
            <button
              className="btn btn-lg rounded-full bg-transparent border border-indigoLight w-1/2 text-indigoLight font-medium"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-lg bg-indigoLight text-white w-1/2 rounded-full border-0"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader className="animate-spin mr-2" /> Saving
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
