import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import ProjectCard from "../sections/components/project-card";
import { Code, ArrowLeft } from "@phosphor-icons/react";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setProjects(data as Project[]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          back
        </Link>
        <div className="flex items-center justify-center py-20">
          <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Link
          to="/"
          className="self-start flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          back
        </Link>
        <Code size={32} className="text-gray-400" />
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mt-6 mb-2">projects</p>
        <h2 className="text-lg font-bold">Coming Soon</h2>
        <p className="text-sm text-gray-500 text-center max-w-sm mt-2">
          Projects are coming soon. Check back for my latest work.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={12} />
        back
      </Link>
      <div className="mb-6">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">projects</p>
        <h1 className="text-lg font-bold mt-1">All Projects</h1>
      </div>
      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            link={project.link}
            techStack={project.tech_stack}
            imageLink={project.image_url ?? undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
