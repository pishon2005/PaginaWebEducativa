import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

const expectedProjectRef = "rxncsqoyovcwndgguxii";
const expectedUrl = `https://${expectedProjectRef}.supabase.co`;
const authorizedEmail = "contactoghan@gmail.com";
const redirectTo = "http://localhost:3000/auth/callback?next=/reset-password";

function fail(message: string): never {
  throw new Error(message);
}

function fetchWithSecretApiKey(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.delete("Authorization");
  return fetch(input, { ...init, headers });
}

function getRequiredEnvironment(): {
  client: SupabaseClient;
  url: string;
} {
  const target = process.env.SUPABASE_TARGET_ENV;
  const projectRef = process.env.SUPABASE_PROJECT_REF;
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (target !== "development") {
    fail("Refusing to invite a user: SUPABASE_TARGET_ENV must be 'development'.");
  }
  if (projectRef !== expectedProjectRef) {
    fail(
      `Refusing to invite a user: SUPABASE_PROJECT_REF must be '${expectedProjectRef}'.`,
    );
  }
  if (url !== expectedUrl) {
    fail(`Refusing to invite a user: SUPABASE_URL must be exactly ${expectedUrl}.`);
  }
  if (!secretKey) {
    fail("SUPABASE_SECRET_KEY is required and must remain server-side.");
  }

  return {
    url,
    client: createClient(url, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: secretKey.startsWith("sb_secret_")
          ? fetchWithSecretApiKey
          : undefined,
      },
    }),
  };
}

async function findUserByEmail(
  client: SupabaseClient,
  email: string,
): Promise<User | null> {
  for (let page = 1; ; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) fail(`Could not inspect Auth users: ${error.message}`);

    const matchingUser = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );
    if (matchingUser) return matchingUser;
    if (data.users.length < 1000) return null;
  }
}

async function verifyProfile(client: SupabaseClient, user: User): Promise<void> {
  const { data: profile, error: profileError } = await client
    .from("usuarios")
    .select("id, email, rol_id, estado")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    fail(`Could not verify the public profile: ${profileError.message}`);
  }
  if (!profile) {
    fail("Auth user was created, but the profile trigger has not produced public.usuarios.");
  }
  if (profile.email !== authorizedEmail) {
    fail("The profile email does not match the authorized test email.");
  }
  if (profile.estado !== "pendiente") {
    fail(`Unexpected initial profile state: ${profile.estado}.`);
  }

  const { data: role, error: roleError } = await client
    .from("roles")
    .select("nombre")
    .eq("id", profile.rol_id)
    .maybeSingle();

  if (roleError) fail(`Could not verify the profile role: ${roleError.message}`);
  if (role?.nombre !== "estudiante") {
    fail(`Unexpected initial profile role: ${role?.nombre ?? "missing"}.`);
  }

  console.log("Profile verified: public.usuarios linked, role estudiante, state pendiente.");
}

async function main(): Promise<void> {
  const { client } = getRequiredEnvironment();
  const existingUser = await findUserByEmail(client, authorizedEmail);

  if (existingUser) {
    console.log("A user with the authorized email already exists; no changes were made.");
    console.log(`Existing Auth user ID: ${existingUser.id}`);
    return;
  }

  console.log("No existing Auth user found. Sending one invitation...");
  const { data, error } = await client.auth.admin.inviteUserByEmail(
    authorizedEmail,
    { redirectTo },
  );

  if (error) {
    const createdUser = await findUserByEmail(client, authorizedEmail);
    if (createdUser) {
      fail(
        `Invitation response was ambiguous. The user exists with ID ${createdUser.id}; no retry was attempted.`,
      );
    }
    fail(`Invitation failed and no user was found afterward: ${error.message}`);
  }
  if (!data.user) fail("Invitation returned no user.");
  if (data.user.email?.toLowerCase() !== authorizedEmail) {
    fail("The invitation response email does not match the authorized email.");
  }
  if (!data.user.invited_at || data.user.email_confirmed_at) {
    fail("The invited user did not have the expected pending invitation state.");
  }

  console.log("Invitation sent.");
  console.log(`Auth user ID: ${data.user.id}`);
  console.log("Invitation status: pending acceptance.");
  await verifyProfile(client, data.user);
  console.log("No password was created and no administrative role was assigned.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Invitation failed.");
  process.exitCode = 1;
});
