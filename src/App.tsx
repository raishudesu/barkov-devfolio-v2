import Header from "./sections/header";
import About from "./sections/about";
import TechStack from "./sections/tech-stack";
import Projects from "./sections/projects";
import Experience from "@/src/sections/experience";
import Certifications from "./sections/certifications";
import Footer from "./sections/footer";
import Socials from "./sections/socials";
import "./App.css";

function App() {
  return (
    <main className="justify-center items-start max-w-5xl mx-auto py-6 px-2 flex flex-col gap-6">
      <Header />
      <div className="flex items-start justify-start gap-6 w-full">
        <div className="flex flex-col items-start justify-start gap-6 max-w-screen-sm">
          <About />
          <TechStack />
          <Projects />
        </div>
        <div className="flex flex-col items-start justify-start gap-6 w-full">
          <Experience />
          <Certifications />
          <Socials />
        </div>
      </div>
      <div className="w-full self-center">
        <Footer />
      </div>
    </main>
  );
}

export default App;
