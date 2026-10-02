import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AudioPage from "./pages/AudioPage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StoriesList from "./pages/admin/StoriesList";
import StoryEditor from "./pages/admin/StoryEditor";
import CommentsList from "./pages/admin/CommentsList";
import VideosList from "./pages/admin/VideosList";
import VideoEditor from "./pages/admin/VideoEditor";
import SiteContentEditor from "./pages/admin/SiteContentEditor";
import AudioList from "./pages/admin/AudioList";
import AudioEditor from "./pages/admin/AudioEditor";
import MessagesList from "./pages/admin/MessagesList";

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/works" element={<Works />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/audio" element={<AudioPage />} />
          <Route path="/books" element={<Works />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/messages" element={<MessagesList />} />
            <Route path="/admin/stories" element={<StoriesList />} />
            <Route path="/admin/stories/new" element={<StoryEditor />} />
            <Route path="/admin/stories/:id" element={<StoryEditor />} />
            <Route path="/admin/comments" element={<CommentsList />} />
            <Route path="/admin/videos" element={<VideosList />} />
            <Route path="/admin/videos/new" element={<VideoEditor />} />
            <Route path="/admin/videos/:id" element={<VideoEditor />} />
            <Route path="/admin/site-content" element={<SiteContentEditor />} />
            <Route path="/admin/audio" element={<AudioList />} />
            <Route path="/admin/audio/new" element={<AudioEditor />} />
            <Route path="/admin/audio/:id" element={<AudioEditor />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
