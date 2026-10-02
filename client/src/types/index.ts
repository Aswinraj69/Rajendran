export type Language = "ml" | "en";

export type StoryCategory = "story" | "poem" | "essay" | "script-note" | "article" | "other";
export type ContentStatus = "draft" | "published";

export interface Story {
  _id: string;
  titleMalayalam?: string;
  titleEnglish?: string;
  slug: string;
  excerptMalayalam?: string;
  excerptEnglish?: string;
  contentMalayalam?: string;
  contentEnglish?: string;
  coverImage?: string;
  category: StoryCategory;
  tags: string[];
  featured: boolean;
  status: ContentStatus;
  likesCount?: number;
  sharesCount?: number;
  commentsCount?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  storyId: string | { _id: string; titleEnglish?: string; titleMalayalam?: string; slug?: string };
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type VideoCategory =
  | "interviews"
  | "stories"
  | "script"
  | "talks"
  | "music"
  | "short-films"
  | "youtube"
  | "other";

export interface Video {
  _id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnail?: string;
  category: VideoCategory;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AudioCategory =
  | "music"
  | "poetry"
  | "audio-stories"
  | "voice"
  | "podcasts"
  | "background-music"
  | "other";

export interface AudioTrack {
  _id: string;
  titleMalayalam?: string;
  titleEnglish?: string;
  descriptionMalayalam?: string;
  descriptionEnglish?: string;
  audioUrl: string;
  coverImage?: string;
  category: AudioCategory;
  duration?: number;
  narrator?: string;
  featured: boolean;
  playsCount?: number;
  likesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface YouTubePost {
  _id: string;
  content: string;
  images?: string[];
  youtubeVideoId?: string;
  videoTitle?: string;
  youtubeUrl?: string;
  likesCount: number;
  commentsCount: number;
  publishedAt: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  counts: {
    stories: number;
    videos: number;
    audio: number;
    books: number;
    projects: number;
    messages?: number;
    unreadMessages?: number;
    comments?: number;
    media: number;
  };
  recentStories: Pick<Story, "_id" | "titleEnglish" | "titleMalayalam" | "status" | "updatedAt">[];
  recentVideos: Pick<Video, "_id" | "title" | "category" | "updatedAt">[];
  recentMessages?: Pick<ContactMessage, "_id" | "name" | "email" | "subject" | "message" | "read" | "createdAt">[];
}
