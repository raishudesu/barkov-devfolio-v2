import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import type { Experience as ExperienceType } from "@/lib/types";
import ExperienceCard from "./components/experience-card";

function ExperienceSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <Skeleton className="size-2.5 rounded-full mt-1.5" />
        <div className="w-px flex-1 bg-gray-200 mt-1.5" />
      </div>
      <div className="flex-1 pb-4 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

const Experience = () => {
  const [exp, setExp] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setExp(data as ExperienceType[]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        04 — experience
      </p>
      <div className="flex flex-col gap-4">
        {loading ? (
          <>
            <ExperienceSkeleton />
            <ExperienceSkeleton />
            <ExperienceSkeleton />
          </>
        ) : (
          exp.map((e, i) => (
            <ExperienceCard
              key={e.id}
              title={e.title}
              company={e.company}
              isCurrent={e.is_current}
              isLast={i === exp.length - 1}
              dateStart={e.date_start}
              dateEnd={e.date_end}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Experience;
