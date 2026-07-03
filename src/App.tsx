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
      <div className="flex flex-col lg:flex  min-h-screen">
        <Header />
        <main className="flex-1 min-w-0 px-4 pt-6 pb-16 lg:ml-56 lg:pt-12 lg:px-8">
          <div className="mx-auto max-w-[42rem]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/game" element={<Game />} />
            </Routes>
            <Footer />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
