import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/lib/icons";
import type { Social, Profile } from "../data/sections-data";

const Socials = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("socials").select("*").order("sort_order", { ascending: true }),
      supabase.from("profile").select("email").eq("id", 1).single(),
    ]).then(([{ data: socialData }, { data: profileData }]) => {
      if (socialData) setSocials(socialData as Social[]);
      if (profileData) setEmail((profileData as Profile).email);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="mb-14">
        <Skeleton className="h-3 w-16 mb-4" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-32" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        06 — socials
      </p>
      <div className="flex flex-col gap-2">
        {socials.map((social) => {
          const Icon = getIcon(social.icon_name);
          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors underline underline-offset-[3px] decoration-[0.5px] decoration-gray-300 hover:decoration-foreground"
            >
              {Icon && <Icon size={14} />}
              {social.name} ↗
            </a>
          );
        })}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors underline underline-offset-[3px] decoration-[0.5px] decoration-gray-300 hover:decoration-foreground mt-1"
          >
            <span className="text-[11px]">✉</span>
            {email} ↗
          </a>
        )}
      </div>
    </section>
  );
};

export default Socials;
