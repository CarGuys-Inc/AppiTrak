// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");


const { data: companyUser, error } = await supabase
  .schema('basejump')
  .from("company_users")
  .select("company_id, role, companies(name, slug, account_type)")
  .eq("user_id", user.id)
  .maybeSingle();
if (error) console.error(error)

  console.log(companyUser)

if (!companyUser) redirect("/setup");

redirect(`/dashboard/${companyUser.companies.slug}`);
}
