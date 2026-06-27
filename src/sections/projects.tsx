import { Button } from "@/components/ui/button";
import { sectionsData } from "@/src/data/sections-data";
import ProjectCard from "@/src/sections/components/project-card";
import { LinkIcon } from "@phosphor-icons/react";

const Projects = () => {
  return (
    <section className="w-full px-4 py-6 border border-gray-100 rounded-lg">
      <div className="flex flex-col items-start justify-start gap-2">
        <h2 className="text-2xl font-bold">Projects</h2>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 items-start justify-start gap-2 w-full">
        {sectionsData.projects.map((project) => (
          <ProjectCard
            key={project.title}
            {...project}
            content={
              <Button asChild>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon />
                  {project.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </Button>
            }
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
