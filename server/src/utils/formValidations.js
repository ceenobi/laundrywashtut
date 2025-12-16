import { z } from "zod";

export const validateRegisterUserSchema = z.object({
  fullname: z.string().min(5, {
    message: "Full name must be at 5 characters long",
  }),
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  phone: z.string().min(14, {
    message: "Phone number is incomplete",
  }),
});
export const validateLoginUserSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});

export const validateForgotPasswordSchema = z.object({
  email: z.email({ message: "Email is required" }),
});

export const validateResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});

export const validateUpdateUserSchema = z.object({
  email: z.email({ message: "Email is required" }),
  fullname: z.string().min(5, {
    message: "Full name must be at 5 characters long",
  }),
  phone: z.string().min(12, {
    message: "Phone number is incomplete",
  }),
});


export const validateBookingSchema = z.object({
  serviceType: z
    .enum(["Wash and fold", "Dry cleaning", "Ironing and pressing"])
    .refine((value) => value !== "", {
      message: "Please select a service type",
    }),
  pickUpAddress: z.string().min(3, {
    message: "Address must be above 3 characters",
  }),
  pickUpPhone: z.string().min(14, {
    message: "Phone number is incomplete",
  }),
  date: z.coerce.date(),
  time: z
    .enum(["10:00 AM", "12:00 PM", "2:00 PM"])
    .refine((value) => value !== "", {
      message: "Please select a pickup time",
    }),
  deliveryAddress: z.string().min(5),
  deliveryPhone: z.string().min(14),
  shirt: z.coerce.number().optional(),
  trouser: z.coerce.number().optional(),
  senator: z.coerce.number().optional(),
  native: z.coerce.number().optional(),
  duvet: z.coerce.number().optional(),
  specialItem: z.coerce.number().optional(),
  total: z.coerce.number().nonnegative(),
});
