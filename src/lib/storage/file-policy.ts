export type PrivateStorageBucket =
  | "profiles"
  | "documents"
  | "submissions"
  | "payments"
  | "learning-materials"
  | "media"
  | "attachments";

const MiB = 1024 * 1024;

const policies: Record<
  PrivateStorageBucket,
  { maxBytes: number; extensions: readonly string[] }
> = {
  profiles: { maxBytes: 5 * MiB, extensions: [".jpg", ".jpeg", ".png", ".webp"] },
  documents: { maxBytes: 50 * MiB, extensions: [".pdf", ".jpg", ".jpeg", ".png"] },
  submissions: {
    maxBytes: 50 * MiB,
    extensions: [".pdf", ".zip", ".txt", ".jpg", ".jpeg", ".png"],
  },
  payments: { maxBytes: 10 * MiB, extensions: [".pdf", ".jpg", ".jpeg", ".png"] },
  "learning-materials": { maxBytes: 25 * MiB, extensions: [".pdf"] },
  media: { maxBytes: 50 * MiB, extensions: [".mp4", ".mov", ".webm"] },
  attachments: {
    maxBytes: 15 * MiB,
    extensions: [".pdf", ".zip", ".jpg", ".jpeg", ".png"],
  },
};

const mimeByExtension: Record<string, string> = {
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".txt": "text/plain",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

export function getPrivateFileSelectionError(
  bucket: PrivateStorageBucket,
  file: Pick<File, "name" | "size" | "type">,
): string | null {
  const policy = policies[bucket];
  if (file.size > policy.maxBytes) {
    return `El archivo supera el límite de ${policy.maxBytes / MiB} MiB para este tipo de archivo.`;
  }

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!policy.extensions.includes(extension)) {
    return "La extensión del archivo no está permitida para este uso.";
  }

  const expectedMime = mimeByExtension[extension];
  const declaredMime = file.type.toLowerCase();
  if (declaredMime && declaredMime !== expectedMime) {
    return "El tipo declarado por el navegador no coincide con la extensión permitida.";
  }

  return null;
}
