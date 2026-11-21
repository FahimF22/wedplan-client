export type Role = "admin" | "vendor" | "customer";
export type ServiceStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type TxStatus = "pending" | "completed" | "failed" | "expired";

export interface VendorInfo {
  _id: string;
  name: string;
  email?: string;
  image?: string | null;
  businessName?: string | null;
  location?: string | null;
  bio?: string | null;
  phone?: string | null;
  isPremium?: boolean;
}

export interface Service {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description?: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vendor?: VendorInfo;
}

export interface ServiceDetails extends Service {
  isPublic: boolean;
  isOwner: boolean;
  activeBooking: Booking | null;
}

export interface Booking {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  service?: Pick<Service, "_id" | "serviceName" | "category" | "price" | "location" | "images">;
  vendor?: VendorInfo;
  customer?: VendorInfo;
}

export interface Profile {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role | null;
  isBlocked: boolean;
  businessName: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt: string | null;
  createdAt: string | null;
}

export interface Transaction {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId: string | null;
  status: TxStatus;
  createdAt: string;
  vendor?: VendorInfo;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  [k: string]: unknown;
}
