import { DemoResetPasswordForm } from "@/components/forms/demo-reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;

  return <DemoResetPasswordForm returnTo={returnTo ?? "/login"} />;
}