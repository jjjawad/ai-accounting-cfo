import { getSupabaseServerClient } from "../supabase/server-client";

export async function markFileAsError(fileId: string, errorCode: string): Promise<void> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("files")
    .update({
      status: "error",
      error_message: errorCode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", fileId);

  if (error) {
    throw new Error(`FILE_ERROR_STATUS_UPDATE_FAILED: ${error.message}`);
  }
}
