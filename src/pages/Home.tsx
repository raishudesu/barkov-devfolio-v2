import About from "../sections/about";
import TechStack from "../sections/tech-stack";
import Projects from "../sections/projects";
import Experience from "../sections/experience";
import Certifications from "../sections/certifications";
import Socials from "../sections/socials";

function Home() {
  return (
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
  );
}

export default Home;
