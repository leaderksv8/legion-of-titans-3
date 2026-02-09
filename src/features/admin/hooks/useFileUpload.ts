import { useState, useCallback } from "react";
import { logger } from "@/shared/lib/logger";

type UploadType = "team" | "events";
type UploadKind = "cover" | "photo";

interface UploadPayload {
  type: UploadType;
  kind?: UploadKind;
  folder?: string;
  file: File | File[];
}

interface UseFileUploadReturn {
  upload: (payload: UploadPayload) => Promise<string[]>;
  busy: boolean;
}

export function useFileUpload(csrf: string): UseFileUploadReturn {
  const [busy, setBusy] = useState(false);

  const upload = useCallback(
    async (payload: UploadPayload): Promise<string[]> => {
      setBusy(true);
      try {
        const fd = new FormData();
        fd.append("type", payload.type);
        if (payload.kind) fd.append("kind", payload.kind);
        if (payload.folder) fd.append("folder", payload.folder);
        
        const files = Array.isArray(payload.file) ? payload.file : [payload.file];
        files.forEach((f) => fd.append("files", f));
        
        const headers: Record<string, string> = {};
        if (csrf) headers["x-lot-csrf"] = csrf;
        
        const r = await fetch("/api/admin/upload.php", { method: "POST", headers, body: fd });
        const j = await r.json().catch(() => ({}));
        
        if (!j?.ok || !Array.isArray(j?.paths)) {
          throw new Error("upload_failed");
        }
        
        return j.paths as string[];
      } catch (err) {
        logger.error("useFileUpload.upload", err);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [csrf]
  );

  return {
    upload,
    busy,
  };
}
