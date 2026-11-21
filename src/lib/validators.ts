import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter");

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name").max(80),
    email: z.string().trim().toLowerCase().email("Please enter a valid email"),
    password: passwordSchema,
    role: z.enum(["customer", "vendor"], { message: "Choose an account type" }),
    businessName: z.string().trim().max(100).optional(),
  })
  .refine((v) => v.role !== "vendor" || (v.businessName && v.businessName.length >= 2), {
    path: ["businessName"],
    message: "Business name is required for vendors",
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});
export type SignInValues = z.infer<typeof signInSchema>;

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const bookingSchema = z.object({
  eventDate: z
    .string()
    .min(1, "Pick your event date")
    .refine((s) => new Date(`${s}T00:00:00`) >= today(), "Event date cannot be in the past"),
  eventLocation: z.string().trim().min(2, "Where is the event?").max(200),
  message: z.string().trim().max(1000, "Keep the message under 1000 characters").optional(),
});
export type BookingValues = z.infer<typeof bookingSchema>;

export const serviceSchema = z.object({
  serviceName: z.string().trim().min(3, "Service name must be at least 3 characters").max(100),
  category: z.string().min(1, "Choose a category"),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(3000),
  price: z.coerce.number<number>({ message: "Enter a price" }).positive("Price must be greater than 0"),
  location: z.string().trim().min(2, "Location is required").max(120),
});
export type ServiceValues = z.infer<typeof serviceSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  phone: z.string().trim().max(30).optional(),
  location: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(500, "Bio must be under 500 characters").optional(),
  businessName: z.string().trim().max(100).optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;
