import About from "../sections/about";
import TechStack from "../sections/tech-stack";
import Projects from "../sections/projects";
import Experience from "../sections/experience";
import BlogsSection from "../sections/blogs";
import Socials from "../sections/socials";
import GallerySection from "../sections/gallery";
import { InquiryForm } from "@/components/inquiry-form";

function Home() {
  return (
    <>
      <About />
      <TechStack />
      <Projects limit={3} />
      <Experience />
      <BlogsSection />
      <Socials />
      <GallerySection />
      <InquiryForm />
    </>
  );
}

export default Home;
