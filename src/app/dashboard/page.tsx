// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  console.log("User:", user);

  // Step 1: get the personal account for the logged-in user
const { data: personalAccount } = await supabase
  .from("basejump.account_user")
  .select(`
    account_id,
    account_role,
    accounts(
      id,
      slug,
      parent_account_id,
      account_type,
      name
    )
  `)
  .eq("user_id", user.id)
  .maybeSingle();

  console.log("Personal Account:", personalAccount);

if (!personalAccount) redirect("/setup");

// Step 2: determine the team account
let teamAccountId = personalAccount.accounts.parent_account_id || personalAccount.account_id;

const { data: teamAccount } = await supabase
  .from("basejump.accounts")
  .select("*")
  .eq("id", teamAccountId)
  .maybeSingle();

if (!teamAccount) redirect("/setup");

// Step 3: optionally, fetch team_members or roles for RBAC
const { data: teamMember } = await supabase
  .from("basejump.team_members")
  .select(`
    team_id,
    role,
    teams(name, slug)
  `)
  .eq("user_id", user.id)
  .eq("teams.account_id", teamAccount.id)
  .maybeSingle();

  redirect(`/dashboard/${teamAccount.slug}`);

}
