import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  const tables = [
    { key: "profile", label: "Profile", path: "/dashboard/profile" },
    { key: "tech_stack", label: "Tech Stack", path: "/dashboard/tech-stack" },
    { key: "projects", label: "Projects", path: "/dashboard/projects" },
    { key: "experience", label: "Experience", path: "/dashboard/experience" },
    { key: "socials", label: "Socials", path: "/dashboard/socials" },
    { key: "blogs", label: "Blogs", path: "/dashboard/blogs" },
    { key: "gallery", label: "Gallery", path: "/dashboard/gallery" },
    { key: "inquiries", label: "Inquiries", path: "/dashboard/inquiries" },
  ];

  useEffect(() => {
    tables.forEach(({ key }) => {
      supabase.from(key).select("id", { count: "exact", head: true }).then(({ count }) => {
        setCounts((prev) => ({ ...prev, [key]: count }));
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-lg font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tables.map(({ key, label, path }) => (
          <Link
            key={key}
            to={path}
            className="border rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            <p className="text-2xl font-bold">{counts[key] ?? "..."}</p>
            <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mt-1">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
