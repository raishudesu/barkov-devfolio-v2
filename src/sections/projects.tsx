import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/lib/types";
import ProjectCard from "../sections/components/project-card";

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

const Projects = () => {
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

  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        03 — projects
      </p>
      <div className="flex flex-col gap-3">
        {loading ? (
          <>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </>
        ) : (
          projects.map((project) => (
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
