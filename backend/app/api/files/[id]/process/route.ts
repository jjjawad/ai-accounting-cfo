import { NextRequest } from "next/server";
import {
  badRequest,
  forbidden,
  notFound,
  ok,
  serverError,
} from "../../../../../server/api/_utils/responses";
import { assertUserBelongsToCompany, requireUser } from "../../../../../lib/auth/server-auth";
import { getSupabaseServerClient } from "../../../../../lib/supabase/server-client";
import { getN8nIngestionConfig } from "../../../../../lib/config/n8n";

function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser(request as unknown as Request);
    const { id } = await context.params;

    if (!id || typeof id !== "string" || !isValidUuid(id)) {
      return badRequest("Invalid file id", { code: "INVALID_FILE_ID" });
    }

    const supabase = getSupabaseServerClient();
    const { data: file, error } = await supabase
      .from("files")
      .select("id, company_id, storage_path, type, original_name, mime_type, size_bytes, status")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return serverError("Could not look up file", { code: "FILE_LOOKUP_FAILED" });
    }

    if (!file) {
      return notFound("File not found", { code: "FILE_NOT_FOUND" });
    }

    await assertUserBelongsToCompany({ userId: user.userId, companyId: file.company_id });

    const payload = {
      file_id: file.id,
      company_id: file.company_id,
      storage_path: file.storage_path,
      type: file.type,
      original_name: file.original_name,
      mime_type: file.mime_type,
      size_bytes: file.size_bytes,
    };

    try {
      const { webhookUrl, authToken } = getN8nIngestionConfig();
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return serverError("Failed to trigger ingestion pipeline", {
          code: "PIPELINE_TRIGGER_FAILED",
          details: { status: response.status },
        });
      }
    } catch (err) {
      if (err instanceof Response) {
        return err;
      }

      return serverError("Failed to trigger ingestion pipeline", {
        code: "PIPELINE_TRIGGER_FAILED",
      });
    }

    const { data: updatedFile, error: updateError } = await supabase
      .from("files")
      .update({ status: "processing" })
      .eq("id", file.id)
      .eq("company_id", file.company_id)
      .select("id, status")
      .maybeSingle();

    if (updateError || !updatedFile) {
      return serverError("Failed to update file status to processing", {
        code: "FILE_STATUS_UPDATE_FAILED",
      });
    }

    return ok({
      file_id: file.id,
      status: "processing_started",
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    if (error instanceof Error) {
      if (error.message === "NOT_COMPANY_MEMBER") {
        return forbidden("User is not a member of this company", {
          code: "FILE_CROSS_COMPANY_ACCESS",
        });
      }

      if (error.message === "MEMBERSHIP_LOOKUP_FAILED") {
        return serverError("Could not verify company membership", {
          code: "MEMBERSHIP_LOOKUP_FAILED",
        });
      }
    }

    return serverError("Unexpected error while preparing file processing", {
      code: "FILE_PROCESS_INIT_FAILED",
    });
  }
}
