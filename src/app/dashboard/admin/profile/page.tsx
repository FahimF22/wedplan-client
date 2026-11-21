import type { Metadata } from "next";
import { ProfileSettings } from "@/components/profile/ProfileSettings";

export const metadata: Metadata = { title: "Profile Settings" };

export default function ProfilePage() {
  return <ProfileSettings />;
}
