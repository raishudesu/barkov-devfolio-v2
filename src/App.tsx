import Header from "./sections/header";
import About from "./sections/about";
import TechStack from "./sections/tech-stack";
import Projects from "./sections/projects";
import Experience from "@/src/sections/experience";
import Certifications from "./sections/certifications";
import Footer from "./sections/footer";
import Socials from "./sections/socials";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="justify-center items-start max-w-5xl mx-auto py-6 px-4 lg:px-2 flex flex-col gap-6">
        <Header />
        <div className="flex gap-6 w-full">
          <div className="flex flex-col items-start justify-start gap-6 w-full">
            <About />
            <div className="lg:hidden w-full">
              <Experience />
            </div>
            <TechStack />
            <Projects />
            <div className="lg:hidden w-full flex flex-col items-start justify-start gap-6">
              <Certifications />
              <Socials />
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-start justify-start gap-6 w-full lg:max-w-sm">
            <Experience />
            <Certifications />
            <Socials />
          </div>
        </div>
        <div className="w-full self-center">
          <Footer />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
