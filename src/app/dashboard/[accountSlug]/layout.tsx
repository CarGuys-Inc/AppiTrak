// app/dashboard/[accountSlug]/layout.tsx
import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { accountSlug: string };
}) {
  const supabase = await createClient();

  // 1️⃣ Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2️⃣ Fetch the single account this user belongs to
  const { data: accountUser, error } = await supabase
    .from("basejump.account_user")
    .select(`
      account_id,
      account_role,
      accounts (
        name,
        slug,
        account_type
      )
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!accountUser) redirect("/setup");

  const activeAccount = accountUser;

  // 3️⃣ Validate URL slug
  if (params.accountSlug !== activeAccount.accounts.slug) {
    redirect(`/dashboard/${activeAccount.accounts.slug}`);
  }

  // 4️⃣ Navigation
  const navigation = [
    { name: "Overview", href: `/dashboard/${activeAccount.accounts.slug}` },
    { name: "Settings", href: `/dashboard/${activeAccount.accounts.slug}/settings` },
  ];

  return (
    <>
      <DashboardHeader
        accountId={activeAccount.account_id}
        navigation={navigation}
        role={activeAccount.account_role}
        accountType={activeAccount.accounts.account_type}
      />
      <div className="w-full p-8">{children}</div>
    </>
  );
}
