import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

/**
 * Public: Submit a contact message / inquiry
 */
export const createContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw ApiError.badRequest("Name, email, subject, and message are required.");
  }

  const newMessage = await ContactMessage.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : undefined,
    subject: String(subject).trim(),
    message: String(message).trim(),
    read: false,
  });

  res.status(201).json({
    success: true,
    data: newMessage,
    message: "Thank you! Your message has been sent successfully.",
  });
});

/**
 * Admin: List all contact messages with pagination and unread counts
 */
export const listContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const queryFilter: Record<string, any> = {};
  if (req.query.read !== undefined) {
    queryFilter.read = String(req.query.read) === "true";
  }

  const [messages, total, unreadCount] = await Promise.all([
    ContactMessage.find(queryFilter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(queryFilter),
    ContactMessage.countDocuments({ read: false }),
  ]);

  res.json({
    success: true,
    data: messages,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      unreadCount,
    },
  });
});

/**
 * Admin: Mark a message as read/unread
 */
export const toggleContactMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await ContactMessage.findById(id);

  if (!message) {
    throw ApiError.notFound("Message not found");
  }

  message.read = req.body.read !== undefined ? Boolean(req.body.read) : !message.read;
  await message.save();

  res.json({
    success: true,
    data: message,
  });
});

/**
 * Admin: Delete a contact message
 */
export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await ContactMessage.findByIdAndDelete(id);

  if (!message) {
    throw ApiError.notFound("Message not found");
  }

  res.json({
    success: true,
    message: "Message deleted successfully",
  });
});
