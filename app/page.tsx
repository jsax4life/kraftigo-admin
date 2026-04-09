import { redirect } from "next/navigation";
import { getAdminFromRequest } from "@/lib/auth";

export default async function RootPage() {
  const admin = await getAdminFromRequest();
  
  if (admin) {
    redirect("/admin/dashboard");
  } else {
    redirect("/login");
  }
}
