// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  console.log("User:", user);

const { data: accountUser } = console.log(await supabase
  .from("account_user")
  .select(`
    account_id,
    account_role,
    team_id,
    accounts(id, slug, account_type, name),
    teams(id, name, slug)
  `)
  .eq("user_id", user.id)
  .maybeSingle()
)

console.log("Account User:", accountUser);
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
