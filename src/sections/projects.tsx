import { sectionsData } from "../data/sections-data";
import ProjectCard from "../sections/components/project-card";

const Projects = () => {
  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        03 — projects
      </p>
      <div className="flex flex-col gap-3">
        {sectionsData.projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
