import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const MiB = 1024 * 1024;
const expectedBuckets = [
  {
    id: "profiles",
    public: false,
    fileSizeLimit: 5 * MiB,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  {
    id: "documents",
    public: false,
    fileSizeLimit: 50 * MiB,
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  {
    id: "submissions",
    public: false,
    fileSizeLimit: 50 * MiB,
    allowedMimeTypes: [
      "application/pdf",
      "application/zip",
      "text/plain",
      "image/jpeg",
      "image/png",
    ],
  },
  {
    id: "payments",
    public: false,
    fileSizeLimit: 10 * MiB,
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  {
    id: "learning-materials",
    public: false,
    fileSizeLimit: 25 * MiB,
    allowedMimeTypes: ["application/pdf"],
  },
  {
    id: "media",
    public: false,
    fileSizeLimit: 50 * MiB,
    allowedMimeTypes: ["video/mp4", "video/quicktime", "video/webm"],
  },
  {
    id: "attachments",
    public: false,
    fileSizeLimit: 15 * MiB,
    allowedMimeTypes: [
      "application/pdf",
      "application/zip",
      "image/jpeg",
      "image/png",
    ],
  },
] as const;

type ExpectedBucket = (typeof expectedBuckets)[number];
type ExistingBucket = {
  id: string;
  name: string;
  public: boolean;
  file_size_limit?: number | null;
  allowed_mime_types?: string[] | null;
};

const developmentProjectRef = "rxncsqoyovcwndgguxii";
const developmentGlobalLimit = 52_428_800;
const developmentConfirmation = "CREATE_BUCKETS_IN_DEVELOPMENT";

function fail(message: string): never {
  throw new Error(message);
}

function parseGlobalLimit(value: string | undefined): number {
  if (!value || !/^\d+$/.test(value)) {
    fail(
      "Global Storage limit is unavailable. Set SUPABASE_STORAGE_GLOBAL_LIMIT_BYTES after verifying the target configuration.",
    );
  }

  const globalLimit = Number(value);
  if (!Number.isSafeInteger(globalLimit) || globalLimit <= 0) {
    fail("SUPABASE_STORAGE_GLOBAL_LIMIT_BYTES must be a positive integer.");
  }

  return globalLimit;
}

function fetchWithSecretApiKey(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.delete("Authorization");
  return fetch(input, { ...init, headers });
}

function requireTarget(): {
  client: SupabaseClient;
  globalLimit: number;
  applyChanges: boolean;
} {
  const target = process.env.SUPABASE_TARGET_ENV;
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (target === "production") {
    fail("Refusing to provision Storage: Production is not an allowed target.");
  }
  if (target !== "local" && target !== "development") {
    fail("SUPABASE_TARGET_ENV must be exactly 'local' or 'development'.");
  }

  if (target === "local") {
    if (
      !url ||
      !/^https?:\/\/(127\.0\.0\.1|localhost)(?::\d+)?(?:\/|$)/i.test(url)
    ) {
      fail(
        "Refusing to provision Storage: SUPABASE_URL must point to local Supabase.",
      );
    }
  } else {
    const projectRef = process.env.SUPABASE_PROJECT_REF;
    const expectedUrl = `https://${developmentProjectRef}.supabase.co`;
    if (projectRef !== developmentProjectRef) {
      fail(
        `Refusing to provision Storage: SUPABASE_PROJECT_REF must be exactly '${developmentProjectRef}'.`,
      );
    }
    if (url !== expectedUrl && url !== `${expectedUrl}/`) {
      fail(
        `Refusing to provision Storage: SUPABASE_URL must be exactly ${expectedUrl}.`,
      );
    }
  }
  if (!secretKey) {
    fail("SUPABASE_SECRET_KEY is required and must remain server-side.");
  }

  const globalLimit = parseGlobalLimit(
    process.env.SUPABASE_STORAGE_GLOBAL_LIMIT_BYTES,
  );
  if (target === "development" && globalLimit !== developmentGlobalLimit) {
    fail(
      `Refusing to provision Development: SUPABASE_STORAGE_GLOBAL_LIMIT_BYTES must be ${developmentGlobalLimit}.`,
    );
  }

  const applyChanges =
    target === "local" ||
    (process.env.SUPABASE_STORAGE_APPLY === "true" &&
      process.env.SUPABASE_STORAGE_CONFIRM === developmentConfirmation);

  return {
    client: createClient(url!, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        fetch: secretKey.startsWith("sb_secret_")
          ? fetchWithSecretApiKey
          : undefined,
      },
    }),
    globalLimit,
    applyChanges,
  };
}

function normalizeMimeTypes(mimeTypes: string[] | null | undefined): string[] {
  return [...(mimeTypes ?? [])].sort();
}

function matches(
  actual: ExistingBucket,
  expected: ExpectedBucket,
): boolean {
  return (
    actual.public === expected.public &&
    actual.file_size_limit === expected.fileSizeLimit &&
    JSON.stringify(normalizeMimeTypes(actual.allowed_mime_types)) ===
      JSON.stringify([...expected.allowedMimeTypes].sort())
  );
}

function describeDifference(
  actual: ExistingBucket,
  expected: ExpectedBucket,
): string {
  return [
    `${expected.id}:`,
    `public expected=${expected.public} actual=${actual.public}`,
    `file_size_limit expected=${expected.fileSizeLimit} actual=${actual.file_size_limit ?? "null"}`,
    `allowed_mime_types expected=${expected.allowedMimeTypes.join(",")} actual=${(actual.allowed_mime_types ?? []).join(",")}`,
  ].join(" ");
}

async function listBuckets(client: SupabaseClient): Promise<ExistingBucket[]> {
  const { data, error } = await client.storage.listBuckets();
  if (error) fail(`Could not list Storage buckets: ${error.message}`);
  return data as ExistingBucket[];
}

async function verifyGlobalLimit(globalLimit: number): Promise<void> {
  const incompatible = expectedBuckets.filter(
    (bucket) => bucket.fileSizeLimit > globalLimit,
  );
  if (incompatible.length > 0) {
    fail(
      `Global Storage limit ${globalLimit} is lower than: ${incompatible.map((bucket) => bucket.id).join(", ")}.`,
    );
  }
}

async function provision(
  client: SupabaseClient,
  globalLimit: number,
  applyChanges: boolean,
): Promise<void> {
  await verifyGlobalLimit(globalLimit);

  const existing = await listBuckets(client);
  const existingById = new Map(existing.map((bucket) => [bucket.id, bucket]));
  const differences = expectedBuckets
    .filter((expected) => {
      const actual = existingById.get(expected.id);
      return actual !== undefined && !matches(actual, expected);
    })
    .map((expected) =>
      describeDifference(existingById.get(expected.id)!, expected),
    );

  if (differences.length > 0) {
    fail(
      `Existing Storage configuration differs; no buckets were changed:\n${differences.join("\n")}`,
    );
  }

  const missing = expectedBuckets.filter(
    (expected) => !existingById.has(expected.id),
  );
  if (!applyChanges) {
    console.log("Storage dry-run; no buckets were changed.");
    for (const bucket of expectedBuckets) {
      const state = existingById.has(bucket.id) ? "present" : "missing";
      console.log(
        `${state} ${bucket.id}: public=${bucket.public} file_size_limit=${bucket.fileSizeLimit} allowed_mime_types=${bucket.allowedMimeTypes.join(",")}`,
      );
    }
    return;
  }

  for (const bucket of missing) {
    const { error } = await client.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
      allowedMimeTypes: [...bucket.allowedMimeTypes],
    });
    if (error) {
      fail(`Could not create bucket ${bucket.id}: ${error.message}`);
    }
  }

  const verified = await listBuckets(client);
  const verifiedById = new Map(verified.map((bucket) => [bucket.id, bucket]));
  const verificationErrors = expectedBuckets
    .filter((expected) => {
      const actual = verifiedById.get(expected.id);
      return actual === undefined || !matches(actual, expected);
    })
    .map((expected) => {
      const actual = verifiedById.get(expected.id);
      return actual
        ? describeDifference(actual, expected)
        : `${expected.id}: bucket is missing after provisioning`;
    });

  if (verificationErrors.length > 0) {
    fail(
      `Storage verification failed after provisioning:\n${verificationErrors.join("\n")}`,
    );
  }

  console.log(
    missing.length === 0
      ? "Storage buckets already matched the expected local configuration; no changes made."
      : `Created ${missing.length} missing Storage bucket(s) and verified all seven configurations.`,
  );
}

async function main(): Promise<void> {
  const { client, globalLimit, applyChanges } = requireTarget();
  await provision(client, globalLimit, applyChanges);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown provisioning error.";
  console.error(message);
  process.exitCode = 1;
});
