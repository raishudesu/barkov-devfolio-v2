import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import Header from "./sections/header";
import Footer from "./sections/footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfileEditor from "./pages/dashboard/sections/ProfileEditor";
import TechStackManager from "./pages/dashboard/sections/TechStackManager";
import ProjectsManager from "./pages/dashboard/sections/ProjectsManager";
import ExperienceManager from "./pages/dashboard/sections/ExperienceManager";
import SocialsManager from "./pages/dashboard/sections/SocialsManager";
import BlogList from "./pages/dashboard/blogs/BlogList";
import BlogEditor from "./pages/dashboard/blogs/BlogEditor";
import GalleryManager from "./pages/dashboard/gallery/GalleryManager";
import InquiriesManager from "./pages/dashboard/InquiriesManager";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <div className="flex flex-col lg:flex min-h-screen">
            <Header />
            <main className="flex-1 min-w-0 px-4 pt-6 pb-16 lg:ml-56 lg:pt-12 lg:px-8">
              <div className="mx-auto max-w-[42rem]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<ProfileEditor />} />
                    <Route path="tech-stack" element={<TechStackManager />} />
                    <Route path="projects" element={<ProjectsManager />} />
                    <Route path="experience" element={<ExperienceManager />} />
                    <Route path="socials" element={<SocialsManager />} />
                    <Route path="blogs" element={<BlogList />} />
                    <Route path="blogs/:id" element={<BlogEditor />} />
                    <Route path="gallery" element={<GalleryManager />} />
                    <Route path="inquiries" element={<InquiriesManager />} />
                  </Route>
                </Routes>
                <Footer />
              </div>
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
