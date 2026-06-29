import { Routes, Route } from "react-router-dom";
import Header from "./sections/header";
import Footer from "./sections/footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Game from "./pages/Game";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="justify-center items-start max-w-5xl mx-auto py-6 px-4 lg:px-2 flex flex-col gap-6 min-h-screen">
        <Header />
        <div className="w-full flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
        <div className="w-full self-center">
          <Footer />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
