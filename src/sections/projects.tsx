import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/lib/types";
import ProjectCard from "../sections/components/project-card";
import { ArrowRight } from "@phosphor-icons/react";

function ProjectCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-card">
      <div className="flex items-start gap-4">
        <Skeleton className="size-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-1.5 mt-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProjectsProps {
  limit?: number;
}

const Projects = ({ limit }: ProjectsProps) => {
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

  const displayed = limit ? projects.slice(0, limit) : projects;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">03 — projects</p>
        <Link
          to="/projects"
          className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {loading ? (
          <>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </>
        ) : (
          displayed.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              link={project.link}
              techStack={project.tech_stack}
              imageLink={project.image_url ?? undefined}
            />
          ))
        )}
      </div>

    </section>
  );
};

export default Projects;
