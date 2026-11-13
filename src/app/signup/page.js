import { getOrganizations } from "@/lib/organizations";
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const orgs = await getOrganizations();
  const options = orgs.map((o) => ({ id: o.id, name: o.name }));

  return <SignupForm orgs={options} />;
}