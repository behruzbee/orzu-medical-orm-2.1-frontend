import { useEffect, useState } from "react";
import { api } from "@/shared/api/api";

const evidencePath = /\/api\/feedbacks\/evidence\/([0-9a-f-]{36})\/file$/i;

export function useProtectedMediaUrl(mediaUrl?: string): string | undefined {
  const pathname = mediaUrl
    ? new URL(mediaUrl, window.location.origin).pathname
    : "";
  const evidenceId = pathname.match(evidencePath)?.[1];
  const [resolved, setResolved] = useState<{ id: string; url: string }>();

  useEffect(() => {
    if (!evidenceId) return;
    let cancelled = false;
    let createdUrl: string | undefined;

    api
      .get<Blob>(`/feedbacks/evidence/${evidenceId}/file`, {
        responseType: "blob",
      })
      .then(({ data }) => {
        if (cancelled) return;
        createdUrl = URL.createObjectURL(data);
        setResolved({ id: evidenceId, url: createdUrl });
      })
      .catch(() => {
        if (!cancelled) setResolved(undefined);
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [evidenceId]);

  return evidenceId
    ? resolved?.id === evidenceId
      ? resolved.url
      : undefined
    : mediaUrl;
}
