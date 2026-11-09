import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  if (!getSupabasePublicConfig()) {
    return (
      <section className="w-full max-w-md border border-[#e7e5e4] bg-white p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-[#171717]">Servicio no disponible</h1>
        <p className="mt-2 text-sm leading-6 text-[#44403c]">
          El restablecimiento de contraseña no está configurado.
        </p>
      </section>
    );
  }

  const { data, error } = await (async () => {
    try {
      const supabase = await createSupabaseServerClient();
      return await supabase.auth.getUser();
    } catch {
      return { data: { user: null }, error: new Error("auth-unavailable") };
    }
  })();

  if (error || !data.user) {
    return (
      <section className="w-full max-w-md border border-[#e7e5e4] bg-white p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-[#171717]">Enlace no válido</h1>
        <p className="mt-2 text-sm leading-6 text-[#44403c]">
          {error?.message === "auth-unavailable"
            ? "El servicio de autenticación no está disponible."
            : "El enlace expiró o ya fue utilizado. Solicita uno nuevo."}
        </p>
      </section>
    );
  }

  const resolvedSearchParams = await searchParams;
  const flow = resolvedSearchParams.flow === "invite" ? "invite" : "recovery";
  return <ResetPasswordForm flow={flow} />;
}