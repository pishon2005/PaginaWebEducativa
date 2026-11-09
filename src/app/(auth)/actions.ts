"use server";

import { redirect } from "next/navigation";
import { getAuthCookieSummary } from "@/lib/supabase/server";
import {
  PasswordResetInputSchema,
  SignInInputSchema,
  type ActionResult,
} from "@/lib/domain";
import {
  getSafeRedirectPath,
  getSiteUrl,
  getSupabasePublicConfig,
} from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthActionResult = ActionResult<{ redirectTo: string }>;
type MessageActionResult = ActionResult<null>;

const invalidCredentialsMessage = "Correo o contraseña incorrectos.";

type AuthDiagnosticCode =
  | "auth_session_check"
  | "auth_session_valid"
  | "auth_session_missing"
  | "auth_session_invalid"
  | "password_update_failed"
  | "password_updated"
  | "signout_failed";

function getErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return { name: "unknown", code: "unknown", status: undefined };
  }

  const candidate = error as {
    name?: unknown;
    code?: unknown;
    status?: unknown;
  };

  return {
    name: typeof candidate.name === "string" ? candidate.name : "unknown",
    code: typeof candidate.code === "string" ? candidate.code : "unknown",
    status:
      typeof candidate.status === "number" ? candidate.status : undefined,
  };
}

async function logAuthDiagnostic(
  event: AuthDiagnosticCode,
  details: Record<string, unknown> = {},
) {
  const cookies = await getAuthCookieSummary();
  console.warn(
    JSON.stringify({
      scope: "auth.password",
      event,
      authCookieCount: cookies.count,
      authCookieNames: cookies.names,
      ...details,
    }),
  );
}

export async function signInAction(
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = SignInInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const redirectTo = getSafeRedirectPath(String(formData.get("next") ?? ""));

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "validation",
        message: "Revisa el correo y la contraseña.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const config = getSupabasePublicConfig();
  if (!config) {
    return {
      ok: false,
      error: {
        code: "not_configured",
        message: "El servicio de autenticación no está configurado.",
      },
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      return {
        ok: false,
        error: { code: "unauthenticated", message: invalidCredentialsMessage },
      };
    }

    return { ok: true, data: { redirectTo } };
  } catch {
    return {
      ok: false,
      error: {
        code: "offline",
        message: "No fue posible conectar con el servicio de autenticación.",
      },
    };
  }
}

export async function requestPasswordResetAction(
  _previous: MessageActionResult | null,
  formData: FormData,
): Promise<MessageActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const emailResult = SignInInputSchema.shape.email.safeParse(email);

  if (!emailResult.success) {
    return {
      ok: false,
      error: {
        code: "validation",
        message: "Ingresa un correo electrónico válido.",
        fieldErrors: { email: ["Ingresa un correo electrónico válido."] },
      },
    };
  }

  if (!getSupabasePublicConfig()) {
    return {
      ok: false,
      error: {
        code: "not_configured",
        message: "La recuperación real requiere configurar Supabase Auth.",
      },
    };
  }

  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    return {
      ok: false,
      error: {
        code: "not_configured",
        message: "Falta configurar la URL pública del sitio.",
      },
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(
      emailResult.data,
      { redirectTo: `${siteUrl}/auth/callback?next=/reset-password` },
    );

    if (error) {
      return {
        ok: false,
        error: {
          code: "unknown",
          message: "No fue posible solicitar la recuperación. Inténtalo más tarde.",
        },
      };
    }

    return { ok: true, data: null };
  } catch {
    return {
      ok: false,
      error: {
        code: "offline",
        message: "No fue posible conectar con el servicio de autenticación.",
      },
    };
  }
}

export async function updatePasswordAction(
  _previous: MessageActionResult | null,
  formData: FormData,
): Promise<MessageActionResult> {
  const parsed = PasswordResetInputSchema.safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "validation",
        message:
          parsed.error.flatten().fieldErrors.confirmation?.[0] ??
          "La contraseña debe tener al menos 8 caracteres.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  if (!getSupabasePublicConfig()) {
    return {
      ok: false,
      error: {
        code: "not_configured",
        message: "El restablecimiento real requiere configurar Supabase Auth.",
      },
    };
  }

  try {
    const cookieSummary = await getAuthCookieSummary();
    await logAuthDiagnostic("auth_session_check", {
      phase: "before_get_user",
      authCookieCount: cookieSummary.count,
    });
    const supabase = await createSupabaseServerClient({
      strictCookieWrites: true,
    });
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      const errorDetails = getErrorDetails(userError);
      await logAuthDiagnostic("auth_session_invalid", errorDetails);
      return {
        ok: false,
        error: {
          code: "auth_session_invalid",
          message:
            "La sesión de recuperación no es válida o ya expiró. Solicita un enlace nuevo.",
        },
      };
    }
    if (!userData.user) {
      await logAuthDiagnostic("auth_session_missing");
      return {
        ok: false,
        error: {
          code: "auth_session_missing",
          message:
            "No hay una sesión válida para actualizar la contraseña. Solicita un enlace nuevo.",
        },
      };
    }

    await logAuthDiagnostic("auth_session_valid", {
      phase: "get_user_succeeded",
    });

    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    if (updateError) {
      const errorDetails = getErrorDetails(updateError);
      await logAuthDiagnostic("password_update_failed", errorDetails);
      return {
        ok: false,
        error: {
          code: "password_update_failed",
          message: translatePasswordUpdateError(updateError),
        },
      };
    }
    await logAuthDiagnostic("password_updated");

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      const errorDetails = getErrorDetails(signOutError);
      await logAuthDiagnostic("signout_failed", errorDetails);
      return {
        ok: false,
        error: {
          code: "signout_failed",
          message:
            "La contraseña se actualizó, pero no se pudo cerrar la sesión. Cierra la sesión manualmente.",
        },
      };
    }
    await logAuthDiagnostic("password_updated", { phase: "signed_out" });

    return { ok: true, data: null };
  } catch (error) {
    const errorDetails = getErrorDetails(error);
    await logAuthDiagnostic("password_update_failed", {
      phase: "server_action",
      ...errorDetails,
    });
    return {
      ok: false,
      error: {
        code: "password_update_failed",
        message:
          "No fue posible completar la actualización. Inténtalo nuevamente.",
      },
    };
  }
}

function translatePasswordUpdateError(error: unknown) {
  const details = getErrorDetails(error);
  if (details.status === 422 || details.code === "weak_password") {
    return "La nueva contraseña no cumple los requisitos de seguridad.";
  }
  if (details.status === 401 || details.status === 403) {
    return "La sesión de recuperación no autoriza este cambio.";
  }
  return "No fue posible actualizar la contraseña. Inténtalo nuevamente.";
}

export async function signOutAction() {
  if (getSupabasePublicConfig()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) redirect("/login?error=logout");
  }

  redirect("/login");
}
