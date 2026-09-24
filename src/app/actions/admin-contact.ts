"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/auth";
import {
  updateSubmissionReadStatus,
  updateSubmissionArchiveStatus,
} from "@/lib/admin/contact";

export interface AdminContactActionResponse {
  success: boolean;
  error?: string;
}

export async function toggleSubmissionReadAction(
  formData: FormData
): Promise<void> {
  const auth = await getAuthenticatedAdmin();
  if (!auth.isAuthenticated || !auth.isAuthorized) {
    return;
  }

  const id = formData.get("id");
  const targetStatus = formData.get("isRead") === "true";

  if (!id || typeof id !== "string") {
    return;
  }

  const res = await updateSubmissionReadStatus(id, targetStatus);
  if (res.success) {
    revalidatePath("/admin/contact");
  }
}

export async function toggleSubmissionArchiveAction(
  formData: FormData
): Promise<void> {
  const auth = await getAuthenticatedAdmin();
  if (!auth.isAuthenticated || !auth.isAuthorized) {
    return;
  }

  const id = formData.get("id");
  const targetStatus = formData.get("isArchived") === "true";

  if (!id || typeof id !== "string") {
    return;
  }

  const res = await updateSubmissionArchiveStatus(id, targetStatus);
  if (res.success) {
    revalidatePath("/admin/contact");
  }
}
