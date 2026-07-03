import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import type { TechStackItem } from "../data/sections-data";

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-gray-500 border border-gray-300 rounded-full">
      {children}
    </span>
  );
}

const CATEGORIES = [
  { key: "frontend", label: "frontend" },
  { key: "backend", label: "backend" },
  { key: "developer_tools", label: "developer tools" },
] as const;

const TechStack = () => {
  const [items, setItems] = useState<TechStackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tech_stack")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data as TechStackItem[]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        02 — tech stack
      </p>
      <div className="flex flex-col gap-4">
        {loading ? (
          <>
            {CATEGORIES.map(({ label }) => (
              <div key={label}>
                <Skeleton className="h-3 w-16 mb-2" />
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          CATEGORIES.map(({ key, label }) => {
            const filtered = items.filter((i) => i.category === key);
            if (filtered.length === 0) return null;
            return (
              <div key={key}>
                <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 mb-2">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {filtered.map((item) => (
                    <Tag key={item.id}>{item.name}</Tag>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default TechStack;
