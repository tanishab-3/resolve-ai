import { redirect } from "next/navigation";
import AppHeader from "../../components/AppHeader";
import NewComplaintForm from "./NewComplaintForm";
import { requireUser } from "@/lib/auth/session";
import { getOrganizationById } from "@/lib/organizations";

export const dynamic = "force-dynamic";

export default async function NewComplaintPage() {
  const user = await requireUser();
  if (user.role !== "citizen") redirect("/admin");

  const org = await getOrganizationById(user.organizationId);

  return (
    <>
      <AppHeader user={user} orgName={org?.name} />
      <NewComplaintForm />
    </>
  );
}