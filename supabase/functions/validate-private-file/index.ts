import { createClient } from "npm:@supabase/supabase-js@2";

const MiB = 1024 * 1024;
const policies = {
  profiles: { maxBytes: 5 * MiB },
  documents: { maxBytes: 50 * MiB },
  submissions: { maxBytes: 50 * MiB },
  payments: { maxBytes: 10 * MiB },
  "learning-materials": { maxBytes: 25 * MiB },
  media: { maxBytes: 50 * MiB },
  attachments: { maxBytes: 15 * MiB },
} as const;

const allowedMimeTypes: Record<keyof typeof policies, readonly string[]> = {
  profiles: ["image/jpeg", "image/png", "image/webp"],
  documents: ["application/pdf", "image/jpeg", "image/png"],
  submissions: [
    "application/pdf",
    "application/zip",
    "text/plain",
    "image/jpeg",
    "image/png",
  ],
  payments: ["application/pdf", "image/jpeg", "image/png"],
  "learning-materials": ["application/pdf"],
  media: ["video/mp4", "video/quicktime", "video/webm"],
  attachments: [
    "application/pdf",
    "application/zip",
    "image/jpeg",
    "image/png",
  ],
};

const extensionsByMime: Record<string, readonly string[]> = {
  "application/pdf": [".pdf"],
  "application/zip": [".zip"],
  "text/plain": [".txt", ".py", ".js", ".ts"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],
};

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

function response(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, { status, headers: corsHeaders });
}

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((value, index) => bytes[index] === value);
}

function sniffMimeType(bytes: Uint8Array): string | null {
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return "application/pdf";
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (
    startsWith(bytes, [
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a,
    ])
  ) return "image/png";
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) return "image/webp";
  if (
    startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
    startsWith(bytes, [0x50, 0x4b, 0x05, 0x06]) ||
    startsWith(bytes, [0x50, 0x4b, 0x07, 0x08])
  ) return "application/zip";
  if (startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return "video/webm";
  if (String.fromCharCode(...bytes.slice(4, 8)) === "ftyp") {
    return String.fromCharCode(...bytes.slice(8, 12)) === "qt  "
      ? "video/quicktime"
      : "video/mp4";
  }

  if (bytes.length > 0 && !bytes.includes(0)) {
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return "text/plain";
    } catch {
      return null;
    }
  }

  return null;
}

function hasExpectedExtension(path: string, mimeType: string): boolean {
  const extensions = extensionsByMime[mimeType];
  if (!extensions) return false;
  const pathLower = path.toLowerCase();
  return extensions.some((extension) => pathLower.endsWith(extension));
}

function validContent(
  bucket: keyof typeof policies,
  path: string,
  declaredMimeType: string | null,
  bytes: Uint8Array,
): boolean {
  const actualMimeType = sniffMimeType(bytes);
  return actualMimeType !== null &&
    actualMimeType === declaredMimeType &&
    allowedMimeTypes[bucket].includes(actualMimeType) &&
    hasExpectedExtension(path, actualMimeType);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return response({ error: "method_not_allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("Authorization");
  const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error("Supabase function environment is incomplete");
    return response({ error: "validation_service_unavailable" }, 503);
  }
  if (!bearer) return response({ error: "unauthorized" }, 401);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return response({ error: "invalid_json" }, 400);
  }
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("fileId" in payload) ||
    typeof payload.fileId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(payload.fileId)
  ) {
    return response({ error: "invalid_file_id" }, 400);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${bearer}` } },
  });
  const { data: userData, error: authError } = await userClient.auth.getUser();
  if (authError || !userData.user) {
    return response({ error: "unauthorized" }, 401);
  }

  const fileId = payload.fileId;
  const { data: authorized, error: authorizationError } = await userClient.rpc(
    "can_upload_file",
    { p_file_id: fileId },
  );
  if (authorizationError) {
    console.error("Could not verify pending file authorization", authorizationError);
    return response({ error: "authorization_check_failed" }, 500);
  }
  if (!authorized) return response({ error: "forbidden" }, 403);

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: metadata, error: metadataError } = await serviceClient
    .from("archivos_metadata")
    .select("id,bucket_id,object_path,mime_type,propietario_id,estado")
    .eq("id", fileId)
    .maybeSingle();
  if (metadataError) {
    console.error("Could not load file metadata", metadataError);
    return response({ error: "metadata_lookup_failed" }, 500);
  }
  if (
    !metadata ||
    metadata.propietario_id !== userData.user.id ||
    metadata.estado !== "pending" ||
    !(metadata.bucket_id in policies)
  ) {
    return response({ error: "pending_file_not_found" }, 404);
  }

  const bucket = metadata.bucket_id as keyof typeof policies;
  const { data: file, error: downloadError } = await serviceClient.storage
    .from(bucket)
    .download(metadata.object_path);
  if (downloadError || !file) {
    console.error("Could not load pending Storage object", downloadError);
    return response({ error: "pending_object_not_found" }, 404);
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const valid = bytes.length <= policies[bucket].maxBytes &&
    allowedMimeTypes[bucket].includes(metadata.mime_type ?? "") &&
    validContent(bucket, metadata.object_path, metadata.mime_type, bytes);

  if (!valid) {
    const { data: quarantined, error: quarantineError } = await serviceClient
      .from("archivos_metadata")
      .update({
        estado: "quarantined",
        tamaño_bytes: bytes.length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", fileId)
      .eq("propietario_id", userData.user.id)
      .eq("estado", "pending")
      .select("id")
      .maybeSingle();
    if (quarantineError || !quarantined) {
      console.error("Could not quarantine invalid file", quarantineError);
      return response({ error: "quarantine_failed" }, 500);
    }

    const { error: removalError } = await serviceClient.storage
      .from(bucket)
      .remove([metadata.object_path]);
    if (removalError) {
      console.error("Could not remove invalid Storage object", removalError);
      return response({
        error: "invalid_file_quarantined",
        objectRemoved: false,
      }, 502);
    }
    return response({
      error: "invalid_file_content",
      objectRemoved: true,
      status: "quarantined",
    }, 422);
  }

  const { data: activated, error: activationError } = await serviceClient
    .from("archivos_metadata")
    .update({
      estado: "active",
      mime_type: metadata.mime_type,
      tamaño_bytes: bytes.length,
      updated_at: new Date().toISOString(),
    })
    .eq("id", fileId)
    .eq("propietario_id", userData.user.id)
    .eq("estado", "pending")
    .select("id,estado,tamaño_bytes,mime_type")
    .maybeSingle();
  if (activationError) {
    console.error("Could not activate validated file", activationError);
    return response({ error: "file_activation_failed" }, 500);
  }
  if (!activated) return response({ error: "pending_file_not_found" }, 409);

  return response({ file: activated }, 200);
});
