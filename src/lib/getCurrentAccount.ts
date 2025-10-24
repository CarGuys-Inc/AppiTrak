// lib/getCurrentAccount.ts
import { createClient } from "@/utils/supabase/server";

export async function getCurrentAccount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: accountUser } = await supabase
    .from("basejump.account_user")
    .select("account_id, accounts!inner(account_type)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!accountUser) return null;

  return {
    user,
    account_id: accountUser.account_id,
    account_type: accountUser.accounts.account_type,
  };
}
