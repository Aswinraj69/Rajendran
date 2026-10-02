import { Request, Response } from "express";
import { SiteContent } from "../models/SiteContent";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

/**
 * Public: Get all site content.
 * Returns both a key-value dictionary and a list of all entries.
 */
export const getSiteContent = asyncHandler(async (_req: Request, res: Response) => {
  const items = await SiteContent.find().lean();
  const contentMap: Record<string, string> = {};

  for (const item of items) {
    contentMap[item.key] = item.value;
  }

  res.json({
    success: true,
    data: contentMap,
    list: items,
  });
});

/**
 * Admin: Bulk update or create site content entries.
 * Supports:
 * - { entries: [{ key: string, value: string, section?: string }] }
 * - { content: Record<string, string>, section?: string }
 */
export const updateSiteContent = asyncHandler(async (req: Request, res: Response) => {
  const { entries, content, section } = req.body;

  let itemsToUpdate: { key: string; value: string; section?: string }[] = [];

  if (Array.isArray(entries)) {
    itemsToUpdate = entries.filter((e) => e && typeof e.key === "string" && e.key.trim().length > 0);
  } else if (content && typeof content === "object") {
    itemsToUpdate = Object.entries(content).map(([k, v]) => ({
      key: k.trim(),
      value: String(v ?? ""),
      section,
    }));
  } else {
    throw ApiError.badRequest("Invalid payload. Provide 'entries' array or 'content' object.");
  }

  if (itemsToUpdate.length === 0) {
    res.json({ success: true, message: "No entries to update", updatedCount: 0 });
    return;
  }

  const operations = itemsToUpdate.map((item) => ({
    updateOne: {
      filter: { key: item.key },
      update: {
        $set: {
          key: item.key,
          value: item.value ?? "",
          ...(item.section ? { section: item.section } : {}),
        },
      },
      upsert: true,
    },
  }));

  const result = await SiteContent.bulkWrite(operations);

  // Return the refreshed map
  const allItems = await SiteContent.find().lean();
  const refreshedMap: Record<string, string> = {};
  for (const item of allItems) {
    refreshedMap[item.key] = item.value;
  }

  res.json({
    success: true,
    message: "Site content updated successfully",
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount,
    data: refreshedMap,
  });
});

/**
 * Admin: Delete a site content entry by key.
 */
export const deleteSiteContent = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  if (!key) throw ApiError.badRequest("Key parameter is required");

  const deleted = await SiteContent.findOneAndDelete({ key });
  if (!deleted) throw ApiError.notFound(`Key "${key}" not found`);

  res.json({
    success: true,
    message: `Key "${key}" removed successfully`,
  });
});
