import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@/lib/types";

const About = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profile").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) setProfile(data as Profile);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="mb-14">
        <Skeleton className="h-3 w-20 mb-4" />
        <div className="flex items-start gap-5 mb-4">
          <Skeleton className="size-20 rounded-xl shrink-0" />
          <div className="pt-1 space-y-2 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        01 — about
      </p>
      <div className="flex items-start gap-5 mb-4">
        <img
          src={profile.avatar_url}
          alt={profile.name}
          className="size-20 rounded-xl border border-gray-200 object-cover shrink-0"
        />
        <div className="pt-1">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {profile.position}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {profile.about_paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-gray-500 leading-relaxed">{p}</p>
        ))}
      </div>
    </section>
  );
};

export default About;
